"""
Database connection helper for the scheduled Lambda job.
Adapted from backend/src/db.py — uses direct connections (no pool)
which is appropriate for Lambda invocations.
"""
import os
import psycopg2
import psycopg2.extras
import logging

logger = logging.getLogger(__name__)


def get_db_config():
    """Read database configuration from environment variables."""
    return {
        'dbname': os.environ['DB_NAME'],
        'user': os.environ['DB_USER'],
        'password': os.environ['DB_PASSWORD'],
        'host': os.environ['DB_HOST'],
        'port': os.environ.get('DB_PORT', '5432'),
        'connect_timeout': 10,
        'keepalives': 1,
        'keepalives_idle': 30,
        'keepalives_interval': 10,
        'keepalives_count': 5,
    }


def get_connection():
    """Create and return a new direct psycopg2 connection."""
    config = get_db_config()
    logger.info(f"Connecting to PostgreSQL at {config['host']}:{config['port']}/{config['dbname']}")
    return psycopg2.connect(**config)


def fetch(conn, query, params=None):
    """Execute a SELECT query and return all rows as a list of dicts."""
    with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cursor:
        cursor.execute(query, params)
        return [dict(row) for row in cursor.fetchall()]


def execute(conn, query, params=None):
    """Execute a DML query (INSERT/UPDATE)."""
    with conn.cursor() as cursor:
        cursor.execute(query, params)


def execute_returning_count(conn, query, params=None) -> int:
    """Execute a DML query (DELETE/UPDATE) and return the number of rows affected."""
    with conn.cursor() as cursor:
        cursor.execute(query, params)
        return cursor.rowcount
