from hashlib import sha256

def hash_password(password):
    # Returns the hash of the supplied password.
    hasher = sha256()
    password = password.encode('utf-8')
    hasher.update(password)
    hash = hasher.digest()
    return hash
