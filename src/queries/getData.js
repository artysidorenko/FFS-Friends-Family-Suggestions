const dbConnection = require('../database/db_connection.js');

const getData = {};

getData.searchSubject = (table, column, searchTerm, callback) => {
  const sql = 'SELECT suggestions.id, suggestions.name, users.first_name, suggestions.rating, suggestions.text_content FROM suggestions INNER JOIN users ON suggestions.author_id = users.id WHERE LOWER(name) LIKE LOWER($1)';
  const inserts = [`%${searchTerm}%`];
  dbConnection.query(sql, inserts, (error, response) => {
    if (error) callback(error);
    callback(null, response.rows);
  });
};

getData.searchAuthor = (table, column, searchTerm, callback) => {
  const sql = 'SELECT suggestions.id, suggestions.name, users.first_name, suggestions.rating, suggestions.text_content FROM suggestions INNER JOIN users ON suggestions.author_id = users.id WHERE LOWER(first_name) LIKE LOWER($1)';
  const inserts = [`%${searchTerm}%`];
  dbConnection.query(sql, inserts, (error, response) => {
    if (error) callback(error);
    callback(null, response.rows);
  });
};

getData.searchAuthSubj = (table, column, searchTermAuth, searchTermSubj, callback) => {
  const sql = 'SELECT suggestions.id, suggestions.name, users.first_name, suggestions.rating, suggestions.text_content FROM suggestions INNER JOIN users ON suggestions.author_id = users.id WHERE LOWER(first_name) LIKE LOWER($1) AND LOWER(name) LIKE LOWER($2)';
  const inserts = [`%${searchTermAuth}%`, `%${searchTermSubj}%`];
  dbConnection.query(sql, inserts, (error, response) => {
    if (error) callback(error);
    console.log(response.rows);
    callback(null, response.rows);
  });
};

getData.topicDetails = (suggestionId, callback) => {
  const sql = 'SELECT suggestions.name, users.first_name, users.surname, suggestions.rating, suggestions.text_content FROM suggestions INNER JOIN users ON suggestions.author_id = users.id WHERE suggestions.id = $1';
  const inserts = [suggestionId];
  dbConnection.query(sql, inserts, (error, response) => {
    if (error) callback(error);
    callback(null, response.rows);
  });
};

getData.getComments = (suggestionId, callback) => {
  const sql = 'SELECT users.first_name, comments.text_content FROM users INNER JOIN comments ON users.id = comments.author_id WHERE comments.suggestion_id = $1';
  const inserts = [suggestionId];
  dbConnection.query(sql, inserts, (error, response) => {
    if (error) callback(error);
    callback(null, response.rows);
  });
};

module.exports = getData;
