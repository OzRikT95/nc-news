# Northcoders News API

Hello and welcome to my NC News API, information can be found below.

# Hosted Northcoders New Api

https://nc-news-nwp8.onrender.com/

# Summary of project

This project is my very own real world backend API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as Reddit), which is to provide information to the incoming front end architecture.

You will find a list of the API's available in the endpoints.json file.

# How to clone, install dependencies, seed local database and run tests

- Clone the repo from https://github.com/OzRikT95/nc-news
- Install the dependencies using `npm install`
- Setup the databases using `npm run setup-dbs`
- Run the tests using `npm run test`

# How to create .env files needed

You will need to create 2 .env files and add the correct database for the environment

- .env.test
  - `PGDATABASE = nc_news_test`
- .env.development
  - `PGDATABASE = nc_news`

# Minimum versons of Node.js and Postgres required

- Node.js version 21.5.0
- Postgres version 14.10
