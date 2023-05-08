from datetime import datetime, timedelta

from typing import Annotated, Union
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

import models
import main

# TODO: Generate a unique key on first run?
ACCESS_TOKEN_EXPIRE_MINUTES = 60  # 30 Minutes
REFRESH_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 # 1 Week
ALGORITHM = "HS256"
JWT_SECRET_KEY = "Charmeleon"   # should be kept secret
JWT_REFRESH_SECRET_KEY = "Charizard"    # should be kept secret

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def create_access_token(data: dict, expires_delta: Union[timedelta, None] = None):
    # Function to generate an expirable token string.

    # Copy the data to be stored in the token.
    to_encode = data.copy()

    # Add an expiry datetime.
    # If time is not provided, set to 15 minutes.
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})

    # Finally encode all that information into a token string.
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    # Checks the payload for its authenticity.
    # First it decodes the token and checks it.
    # Then it ensures the account actually exists.

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # Decode the token
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[ALGORITHM])

        # Get the username from the payload. Error if username not provided.
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        
        # Formtat the tokendata.
        token_data = models.TokenData(username=username)
    except JWTError as e:
        print(e)
        raise credentials_exception
    
    # Check to ensure the account actually exists.
    user = main.get_database().lookup_account_by_username(username=token_data.username)
    if user is None:
        raise credentials_exception
    return user