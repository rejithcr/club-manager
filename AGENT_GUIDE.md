# Application tech stack
## Frontend
1. Expo
2. React Native
3. TypeScript
4. Redux Toolkit
5. RTK Query
6. React Native Reanimated

## Auth
1. Google authentication

## Database
1. Supabase postgres sql database
2. Flyway for database migrations. (flyway script location: ./db)

## Backend
1. AWS Lambda with function url
2. Python
3. Flask
4. Codebase in ./backend

## Deployment
### Infrastructure
1. Terraform
2. Script location: ./infra

### Frontent
1. Deploy aws s3 (bucket name: sportsclubsmanager.com) with cloudfront
2. Domain registered in AWS: sportsclubsmanager.com

### Backend
- Deloy in ec2 with route53 records pointing to ec2 ip for api.sportsclubsmanager.com

### Database
1. Deploy in Supabase postgres sql database

### Infrastructure
1. Deploy in Terraform

## Domain
http://sportsclubsmanager.com/


