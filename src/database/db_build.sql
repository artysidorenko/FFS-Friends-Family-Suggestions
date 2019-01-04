BEGIN;

DROP TABLE IF EXISTS users, suggestions, comments CASCADE;

CREATE TABLE users (
  id            serial        PRIMARY KEY,
  first_name    varchar(50)   NOT NULL,
  surname       varchar(50)   NOT NULL
);

CREATE TABLE suggestions (
  id            serial        PRIMARY KEY,
  author_id     integer       REFERENCES users(id) ON UPDATE CASCADE,
  name          varchar(50)   NOT NULL,
  rating        integer       NOT NULL,
  text_content  text
);

CREATE TABLE comments (
  id            serial        PRIMARY KEY,
  author_id     integer       REFERENCES users(id) ON UPDATE CASCADE,
  suggestion_id integer       REFERENCES suggestions(id) ON UPDATE CASCADE,
  text_content  text
);

INSERT INTO users(first_name, surname) VALUES
  ('Arty', 'Sidorenko'),
  ('Ksenia', 'Sidorenko'),
  ('Julia', 'Marsh')
RETURNING ID;

INSERT INTO suggestions(author_id, name, rating, text_content)  VALUES
  (1, 'Nandos', 9, 'Very spicy chicken! Love it!'),
  (1, 'Primark', 3, 'Gets boring very fast, and there is nowhere to sit when you get tired...'),
  (3, 'Coco Momo', 10, 'We go there every Sunday after our walk!')
RETURNING ID;

INSERT INTO comments(author_id, suggestion_id, text_content)    VALUES
  (3, 1, 'Sounds nice but maybe too spicy for me'),
  (1, 3, 'Hmm that must get rather repetitive')
RETURNING ID;

COMMIT;
