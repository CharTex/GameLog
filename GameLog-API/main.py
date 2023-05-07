# File Name: Main.py
# File Description: Entrypoint for the API server. Uses FastAPI.

from typing import Union

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel
from pydantic import EmailStr

from DBManager import DBManager
import encryption

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

@app.post("/accounts")
def new_account(account: AccountCreate):
    database.create_account(account.email, account.username, encryption.hash_password(account.password), "User")

@app.get("/accounts")
def retrieve_account(email, password):
    return

@app.get("/logintoken")
def get_login_token():
    return {"Hello": "World"}

@app.post("/login")
def login(account: AccountLogin):
    database.verify_login_by_username(account.username, encryption.hash_password(account.password))
    