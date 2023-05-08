# File Name: Main.py
# File Description: Entrypoint for the API server. Uses FastAPI.

# TODO: CHANGE THE NAME OF CUSTOMJWT

from typing import Annotated, Union
from datetime import datetime, timedelta

from fastapi import FastAPI, status, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from jose import JWTError, jwt

from DBManager import DBManager
import encryption
import authentication
import models

# Configuration settings for debug
# TODO: Move this config to a file?
database_path = "./storage/database.db"
# Configuaration Ends

database = DBManager(database_path)

def get_database():
    return database

if database.get_connected():
    app = FastAPI()

    # Setup CORS to allow local networks to connect for debug.
    app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    )
else:
    print("Database connection failed. Exiting program...")
    exit(1)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def Login():
    return NotImplementedError

@app.post("/accounts", summary="Request the creation of a new account.")
def new_account(account: models.AccountCreate):
    result = database.create_account(account.email, account.username, encryption.hash_password(account.password), "User")
    if result == "EmailAlreadyExists":
        return {"Status": "Failure", "Error": "Email Already Exists"}
    if result == "UsernameAlreadyExists":
        return {"Status": "Failure", "Error": "Username Already Exists"}
    if result == "Unknown Error":
        return {"Status": "Failure", "Error": "Unknown Error. Try Again Later"}
    else:
        return {"Status": "Success"}

@app.post("/login", summary="Get the access tokens using a username and password")
def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    id = database.verify_login_by_username(form_data.username, form_data.password)

    if id != False:
        access_token_expires = timedelta(minutes=authentication.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = authentication.create_access_token(
            data={"sub": form_data.username}, expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
@app.get("/users/me/", response_model=models.Account)
def read_users_me(
    current_user: Annotated[models.Account, Depends(authentication.get_current_user)]
):
    print(current_user)
    return {"email": "bob@bob.com", "username": "bob", "password": "hello"}
