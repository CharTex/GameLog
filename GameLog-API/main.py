# File Name: Main.py
# File Description: Entrypoint for the API server. Uses FastAPI.

from typing import Annotated
from datetime import timedelta
import re

from fastapi import FastAPI, status, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware

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

def email_verify(email):
        regex = "^[a-zA-Z0-9-_]+@[a-zA-Z0-9]+\.[a-z]{1,3}$"
        if re.match(regex, email):
            return True
        return False

def password_verify(password):
    return True

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
    # Creates a new account on the server.

    # Server-side validation of email and passwords
    if not email_verify(account.email) or not password_verify(account.password):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Email or Password validation failed.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    result = database.create_account(account.email, account.username, encryption.hash_password(account.password), "User")
    if result == "EmailAlreadyExists":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email Already Exists",
            headers={"WWW-Authenticate": "Bearer", "Detail": "Username Already Exists"},
        )
    if result == "UsernameAlreadyExists":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username Already Exists",
            headers={"WWW-Authenticate": "Bearer", "Detail": "Username Already Exists"},
        )
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
