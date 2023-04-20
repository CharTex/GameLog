#

import sqlite3
import os

class DBManager():

    connected = False
    database_path = None
    connection = None

    def __init__(self, path):
        # Perform initialization tasks for the database connection.
        self.database_path = path
        self.directory_check()
        self.connected = self.attempt_connection()

    def directory_check(self):
        # Checks to see if directories need to be created.
        print(self.database_path)

        try:
            if not os.path.exists(self.database_path):
                os.makedirs(os.path.dirname(self.database_path), exist_ok=True)
                print("Done")
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
                return True
            except Exception as e:
                print("An error has occured initializing the database.")
                print("The error is as follows:")
                print(e)
        else:
            print("Database Path not Initialized")
            exit(1)
        return False
    
database = DBManager("./Storage/database.db")