const sql = require('mariadb');

const sqlConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    server: process.env.DB_SERVER,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_DBNAME,
    options: {encrypt: false}
};
// console.log(sqlConfig);
const poolPromise = new sql.createPool(sqlConfig)
    .getConnection()
    .then(pool => {
        console.log('Connected to mariadb');
        return pool;
    })
    .catch(err => console.log('Database Connection Failed! Bad Config: ', err))

module.exports = poolPromise;