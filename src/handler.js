const fs = require('fs');
const path = require('path');
const getData = require('./queries/getData');
const postData = require('./queries/postData');
const querystring = require('querystring');

const handler = {};

handler.sendResponse = (response, code, header, body) => {
  response.writeHead(code, header);
  response.end(body);
};

handler.index = (request, response) => {
  const fullPath = path.join(__dirname, '..', 'public', 'index.html');
  fs.readFile(fullPath, 'utf8', (error, file) => {
    /* istanbul ignore if */
    if (error) {
      handler.serverError(error, response);
    } else {
      handler.sendResponse(response, 200, { 'Content-Type': 'text/html' }, file);
    }
  });
};

handler.htmlPage = (request, response, page) => {
  const fullPath = path.join(__dirname, '..', 'public', `${page}.html`);
  fs.readFile(fullPath, 'utf8', (error, file) => {
    /* istanbul ignore if */
    if (error) {
      handler.serverError(error, response);
    } else {
      handler.sendResponse(response, 200, { 'Content-Type': 'text/html' }, file);
    }
  });
};

handler.cssPage = (request, response, page) => {
  const fullPath = path.join(__dirname, '..', 'public', page);
  fs.readFile(fullPath, 'utf8', (error, file) => {
    /* istanbul ignore if */
    if (error) {
      handler.serverError(error, response);
    } else {
      handler.sendResponse(response, 200, { 'Content-Type': 'text/css' }, file);
    }
  });
};

handler.scriptPage = (request, response, page) => {
  const fullPath = path.join(__dirname, '..', 'public', page);
  fs.readFile(fullPath, 'utf8', (error, file) => {
    /* istanbul ignore if */
    if (error) {
      handler.serverError(error, response);
    } else {
      handler.sendResponse(response, 200, { 'Content-Type': 'text/javascript' }, file);
    }
  });
};

handler.imgPage = (request, response, page) => {
  const fullPath = path.join(__dirname, '..', 'public', page);
  fs.readFile(fullPath, 'utf8', (error, file) => {
    /* istanbul ignore if */
    if (error) {
      handler.serverError(error, response);
    } else {
      handler.sendResponse(response, 200, { 'Content-Type': 'image/svg+xml' }, file);
    }
  });
};

handler.serverError = (error, response) => {
  handler.sendResponse(
    response, 500, { 'Content-Type': 'text/html' },
    '<h1>Sorry, there was a problem loading the homepage</h1>',
  );
  /* istanbul ignore next */
  // eslint-disable-next-line no-console
  console.log(error);
};

handler.notFound = (error, response) => {
  handler.sendResponse(
    response, 404, { 'Content-Type': 'text/html' },
    '<h1>404 - Sorry, the requested information was not found</h1>',
  );
};

handler.search = (request, response, title, author) => {
  if (author === '' && title === '') {
    const blankResponse = [{ inputError: 'Unable to run blank query' }];
    handler.sendResponse(response, 200, { 'Content-Type': 'application/json' }, JSON.stringify(blankResponse));
  } else if (title === '') {
    getData.searchAuthor('suggestions', 'name', author, (error, sqlResponse) => {
      if (error) {
        handler.serverError(error, response);
      } else {
        handler.sendResponse(response, 200, { 'Content-Type': 'application/json' }, JSON.stringify(sqlResponse));
      }
    });
  } else if (author === '') {
    getData.searchSubject('suggestions', 'name', title, (error, sqlResponse) => {
      if (error) {
        handler.serverError(error, response);
      } else {
        handler.sendResponse(response, 200, { 'Content-Type': 'application/json' }, JSON.stringify(sqlResponse));
      }
    });
  } else {
    getData.searchAuthSubj('suggestions', 'name', author, title, (error, sqlResponse) => {
      if (error) {
        handler.serverError(error, response);
      } else {
        handler.sendResponse(response, 200, { 'Content-Type': 'application/json' }, JSON.stringify(sqlResponse));
      }
    });
  }
};

handler.topicDetails = (request, response, suggestionId) => {
  getData.topicDetails(suggestionId, (error, sqlResponse) => {
    if (error) {
      handler.serverError(error, response);
    } else {
      handler.sendResponse(response, 200, { 'Content-Type': 'application/json' }, JSON.stringify(sqlResponse[0]));
    }
  });
};

handler.getComments = (request, response, suggestionId) => {
  getData.getComments(suggestionId, (error, sqlResponse) => {
    if (error) {
      handler.serverError(error, response);
    } else {
      handler.sendResponse(response, 200, { 'Content-Type': 'application/json' }, JSON.stringify(sqlResponse));
    }
  });
};

handler.postComment = (request, response, suggestionId) => {
  request.on('error', (error) => {
    handler.serverError(error, response);
  });
  let stream = '';
  request.on('data', (chunk) => {
    stream += chunk;
  });
  request.on('end', () => {
    const comment = JSON.parse(stream);
    postData.postComment(suggestionId, comment, () => {});
  });
};

handler.postNew = (request, response) => {
  request.on('error', (error) => {
    handler.serverError(error, response);
  });
  let stream = '';
  request.on('data', (chunk) => {
    stream += chunk;
  });
  request.on('end', () => {
    const review = querystring.parse(stream);
    console.log(review);
    postData.addReview(review, () => {
      handler.sendResponse(response, 200, { 'Content-Type': 'text/plain' }, 'Thanks for submitting! (Success page under construction)');

      // TODO: Introduce success page on form load.
    });
  });
};


module.exports = handler;
