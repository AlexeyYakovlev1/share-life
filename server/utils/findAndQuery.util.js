const db = require("../db");

/*
findTable must be like this:
db.query(queryForFindTable, [params]);

queryParams must be like this:
{
	text: "SELECT id FROM person WHERE user_name = $1",
	els: [userName]
}
*/

function findAndQuery(
	findTable, propertyCondition,
	queryParams, callback = null
) {
	let res = null;

	if (findTable.rows && findTable.rows[0][propertyCondition]) {
		if (callback !== null) callback(findTable.rows);
		res = db.query(queryParams.text, [...queryParams.els]);
	}

	return res;
}

module.exports = findAndQuery;