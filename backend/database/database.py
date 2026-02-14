import mysql.connector
from mysql.connector import pooling

class MySQLConnectionPool:
    def __init__(self):
        self.pool = pooling.MySQLConnectionPool(
            pool_name = "mypool",
            pool_size = 5,
            host = "localhost",
            user = "root",
            password = "",
            database = "ticketing_system"
        )
    
    def get_connection(self):
        return self.pool.get_connection()

db_pool = MySQLConnectionPool()