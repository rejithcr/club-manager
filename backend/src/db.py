import psycopg2
import psycopg2.extras

conn = None

def get_connection():
    global conn
    if not conn:
        conn = connect()
        return conn
    return conn

def connect():
    print("Connecting to PostgreSQL")
    connection = psycopg2.connect(
        dbname="postgres",
        user="",
        password="",
        host="",
        port=6543
    )
    #engine = db.create_engine('postgresql://postgres.idgqxnsqcsigrehkxurd:%s@aws-0-ap-south-1.pooler.supabase.com:6543/postgres' % quote_plus('supa@base123*'))
    return connection


def fetch(connection, query, params):
    with connection.cursor(cursor_factory=psycopg2.extras.DictCursor) as cursor:
        cursor.execute(query, params)
        result = cursor.fetchall()
        return [dict(row) for row in result]

def fetch_one(connection, query, params):
    with connection.cursor(cursor_factory=psycopg2.extras.DictCursor) as cursor:
        cursor.execute(query, params)
        result = cursor.fetchone()
        return dict(result) if result else None


def execute(connection, query, params):
    with connection.cursor() as cursor:
        return cursor.execute(query, params)


def executemany(connection, query, params):
    with connection.cursor() as cursor:
        return cursor.execute(query, params)