# Scheduled Notification Job – Lambda Function

A Python AWS Lambda function that runs daily to send notifications to club members about:
- **Upcoming events** (events scheduled for tomorrow)
- **Upcoming birthdays** (member birthdays tomorrow)

## Folder Structure

```
scheduled-jobs/notifier/src
├── lambda_function.py      # Main Lambda handler (entry point)
├── db.py                   # PostgreSQL connection helper
├── queries.py              # SQL queries
├── notification_service.py # DB notification + Expo push delivery
├── requirements.txt        # Python dependencies
└── README.md               # This file
```

## How It Works

### Events
For each event scheduled for tomorrow (`event_date = CURRENT_DATE + 1`, `status = 'Scheduled'`):
- All active members of the club that owns the event are notified
- A notification is saved to the `notification` table
- Expo push notifications are sent to registered devices

### Birthdays
For each member whose birthday is tomorrow:
- All fellow club members are notified ("🎂 X's birthday is tomorrow!")
- The birthday member themselves receives a personal greeting
- Notifications are saved and push messages are sent

---

## Environment Variables

These **must** be configured as Lambda environment variables:

| Variable      | Description                          | Example         |
|---------------|--------------------------------------|-----------------|
| `DB_NAME`     | PostgreSQL database name             | `postgres`      |
| `DB_HOST`     | Database host (RDS endpoint or IP)   | `mydb.rds.amazonaws.com` |
| `DB_USER`     | Database username                    | `appuser`       |
| `DB_PASSWORD` | Database password                    | `secret`        |
| `DB_PORT`     | Database port (optional, default `5432`) | `5432`      |

---

## Deployment

### 1. Install dependencies into a package folder

```bash
cd scheduled-jobs/notifier
python build.py
```

### 2. Create the ZIP archive

```bash
# Copy Lambda source files into the package folder
cp lambda_function.py db.py queries.py notification_service.py package/


### 3. Create the Lambda Function

In the AWS Console or via CLI:

```bash
aws lambda create-function \
  --function-name ccm-notifier \
  --runtime python3.12 \
  --handler lambda_function.handler \
  --zip-file fileb://notification_job.zip \
  --role arn:aws:iam::<ACCOUNT_ID>:role/<LAMBDA_EXECUTION_ROLE> \
  --timeout 60 \
  --memory-size 256
```

### 4. Set Environment Variables

```bash
aws lambda update-function-configuration \
  --function-name club-manager-notification-job \
  --environment "Variables={DB_NAME=postgres,DB_HOST=<host>,DB_USER=<user>,DB_PASSWORD=<pass>}"
```

Or configure them via the AWS Console → Lambda → Configuration → Environment variables.

### 5. Schedule with AWS EventBridge Scheduler

Create a schedule that triggers the Lambda daily.

**Recommended time:** 18:30 UTC = 00:00 IST (midnight India Standard Time)

In the AWS Console:
1. Go to **Amazon EventBridge → Schedules → Create schedule**
2. Schedule pattern: **Recurring schedule** → **Cron**
3. Cron expression: `30 18 * * ? *`
4. Target: **AWS Lambda** → select `ccm-notifier`
5. Set a **flexible time window** of 5–10 minutes (optional)

Or via CLI:
```bash
aws scheduler ccm-notify \
  --name daily-club-notifications \
  --schedule-expression "cron(30 18 * * ? *)" \
  --target '{"Arn":"arn:aws:lambda:<REGION>:<ACCOUNT>:function:club-manager-notification-job","RoleArn":"arn:aws:iam::<ACCOUNT>:role/<SCHEDULER_ROLE>"}' \
  --flexible-time-window '{"Mode":"FLEXIBLE","MaximumWindowInMinutes":10}'
```

---

## Lambda Configuration Recommendations

| Setting         | Recommended Value |
|-----------------|-------------------|
| Runtime         | Python 3.12       |
| Handler         | `lambda_function.handler` |
| Timeout         | 60 seconds        |
| Memory          | 256 MB            |
| VPC             | Required if RDS is in a private subnet |

> **Note:** If your RDS instance is in a private VPC subnet, you **must** configure the Lambda to run inside the same VPC with appropriate security group rules allowing outbound traffic on port 5432.

---

## Testing

### Manual Test via AWS Console
1. Open the Lambda function in the console
2. Click **Test** → create a new test event with an empty payload `{}`
3. Click **Test** again to invoke
4. Check the **Execution results** and **CloudWatch Logs** for the summary

### Check Notifications in DB
```sql
SELECT * FROM notification ORDER BY created_ts DESC LIMIT 20;
```

### Expected Lambda Response
```json
{
  "statusCode": 200,
  "body": "{\"status\": \"success\", \"summary\": {\"events_processed\": 2, \"event_notifications_sent\": 30, \"birthdays_processed\": 1, \"birthday_notifications_sent\": 16, \"errors\": []}}"
}
```
