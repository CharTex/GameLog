# File Name: Main.py
# File Description: Entrypoint for the API server. Uses FastAPI.

from typing import Union

from fastapi import FastAPI
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
else:
    print("Database connection failed. Exiting program...")
    exit(1)

class Account(BaseModel):
    email: EmailStr

class AccountCreate(Account):
    first_name: str
    last_name: str
    password: str

class AccountEdit(Account):
    first_name: str
    last_name: str
    password: str

class Review(BaseModel):
    game_name: str
    game_developer: str

class ReviewCreate(Review):
    review_score: int

class ReviewEdit(Review):
    review_score: int

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

@app.get("/login")
def login(email: str):
    return

@app.post("/accounts")
def new_account(email):
    return

@app.get("/accounts")
def retrieve_account(email, password):
    return
