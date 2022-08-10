const Pool = require("pg").Pool;

const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

module.exports = new Pool({
	user: DB_USER,
	password: `${DB_PASSWORD}`,
	host: DB_HOST,
	port: parseInt(`${DB_PORT}`),
	database: DB_NAME
});