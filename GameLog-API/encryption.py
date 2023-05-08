from hashlib import sha256
from passlib.hash import argon2
import secrets

def hash_password(password):
    # Returns the hash of the supplied password.
    hashed_password = argon2.hash(password)
    return hashed_password
def verify_password(password, hashed_password):
    # Compares the provided password to the hashed version.
    return argon2.verify(password, hashed_password)
