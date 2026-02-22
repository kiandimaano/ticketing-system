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