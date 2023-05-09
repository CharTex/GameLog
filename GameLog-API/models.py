# File Name: models.py
# File Description: Holds custom pydantic models used by the FastAPI server.

from pydantic import BaseModel
from typing import Union

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Union[str, None] = None

class Account(BaseModel):
    email: str
    username: str
    password: str

class AccountInfo(BaseModel):
    id: str
    email: str
    username: str
    date_created: str
    last_login: str
    account_type: str

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
    rating: int
    comment: str
    location: str
    public: bool

class ReviewEdit(Review):
    review_score: int