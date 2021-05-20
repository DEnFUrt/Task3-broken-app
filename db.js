const Sequelize = require('sequelize');
const dotenv = require('dotenv'); 
const path = require('path');
const Op = Sequelize.Op; //рефактор 

dotenv.config({
    path: path.join(__dirname, '/.env')
});

const username = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;
const database = process.env.DB;

                                //database username   password
const sequelize = new Sequelize(database, username, password, {
    host: host,
    dialect: 'postgres',
    operatorsAliases: Op, //рефактор
    logging: false
})

sequelize.authenticate().then(
    function success() {
        console.log("Connected to DB");
    },

    function fail(err) {
        console.log(`Error: ${err}`);
    }
)

module.exports = sequelize;
