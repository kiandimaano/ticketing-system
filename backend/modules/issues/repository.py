class IssueRepository:
    def __init__(self, db_pool):
        self.db_pool = db_pool
    
    def create_ticket(self, title, category, description, submitted_by, severity="medium"):
        conn = self.db_pool.get_connection()
        try:
            cur = conn.cursor()
            try:
                sql_query = "INSERT INTO tickets (title, category, description, submitted_by, submitted_at, severity, status) VALUES (%s, %s, %s, %s, NOW(), %s, 'open')"
                cur.execute(sql_query, (title, category, description, submitted_by, severity))
                conn.commit()
            finally:
                cur.close()
        finally:
            conn.close()
    
    def update_ticket_status(self, ticket_id, status):
        conn = self.db_pool.get_connection()
        try:
            cur = conn.cursor()
            try:
                sql_query = "UPDATE tickets SET status = %s WHERE ticket_id = %s"
                cur.execute(sql_query, (status, ticket_id))
                conn.commit()
            finally:
                cur.close()
        finally:
            conn.close()
    
    def get_all_user_tickets(self, submitted_by):
        conn = self.db_pool.get_connection()
        try:
            cur = conn.cursor(dictionary=True)
            try:
                sql_query = "SELECT * FROM tickets WHERE submitted_by = %s"
                cur.execute(sql_query, (submitted_by,))
                result = cur.fetchall()
            finally:
                cur.close()
        finally:
            conn.close()
        return result

    def get_all_tickets(self):
        conn = self.db_pool.get_connection()
        try:
            cur = conn.cursor(dictionary=True)
            try:
                sql_query = "SELECT * FROM tickets ORDER BY submitted_at DESC"
                cur.execute(sql_query)
                result = cur.fetchall()
            finally:
                cur.close()
        finally:
            conn.close()
        return result