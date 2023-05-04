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
                self.connection = sqlite3.connect(self.database_path)
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
    