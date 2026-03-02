import os
from contextlib import contextmanager
import psycopg2
import psycopg2.extras
from psycopg2 import pool
import logging

logger = logging.getLogger(__name__)

# Configuration
DEPLOYMENT_ENV = os.getenv('DEPLOYMENT_ENV', 'ec2')  # 'lambda' or 'ec2'
USE_RDS_PROXY = os.getenv('USE_RDS_PROXY', 'false').lower() == 'true'
MIN_CONNECTIONS = int(os.getenv('DB_MIN_CONNECTIONS', '1'))
MAX_CONNECTIONS = int(os.getenv('DB_MAX_CONNECTIONS', '10'))

# Global connection pool (only used for EC2)
_connection_pool = None


def get_db_config():
    """Get database configuration from environment variables"""
    return {
        'dbname': os.getenv('DB_NAME', 'postgres'),
        'user': os.getenv('DB_USER'),
        'password': os.getenv('DB_PASSWORD'),
        'host': os.getenv('DB_HOST'),
        'port': os.getenv('DB_PORT', '5432'),
        'connect_timeout': 10,
        # Connection validation settings
        'keepalives': 1,
        'keepalives_idle': 30,
        'keepalives_interval': 10,
        'keepalives_count': 5,
    }


def get_connection_pool():
    """
    Get or create connection pool based on deployment environment
    
    Lambda: Only uses pool if RDS Proxy is enabled
    EC2: Always uses ThreadedConnectionPool
    """
    global _connection_pool
    
    if _connection_pool is None:
        db_config = get_db_config()
        
        if DEPLOYMENT_ENV == 'lambda' and not USE_RDS_PROXY:
            # Lambda without RDS Proxy: Don't use pooling
            # Connections are created and closed per request
            logger.info("Lambda environment without RDS Proxy - direct connections mode")
            return None
        elif DEPLOYMENT_ENV == 'lambda' and USE_RDS_PROXY:
            # Lambda with RDS Proxy: Use minimal pool
            # RDS Proxy handles actual connection pooling
            logger.info("Lambda environment with RDS Proxy - using SimpleConnectionPool")
            _connection_pool = pool.SimpleConnectionPool(
                minconn=1,
                maxconn=2,
                **db_config
            )
        else:
            # EC2: Use ThreadedConnectionPool for concurrent requests
            logger.info("EC2 environment - using ThreadedConnectionPool")
            _connection_pool = pool.ThreadedConnectionPool(
                minconn=MIN_CONNECTIONS,
                maxconn=MAX_CONNECTIONS,
                **db_config
            )
    
    return _connection_pool


def validate_connection(conn):
    """
    Validate that a connection is still alive
    Returns True if valid, False otherwise
    """
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        cursor.close()
        return True
    except Exception as e:
        logger.warning(f"Connection validation failed: {e}")
        return False


@contextmanager
def get_db_connection():
    """
    Context manager for database connections
    Automatically handles connection acquisition and release
    
    Lambda (no RDS Proxy): Creates new connection, closes after use
    Lambda (with RDS Proxy): Uses pool, validates connections
    EC2: Uses pool with validation
    
    Usage:
        with get_db_connection() as conn:
            result = fetch(conn, query, params)
    """
    pool_instance = get_connection_pool()
    connection = None
    using_pool = pool_instance is not None
    
    try:
        if using_pool:
            # Get connection from pool
            connection = pool_instance.getconn()
            
            # Validate connection (important for Lambda warm starts)
            if not validate_connection(connection):
                logger.info("Stale connection detected, creating new one")
                pool_instance.putconn(connection, close=True)
                connection = pool_instance.getconn()
        else:
            # Lambda without pool: Create direct connection
            logger.debug("Creating direct database connection")
            connection = psycopg2.connect(**get_db_config())
        
        yield connection
        connection.commit()
        
    except Exception as e:
        if connection:
            connection.rollback()
        logger.error(f"Database error: {e}")
        raise
    finally:
        if connection:
            if using_pool:
                # Return to pool
                pool_instance.putconn(connection)
            else:
                # Lambda without pool: Close connection completely
                connection.close()
                logger.debug("Direct connection closed")


def get_connection():
    """
    Legacy function for backward compatibility
    
    IMPORTANT for Lambda: This connection MUST be explicitly closed
    with close_connection() or it will remain open!
    
    Prefer using get_db_connection() context manager instead.
    """
    pool_instance = get_connection_pool()
    
    if pool_instance is None:
        # Lambda without pool: Create direct connection
        logger.debug("Creating direct connection (legacy)")
        return psycopg2.connect(**get_db_config())
    else:
        # Using pool
        connection = pool_instance.getconn()
        # Validate for Lambda warm starts
        if DEPLOYMENT_ENV == 'lambda' and not validate_connection(connection):
            logger.info("Stale connection in legacy mode, creating new one")
            pool_instance.putconn(connection, close=True)
            connection = pool_instance.getconn()
        return connection


def close_connection(connection):
    """
    Close or return connection based on environment
    
    Lambda (no pool): Closes connection completely
    Lambda/EC2 (with pool): Returns to pool
    """
    if connection:
        pool_instance = get_connection_pool()
        
        if pool_instance is None:
            # Lambda without pool: Close completely
            connection.close()
            logger.debug("Direct connection closed (legacy)")
        else:
            # Return to pool
            pool_instance.putconn(connection)


def connect():
    """
    Legacy direct connection (for backward compatibility)
    
    WARNING: In Lambda, this creates a connection that persists
    across invocations if not properly closed. Use with caution.
    """
    logger.warning("Direct connection used - consider using get_db_connection() context manager")
    print("Connecting to PostgreSQL")
    connection = psycopg2.connect(**get_db_config())
    return connection


def close_all_connections():
    """
    Close all connections in the pool
    Useful for cleanup during shutdown (EC2) or testing
    """
    global _connection_pool
    if _connection_pool:
        _connection_pool.closeall()
        _connection_pool = None
        logger.info("All database connections closed")


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
