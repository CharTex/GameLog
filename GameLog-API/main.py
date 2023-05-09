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
    # Returns a reference to the database object.
    return database

def email_verify(email):
        # Check the email against a generic email regex.
        regex = "^[a-zA-Z0-9-_]+@[a-zA-Z0-9]+\.[a-z]{1,3}$"
        if re.match(regex, email):
            return True
        return False


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

@app.post("/accounts", summary="Request the creation of a new account.")
def new_account(account: models.AccountCreate):
    # Creates a new account on the server.

    account.email = account.email.lower()

    # Server-side validation of email and passwords
    if not email_verify(account.email) or not password_verify(account.password):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Email or Password validation failed.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create the account. 
    result = database.create_account(account.email, account.username, encryption.hash_password(account.password), "user")
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
    if result == "UnknownError":
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Username Already Exists",
            headers={"WWW-Authenticate": "Bearer", "Detail": "Server Error"},
        )
    else:
        return {"Status": "Success"}

@app.post("/login", summary="Get the access tokens using a username and password")
def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):

    id = database.verify_login_by_username(form_data.username, form_data.password)

    if id != False:
        database.update_last_login_by_id(id)
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
    
@app.get("/me", response_model=models.AccountInfo, summary="Get information about the current logged in user.")
def read_users_me(
    current_user: Annotated[models.Account, Depends(authentication.get_current_user)]
):
    return database.get_account_info_by_id(current_user)

@app.post("/reviews", summary="Request the creation of a new review.")
def create_review (current_user: Annotated[models.ReviewCreate, Depends(authentication.get_current_user)], review: models.ReviewCreate):
    database.create_review(current_user, review.game_name, review.game_developer, review.rating, review.comment,
                           review.location, review.public)

@app.get("/reviews", summary="Get all publicly available reviews.")
def get_all_reviews(current_user: Annotated[models.Account, Depends(authentication.get_current_user)]):
    account_type = database.get_account_info_by_id(current_user)["account_type"]
    if account_type == "user":
        # User accounts only get public reviews with no location data.
        return database.get_all_public_reviews()
    elif account_type == "admin":
        # Admin accounts view all reviews + location data.
        return database.get_all_reviews()
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

@app.get("/reviews/{id}", summary="Get all of a user's reviews.")
def get_users_reviews(current_user: Annotated[models.Account, Depends(authentication.get_current_user)], id):
    # Users can only access their own reviews. Admins can access everyones.
    account_type = database.get_account_info_by_id(current_user)["account_type"]
    if account_type != False and account_type == "user":
        try:
            if database.get_account_info_by_id(current_user)["id"] != int(id):
                print("Invalid ID Match")
                print(f"Requested ID: {id} | Login ID: {current_user}")
            else:
                return database.get_reviews_by_id(current_user)
        except Exception as e:
            print("Potential Invalid ID")
    elif account_type != False and account_type == "admin":
        # If admin, Return regardless of authentication.
        return database.get_reviews_by_id(current_user)
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )