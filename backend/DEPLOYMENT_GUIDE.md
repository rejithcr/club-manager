# Database Connection Pooling - Deployment Guide

This backend supports connection pooling for both **AWS Lambda** and **EC2** deployments.

## 🏗️ Architecture

### Connection Pooling Strategy

**IMPORTANT: Lambda Connection Handling**

AWS Lambda containers freeze (not terminate) after request completion. This creates a challenge:
- Pooled connections remain open in frozen containers
- Database may close idle connections (timeout: 10min-1hr)
- Reused containers might have stale connections

**Our Solution:**

- **Lambda (Default)**: NO POOLING - Creates/closes connections per request
  - Prevents stale connections in frozen containers
  - Safe for all scenarios
  - Small overhead (~50ms connection time)

- **Lambda + RDS Proxy**: Uses minimal pooling + validation
  - RDS Proxy manages actual connection pooling
  - Connection validation before each use
  - Best performance for high-traffic Lambda

- **EC2/Linux Server**: Full `ThreadedConnectionPool`
  - Connections persist for application lifetime
  - Handles concurrent requests efficiently
  - Optimal for long-running processes

## 🚀 Deployment

### 1. AWS Lambda Deployment (Without RDS Proxy)

**Recommended for:** Most Lambda deployments

#### Environment Variables
```bash
# Lambda-specific
DEPLOYMENT_ENV=lambda
USE_RDS_PROXY=false  # Important: disables pooling

# Database Configuration
DB_NAME=postgres
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=your-rds-endpoint.region.rds.amazonaws.com
DB_PORT=5432

# JWT Configuration
JWT_SECRET_KEY=your_secret_key
```

#### How It Works
- Creates new connection for each request
- Closes connection completely after request
- No stale connections in frozen containers
- ~50ms connection overhead per request

#### Lambda Configuration
- **Memory**: 512 MB - 1024 MB
- **Timeout**: 30 seconds
- **VPC**: Must be in same VPC as RDS if using private RDS
- **Max Concurrency**: Set based on DB connection limit (RDS max_connections / 2)

### 1b. AWS Lambda Deployment (With RDS Proxy)

**Recommended for:** High-traffic Lambda applications

#### Environment Variables
```bash
# Lambda with RDS Proxy
DEPLOYMENT_ENV=lambda
USE_RDS_PROXY=true  # Enables minimal pooling

# RDS Proxy endpoint (not direct RDS)
DB_HOST=your-rds-proxy-endpoint.region.rds.amazonaws.com
DB_NAME=postgres
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_PORT=5432
```

#### RDS Proxy Benefits
- Infrastructure-level connection pooling
- Connection validation and multiplexing
- Better performance than direct connections
- Handles Lambda scaling automatically

#### RDS Proxy Setup
1. Create RDS Proxy in AWS Console
2. Point it to your RDS instance
3. Configure IAM authentication (recommended)
4. Use proxy endpoint in `DB_HOST`

### 2. EC2/Linux Server Deployment

#### Environment Variables
```bash
# EC2-specific
DEPLOYMENT_ENV=ec2

# Database Configuration (same as Lambda)
DB_NAME=postgres
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=your-rds-endpoint.region.rds.amazonaws.com
DB_PORT=5432

# Connection Pool Settings
DB_MIN_CONNECTIONS=5
DB_MAX_CONNECTIONS=20

# JWT Configuration
JWT_SECRET_KEY=your_secret_key
```

#### Using Gunicorn (Recommended)
```bash
# Install Gunicorn
pip install gunicorn

# Run with multiple workers
gunicorn -w 4 -b 0.0.0.0:5000 "src.app:create_app()"
```

**Gunicorn Configuration**:
- Workers: 2-4 x CPU cores
- Max connections per worker: Adjust `DB_MAX_CONNECTIONS` accordingly
- Formula: `DB_MAX_CONNECTIONS >= (workers × expected_concurrent_requests_per_worker)`

#### Using Systemd Service
Create `/etc/systemd/system/cricket-club-api.service`:
```ini
[Unit]
Description=Cricket Club Manager API
After=network.target

[Service]
Type=notify
User=www-data
Group=www-data
WorkingDirectory=/opt/cricket-club-manager/backend
Environment="DEPLOYMENT_ENV=ec2"
Environment="DB_HOST=your-db-host"
Environment="DB_USER=your-db-user"
Environment="DB_PASSWORD=your-db-password"
Environment="DB_MIN_CONNECTIONS=5"
Environment="DB_MAX_CONNECTIONS=20"
ExecStart=/opt/cricket-club-manager/venv/bin/gunicorn -w 4 -b 0.0.0.0:8000 "src.app:create_app()"
ExecReload=/bin/kill -s HUP $MAINPID
KillMode=mixed
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable cricket-club-api
sudo systemctl start cricket-club-api
sudo systemctl status cricket-club-api
```

