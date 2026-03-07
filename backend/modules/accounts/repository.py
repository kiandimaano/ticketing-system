class AccountsRepository:
    def __init__(self, db_pool):
        self.db_pool = db_pool

    def get_all_users(self):
        conn = self.db_pool.get_connection()
        try:
            cur = conn.cursor(dictionary=True)
            try:
                sql_query = "SELECT * FROM users"
                cur.execute(sql_query)
                result = cur.fetchall()
                return result
            finally:
                cur.close()
        finally:
            conn.close()

    def get_user_by_id(self, user_id):
        conn = self.db_pool.get_connection()
        try:
            cur = conn.cursor(dictionary=True)
            try:
                cur.execute("SELECT user_id, username, email, role FROM users WHERE user_id = %s", (user_id,))
                return cur.fetchone()
            finally:
                cur.close()
        finally:
            conn.close()
    
    def edit_user(self, user_id, username=None, email=None, role=None):
        current = self.get_user_by_id(user_id)
        if not current:
            raise ValueError("User not found")
        username = username if username is not None else current['username']
        email = email if email is not None else current['email']
        role = role if role is not None else current['role']
        conn = self.db_pool.get_connection()
        try:
            cur = conn.cursor()
            try:
                sql_query = "UPDATE users SET username = %s, email = %s, role = %s WHERE user_id = %s"
                cur.execute(sql_query, (username, email, role, user_id))
                conn.commit()
            finally:
                cur.close()
        finally:
            conn.close()