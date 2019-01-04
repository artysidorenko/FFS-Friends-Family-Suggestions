const fs = require('fs');
const path = require('path');
const dbConnection = require('./db_connection');

const sqlPath = path.join(__dirname, 'db_build.sql');
const sql = fs.readFileSync(sqlPath).toString();

const runDbBuild = callback => dbConnection.query(sql, callback);

runDbBuild((err, res) => {
  if (err) throw err;
  // eslint-disable-next-line no-console
  console.log('Initial tables created with result: ', res);
});

module.exports = runDbBuild;
