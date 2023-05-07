# File Name: Main.py
# File Description: Entrypoint for the API server. Uses FastAPI.

from typing import Annotated, Union

from fastapi import FastAPI, status, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel
from pydantic import EmailStr

from DBManager import DBManager
import encryption
import jwt

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

class Account(BaseModel):
    email: str

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

def Login():
    return NotImplementedError

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

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

@app.get("/accounts")
def retrieve_account(email, password):
    return

@app.get("/logintoken")
def get_login_token():
    return {"Hello": "World"}

# @app.post("/login", summary="Login using a username and password")
# def login(account: AccountLogin):
#     id = database.verify_login_by_username(account.username, encryption.hash_password(account.password))

#     if id != False:
#         login_token = database.generate_login_token(id)
#         return {"Status": "Success", "Token": str(login_token)}
#     else:
#         return {"Status": "Failure", "Error": "Username or Password incorrect."}


@app.post("/login", summary="Get the access tokens using a username and password")
def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    id = database.verify_login_by_username(form_data.username, encryption.hash_password(form_data.password))

    if id != False:
        return {"Status": "Success",
                 "access_token": jwt.create_access_token(form_data.username),
                   "refresh_token": jwt.create_refresh_token(form_data.username)}
    else:
        return {"Status": "Failure", "Error": "Username or Password incorrect."}

