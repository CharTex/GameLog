# File Name: DBManager.py
# File Description: Class to hold functions and data related to the database.

import sqlite3
import os
import time
import re
import json

import encryption


class DBManager:
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
                self.connection = sqlite3.connect(
                    self.database_path, check_same_thread=False
                )
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
            cursor.execute(
                """CREATE TABLE accounts (
            id            INTEGER    PRIMARY KEY AUTOINCREMENT,
            username      TEXT (100) NOT NULL,
            email         TEXT (512),
            password_hash TEXT (256) NOT NULL,
            date_created  INTEGER,
            last_login    INTEGER,
            account_type  TEXT (5) NOT NULL
            );"""
            )
            self.connection.commit()
        except Exception as e:
            print(f"Alert: {e}. Continuting...")
        try:
            cursor.execute(
                """CREATE TABLE reviews (
            id         INTEGER     PRIMARY KEY AUTOINCREMENT,
            account_id INTEGER     REFERENCES accounts (id) ON DELETE NO ACTION,
            game_name  TEXT (512)  NOT NULL,
            game_developer  TEXT (512),
            rating     INTEGER     NOT NULL,
            comment    TEXT (8192),
            location   TEXT (512),
            public     INTEGER
            );"""
            )
            self.connection.commit()
        except Exception as e:
            print(f"Alert: {e}. Continuting...")

    def verify_login_by_username(self, username, password):
        # Verifies login information using username and password.
        # Returns Account ID if valid login. Returns False if not.
        cursor = self.connection.cursor()
        cursor.execute(f"""SELECT * FROM accounts WHERE username='{username}'""")

        # Check if any data was retrieved.
        # If yes, get the first entry.
        rows = cursor.fetchall()
        if len(rows) != 0:
            if encryption.verify_password(password, rows[0][3]):
                return rows[0][0]

        return False

    def verify_login_by_email(self, email, password_hash):
        # Verifies login information using email and password hash.
        # Returns Account ID if valid login. Returns False if not.
        cursor = self.connection.cursor()
        cursor.execute(
            f"""SELECT * FROM accounts WHERE email='{email}' AND password_hash='{password_hash}'"""
        )

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

    def get_account_info_by_id(self, id):
        cursor = self.connection.cursor()
        cursor.execute(f"""SELECT * FROM accounts WHERE id='{id}'""")

        # Check if any data was retrieved.
        # If yes, get the first entry.
        rows = cursor.fetchall()
        if len(rows) != 0:
            return {
                "id": rows[0][0],
                "username": rows[0][1],
                "email": rows[0][2],
                "date_created": rows[0][4],
                "last_login": rows[0][5],
                "account_type": rows[0][6],
            }
        else:
            return False
        
    def update_last_login_by_id(self, id):
        # Updates the accounts "last updated" value to the current time
        cursor = self.connection.cursor()
        cursor.execute(f"""SELECT * FROM accounts WHERE id='{id}'""")

        # Check if any data was retrieved.
        # If yes, use the first entry.
        rows = cursor.fetchall()
        if len(rows) != 0:
            cursor.execute(f"""UPDATE accounts SET last_login='{time.time()}' WHERE id='{id}'""")
            self.connection.commit()
            

    def create_account(self, email, username, password_hash, account_type):
        # Creates an account in the database.

        if self.lookup_account_by_email(email):
            return "EmailAlreadyExists"

        if self.lookup_account_by_username(username):
            return "UsernameAlreadyExists"

        cursor = self.connection.cursor()
        try:
            cursor.execute(
                f"""INSERT INTO accounts (email, username, password_hash, account_type, date_created)
                  VALUES ('{email}', '{username}', '{password_hash}', '{account_type}', '{time.time()}')"""
            )
            self.connection.commit()
        except Exception as e:
            print("Unknown Error")
            print(e)
            return "UnknownError"
        return True
    
    def create_review(self, account_id, game_name, game_developer, rating, comment, location, public):
        # Creates a review in the database.
        cursor = self.connection.cursor()
        try:
            cursor.execute(
                f"""INSERT INTO reviews (account_id, game_name, game_developer, rating, comment, location, public)
                VALUES ({account_id}, '{game_name}', '{game_developer}', {rating},
                  '{comment}', '{location}', '{public}')"""
            )
            self.connection.commit()
        except Exception as e:
            print("Unknown Error")
            print(e)
            return "UnknownError"
        return True
    
    def get_all_public_reviews(self):
        # Gets all reviews with a public value of True
        cursor = self.connection.cursor()
        try:
            cursor.execute(
                "SELECT * FROM reviews WHERE public='True'"
            )

            # Get all public rows
            rows = cursor.fetchall()
            if len(rows) != 0:
                public_reviews = []
                for row in rows:
                    review_username = self.get_account_info_by_id(row[1])["username"]
                    public_reviews.append({"id": row[0], "username": review_username, "game_name": row[2], "game_developer": row[3], "rating": row[4], "comment": row[5]})

                return public_reviews


        except Exception as e:
            print("Unknown Error")
            print(e)
            return "UnknownError"
        return True
