import psycopg2
import psycopg2.extras


def connect():  
    conn = psycopg2.connect(
        dbname="postgres",
        user="",
        password="",
        host="",
        port=6543
    )
    return conn


def fetch(conn, query, params):
    with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cursor:
        cursor.execute(query, params)
        result = cursor.fetchall()
        return [dict(row) for row in result]

def fetch_one(conn, query, params):
    with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cursor:
        cursor.execute(query, params)
        result = cursor.fetchone()
        return dict(result) if result else None


def execute(conn, query, params):
    with conn.cursor() as cursor:
        return cursor.execute(query, params)


def executemany(conn, query, params):
    with conn.cursor() as cursor:
        return cursor.execute(query, params)