class IssueRepository:
    def __init__(self, db_pool):
        self.db_pool = db_pool
    
    def create_ticket(self, title, category, department, description, submitted_by):
        conn = self.db_pool.get_connection()
        try:
            cur = conn.cursor()
            try:
                sql_query = "INSERT INTO tickets (title, category, department, description, submitted_by, submitted_at) VALUES (%s, %s, %s, %s, %s, NOW())"
                cur.execute(sql_query, (title, category, department, description, submitted_by))
                conn.commit()
            finally:
                cur.close()
        finally:
            conn.close()