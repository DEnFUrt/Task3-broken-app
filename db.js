const { USERNAME, PASSWORD, HOST, DATABASE, PORT } = require('./common/config');
const Sequelize = require('sequelize');
const Op = Sequelize.Op; 

                                //database username   password
const sequelize = new Sequelize(DATABASE, USERNAME, PASSWORD, {
    host: HOST,
    dialect: 'postgres',
    operatorsAliases: Op, 
    logging: false
})

sequelize.authenticate()
    .then(() => console.log('Connected to DB')
    )
    .catch(err => console.log(`Error: ${err}`)
    );
        
module.exports = sequelize;
