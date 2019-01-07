const dbConnection = require('../database/db_connection.js');

const postData = {};

postData.postComment = (suggestionId, comment, callback) => {
  const sql = 'INSERT INTO comments (suggestion_id, author_id, text_content) VALUES ($1, $2, $3)';
  const inserts = [suggestionId, comment[0], comment[1]];
  dbConnection.query(sql, inserts, (error) => {
    if (error) callback(error);
    callback(null);
  });
};

postData.addReview = (review, callback) => {
  const sql = 'INSERT INTO suggestions (author_id, name, rating, text_content) VALUES ($1, $2, $3, $4)';
  const inserts = [1, review.subject, review.rating, review.review];
  dbConnection.query(sql, inserts, (error) => {
    if (error) callback(error);
    callback(null);
  });
};

// TODO: introduce get method to obtain user id from first name

module.exports = postData;