## 💻 Code Usage

### New Approach (Recommended)
Use context manager for automatic connection handling:

```python
from src.db import get_db_connection, fetch, execute

def get_members():
    with get_db_connection() as conn:
        members = fetch(conn, "SELECT * FROM members", ())
        return members

def create_member(data):
    with get_db_connection() as conn:
        execute(conn, "INSERT INTO members (name) VALUES (%s)", (data['name'],))
        # Auto-commits on success, auto-rollbacks on error
```

### Legacy Approach (Backward Compatible)
Existing code continues to work:

```python
from src import db

conn = db.get_connection()
try:
    members = db.fetch(conn, "SELECT * FROM members", ())
    return members
finally:
    db.close_connection(conn)
```

## 📊 Monitoring

### Connection Pool Metrics

Add to your monitoring:

```python
from src.db import get_connection_pool

pool = get_connection_pool()

# For SimpleConnectionPool (Lambda)
print(f"Pool available: {pool._pool}")

# For ThreadedConnectionPool (EC2)
print(f"Pool size: {pool._maxconn}")
print(f"Available connections: {pool._maxconn - len(pool._used)}")
```

### Database Connection Limits

Check PostgreSQL max connections:
```sql
SHOW max_connections;
```

Recommended settings:
- **RDS db.t3.micro**: max_connections = 100
- **Lambda**: Reserve 20-50 connections
- **EC2**: Configure based on traffic (typically 20-100)

## 🔧 Troubleshooting

### "Too many connections" Error

**Problem**: Exceeded PostgreSQL connection limit

**Solutions**:
1. Reduce `DB_MAX_CONNECTIONS` in environment variables
2. Increase RDS instance size (more connections)
3. Use RDS Proxy for connection pooling at infrastructure level
4. Reduce number of Lambda concurrent executions

### Connection Pool Exhausted

**Problem**: All pool connections in use

**Solutions**:
1. Increase `DB_MAX_CONNECTIONS`
2. Check for connection leaks (ensure `close_connection()` is called)
3. Use context manager (`get_db_connection()`) to auto-handle cleanup
4. Optimize slow queries

### Lambda Cold Start Slow

**Problem**: Connection pool initialization adds latency

**Solutions**:
1. Enable Lambda Provisioned Concurrency
2. Use RDS Proxy with IAM authentication
3. Consider keeping DEPLOYMENT_ENV=lambda (already optimized)

### Connection Timeouts

**Problem**: Idle connections timing out

**Solutions**:
1. Set `tcp_keepalives` in psycopg2 connection params
2. Use RDS Proxy with connection pooling
3. Implement connection validation before use

## 🔒 Security Best Practices

1. **Use AWS Secrets Manager** for DB credentials
2. **Enable SSL/TLS** for database connections
3. **Use IAM authentication** with RDS (preferred for Lambda)
4. **Restrict Security Groups** to only allow app server IPs
5. **Never commit credentials** to version control

## 📈 Performance Optimization

### Lambda
- Keep pool size small (1-2 connections)
- Use RDS Proxy for better connection management
- Enable Lambda SnapStart (Java) or similar for faster cold starts
- Monitor CloudWatch metrics for connection patterns

### EC2
- Set pool size based on expected concurrent requests
- Use Gunicorn with multiple workers
- Enable connection keep-alive
- Monitor with tools like pgBouncer or RDS Proxy

## 🧪 Testing

### Test Connection Pool
```python
# Test script
from src.db import get_db_connection

def test_connection_pool():
    connections = []
    try:
        # Get multiple connections
        for i in range(5):
            with get_db_connection() as conn:
                cursor = conn.cursor()
                cursor.execute("SELECT 1")
                result = cursor.fetchone()
                print(f"Connection {i}: {result}")
                connections.append(conn)
    except Exception as e:
        print(f"Error: {e}")

test_connection_pool()
```

## 📚 Additional Resources

- [psycopg2 Connection Pooling](https://www.psycopg.org/docs/pool.html)
- [AWS Lambda Best Practices](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)
- [RDS Proxy Documentation](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html)
- [Gunicorn Configuration](https://docs.gunicorn.org/en/stable/configure.html)
