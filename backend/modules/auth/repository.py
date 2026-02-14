class AuthRepository:
    def __init__(self, db_pool):
        self.db_pool = db_pool
    
    def check_email(self, email):
        conn = self.db_pool.get_connection()
        try:
            cur = conn.cursor(dictionary=True)
            try:
                sql_query = "SELECT * FROM users WHERE email = %s"
                cur.execute(sql_query, (email,))
                result = cur.fetchone()
                return result
            finally:
                cur.close()
        finally:
            conn.close()

    
    def create_user(self, username, email, password):
        conn = self.db_pool.get_connection()
        try:
            cur = conn.cursor()
            try:
                if self.check_email(email):
                    raise ValueError('Email already exists')
                sql_query = "INSERT INTO users (username, email, password, role, created_at) VALUES (%s, %s, %s, 'user', NOW())"
                cur.execute(sql_query, (username, email, password))
                conn.commit()
            finally:
                cur.close()
        finally:
            conn.close()

    def login(self, email, password):
        conn = self.db_pool.get_connection()
        try:
            cur = conn.cursor()
            try:
                sql_query = "SELECT * FROM users WHERE email = %s"
                cur.execute(sql_query, (email,))
                result = cur.fetchone()
                return result
            finally:
                cur.close()
        finally:
            conn.close()