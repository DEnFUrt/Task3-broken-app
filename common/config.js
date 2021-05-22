const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
  path: path.join(__dirname, '../.env')
});

module.exports = {
  PORT: process.env.PORT,
  USERNAME: process.env.DB_USER,
  PASSWORD:  process.env.DB_PASSWORD,
  HOST:  process.env.DB_HOST,
  DATABASE: process.env.DB,
};