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

from pydantic import BaseModel
from pydantic import EmailStr

from DBManager import DBManager
import encryption
import jwt as customjwt

# Configuration settings for debug
# TODO: Move this config to a file?
database_path = "./storage/database.db"
# Configuaration Ends

database = DBManager(database_path)

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

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Union[str, None] = None

class Account(BaseModel):
    email: str
    username: str
    password: str

class AccountCreate(Account):
    username: str
    password: str

class AccountEdit(Account):
    username: str
    password: str

class AccountLogin(BaseModel):
    username: str
    password: str

class Review(BaseModel):
    game_name: str
    game_developer: str

class ReviewCreate(Review):
    review_score: int

class ReviewEdit(Review):
    review_score: int

def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, customjwt.JWT_SECRET_KEY, algorithms=[customjwt.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError as e:
        print(e)
        raise credentials_exception
    user = database.lookup_account_by_username(username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

def Login():
    return NotImplementedError

@app.post("/accounts", summary="Request the creation of a new account.")
def new_account(account: AccountCreate):
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
        access_token_expires = timedelta(minutes=customjwt.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = customjwt.create_access_token(
            data={"sub": form_data.username}, expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
@app.get("/users/me/", response_model=Account)
def read_users_me(
    current_user: Annotated[Account, Depends(get_current_user)]
):
    print(current_user)
    return {"email": "bob@bob.com", "username": "bob", "password": "hello"}
