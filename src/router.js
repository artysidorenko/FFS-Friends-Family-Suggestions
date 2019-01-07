const querystring = require('querystring');
const handler = require('./handler');

const router = (request, response) => {
  const { method, url } = request;
  if (method === 'GET' && url === '/') {
    handler.index(request, response);
  } else if (method === 'GET' && url === '/search') {
    handler.htmlPage(request, response, url.slice(1));
  } else if (method === 'GET' && url === '/post') {
    handler.htmlPage(request, response, url.slice(1));
  } else if (method === 'GET' && url.slice(0, 6) === '/topic' && url.slice(-3) !== '.js') {
    handler.htmlPage(request, response, url.slice(0, 6));
  } else if (method === 'GET' && url.includes('/details/')) {
    handler.topicDetails(request, response, url.replace('/details/', ''));
  } else if (method === 'GET' && url.includes('/comments/')) {
    handler.getComments(request, response, url.replace('/comments/', ''));
  } else if (method === 'GET' && url.slice(-4) === '.css') {
    handler.cssPage(request, response, url);
  } else if (method === 'GET' && url.slice(-3) === '.js') {
    handler.scriptPage(request, response, url);
  } else if (method === 'GET' && url.includes('menu_icon.svg')) {
    handler.imgPage(request, response, url);
  } else if (method === 'GET' && url.includes('searchResults')) {
    const { title, author } = querystring.parse(url.slice(15));
    handler.search(request, response, title, author);
  } else if (method === 'POST' && url.includes('/postcomment/')) {
    handler.postComment(request, response, url.replace('/postcomment/', ''));
  } else if (method === 'POST' && url === '/submitNewItem') {
    const queryObject = querystring.parse(url);
    handler.postNew(request, response, queryObject);
  } else {
    handler.notFound(request, response);
  }
};

module.exports = router;
