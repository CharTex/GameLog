#

import sqlite3
import os
import time

class DBManager():

    connected = False
    database_path = None
    connection = None

    def __init__(self, path):
        # Perform initialization tasks for the database connection.
        self.database_path = path
        self.directory_check()
        self.connected = self.attempt_connection()

        if self.connected:
            self.initialize_tables()

    def directory_check(self):
        # Checks to see if directories need to be created.
        try:
            if not os.path.exists(self.database_path):
                os.makedirs(os.path.dirname(self.database_path), exist_ok=True)
        except PermissionError:
            print("Permission Error occured in Database Read/Write.")
            print("Please run the program from a directory with full user access.")
            exit(1)


    def get_connected(self):
        # Returns the database connection status
        return self.connection
    
    def attempt_connection(self):
        # Attempts to connect to the local database file.
        # Returns True if connection was successful.
        if self.database_path is not None:
            try:
                self.connection = sqlite3.connect(self.database_path, check_same_thread=False)
                time.sleep(0.5)
                return True
            except Exception as e:
                print("An error has occured initializing the database.")
                print("The error is as follows:")
                print(e)
        else:
            print("Database Path not Initialized")
            exit(1)
        return False
    
    def initialize_tables(self):
        # Creates the required tables for the program to function.
        # If the tables already exist, no changes will be made.
        cursor = self.connection.cursor()
        try:
            cursor.execute("""CREATE TABLE accounts (
            id            INTEGER    PRIMARY KEY AUTOINCREMENT,
            username      TEXT (100) NOT NULL,
            email         TEXT (512),
            password_hash TEXT (256) NOT NULL,
            date_created  INTEGER,
            last_login    INTEGER,
            account_type  TEXT (5) NOT NULL
            );""")
            self.connection.commit()
        except Exception as e:
            print(f"Alert: {e}. Continuting...")

        try:
            cursor.execute("""CREATE TABLE login_tokens (
            id         INTEGER      PRIMARY KEY AUTOINCREMENT,
            account_id              REFERENCES accounts (id) 
                            NOT NULL,
            access_token TEXT (256) NOT NULL,
            date_created INTEGER,
            expiry_date  INTEGER    NOT NULL
            );""")
            self.connection.commit()
        except Exception as e:
            print(f"Alert: {e}. Continuting...")

        try:
            cursor.execute("""CREATE TABLE reviews (
            id         INTEGER     PRIMARY KEY AUTOINCREMENT,
            account_id INTEGER     REFERENCES accounts (id) ON DELETE NO ACTION,
            rating     INTEGER     NOT NULL,
            comment    TEXT (8192),
            location   TEXT (512) 
            );""")
            self.connection.commit()
        except Exception as e:
            print(f"Alert: {e}. Continuting...")

    def verify_login_by_username(self, username, password_hash):
        # Verifies login information using username and password hash.
        # Returns Account ID if valid login. Returns False if not.
        cursor = self.connection.cursor()
        cursor.execute(f"""SELECT * FROM accounts WHERE username='{username}' AND password_hash='{password_hash}'""")
        
        # Check if any data was retrieved.
        # If yes, get the first entry.
        rows = cursor.fetchall()
        if len(rows) != 0:
            print(f"Successful Login from user id: {rows[0][0]}")
            return rows[0][0]
        else:
            return False

    def verify_login_by_email(self, email, password_hash):
        # Verifies login information using email and password hash.
        # Returns Account ID if valid login. Returns False if not.
        cursor = self.connection.cursor()
        cursor.execute(f"""SELECT * FROM accounts WHERE email='{email}' AND password_hash='{password_hash}'""")
        
        # Check if any data was retrieved.
        # If yes, get the first entry.
        rows = cursor.fetchall()
        if len(rows) != 0:
            return rows[0][0]
        else:
            return False

    def lookup_account_by_username(self, username):
        # Checks to see if the account exists using username.
        # Returns Account ID if account is found. Returns False if Not
        cursor = self.connection.cursor()
        cursor.execute(f"""SELECT * FROM accounts WHERE username='{username}'""")

        # Check if any data was retrieved.
        # If yes, get the first entry.
        rows = cursor.fetchall()
        if len(rows) != 0:
            return rows[0][0]
        else:
            return False
        
    def lookup_account_by_email(self, email):
        # Checks to see if the account exists using email.
        # Returns Account ID if account is found. Returns False if Not
        cursor = self.connection.cursor()
        cursor.execute(f"""SELECT * FROM accounts WHERE email='{email}'""")

        # Check if any data was retrieved.
        # If yes, get the first entry.
        rows = cursor.fetchall()
        if len(rows) != 0:
            return rows[0][0]
        else:
            return False

    def create_account(self, email, username, password_hash, account_type):
        # Creates an account in the database.
        # TODO: Duplicate Checking Error Codes.

        if (self.check_account_by_email(email)):
            return False
        
        if (self.check_account_by_username(username)):
            return False
        
        cursor = self.connection.cursor()
        try:
            print(password_hash)
            cursor.execute(f"""INSERT INTO accounts (email, username, password_hash, account_type) VALUES ('{email}', '{username}', '{password_hash}', '{account_type}')""")
            self.connection.commit()
        except Exception as e:
            print("Unknown Error?")
            print(e)

    def generate_login_token(self, id):
        return


    