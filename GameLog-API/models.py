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