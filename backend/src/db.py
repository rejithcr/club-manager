import os

import psycopg2
import psycopg2.extras

def get_connection():
    return connect()

def close_connection(connection):
    connection.close()

def connect():
    print("Connecting to PostgreSQL")
    connection = psycopg2.connect(
        dbname="postgres",
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        host=os.getenv('DB_HOST'),
        port=os.getenv('DB_PORT')
    )
    #engine = db.create_engine("postgresql://os.getenv('DB_USER'):%s@=os.getenv('DB_HOST'):=os.getenv('DB_PORT')/postgres' % quote_plus(os.getenv('DB_PASSWORD')))
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