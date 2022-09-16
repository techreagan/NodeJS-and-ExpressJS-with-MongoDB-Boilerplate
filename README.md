# NodeJS / ExpressJS MongoDB(Mongoose) Boilerplate

This is my boilerplate for RESTful API with NodeJS and MongoDB.

## Boilerplate Branchers

Switch between branches to get the version you need

- master branch - advance typescript version that uses decorators for the boilerplate
- typescript branch - typescript version of the boilerplate
- vanilla_js branch - vanilla javascript boilerplate

## Boilerplate Features

- Authentication with JWT
- Reset Password with email (Using mailtrap for email testing)
- Email verification (Using mailtrap for email testing)
- User Create, Read, Update and Delete (CRUD) operations
- API Security (NoSQL Injections, XSS Attacks, http param pollution etc)

## Configuration File

Modify the config/.env file to your environment variables, set your JWT_SECRET and SMTP variables

```ENV
NODE_ENV=development
PORT=3001

MONGO_URI=YOUR_URL

JWT_SECRET=YOUR_SECRET
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

#In Minutes
RESET_PASSWORD_EXPIRATION_TIME=10
EMAIL_VERIFICATION_EXPIRATION_TIME=10

SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_EMAIL=
SMTP_PASSWORD=
FROM_EMAIL=noreply@boilerplate.com
FROM_NAME=Boilerplate
```

## Installation

Install all npm dependecies

```console
npm install
```

Install nodemon globally

```console
npm install -g nodemon
```

Run database seeder

```console
node seeder -i
```

Delete all data

```console
node seeder -d
```

## Run Boilerplate

```console
node run dev
```

## License

This project is licensed under the MIT License
