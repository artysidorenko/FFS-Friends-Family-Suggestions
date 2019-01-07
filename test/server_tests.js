const test = require('tape');
const supertest = require('supertest');
const router = require('../src/router');
const handler = require('../src/handler');

const pageRoutes = [
  {
    name: 'Home',
    url: '/',
    testString: '<title>FFS - Homepage</title>',
  },
  {
    name: 'Search',
    url: '/search',
    testString: '<title>FFS - Search Suggestions</title>',
  },
  {
    name: 'Post',
    url: '/post',
    testString: '<title>FFS - Post Suggestion</title>',
  },
  {
    name: 'Map',
    url: '/map',
    testString: '<title>FFS - Explore Map</title>',
  },
];

const resourceRoutes = [
  {
    name: 'CSS',
    url: '/styles.css',
    mimeType: 'text/css',
    testString: '/* FFS SUGGESTIONS WEBPAGE - CUSTOM STYLESHEET */',
  },
  {
    name: 'JavaScript',
    url: '/index.js',
    mimeType: 'text/javascript',
    testString: '// FFS SUGGESTIONS WEBPAGE - CLIENT SIDE SCRIPT',
  },
];

test('Initialise Testing Framework: SERVER TESTS', (t) => {
  t.equals(1, 1, '1 equals 1 (dummy test)');
  t.end();
});

test('Test abstract response sender and server error functions', (t) => {
  const dummyResponse = {
    statusCode: 404,
    header: {},
    text: '',
    writeHead: (code, head) => {
      dummyResponse.statusCode = code;
      dummyResponse.header = head;
    },
    end: (string) => {
      dummyResponse.text = string;
    },
  };
  handler.sendResponse(dummyResponse, 200, { 'Content-Type': 'text/plain' }, 'Test');
  t.equals(dummyResponse.statusCode, 200, 'Dummy response code should be 200');
  t.equals(dummyResponse.header['Content-Type'], 'text/plain', 'Dummy Response content type should equal text/plain');
  t.equals(dummyResponse.text, 'Test', 'Dummy Response text should equal Test');
  handler.serverError('This is a test-generated server error', dummyResponse);
  t.equals(dummyResponse.statusCode, 500, 'Server error should generate code 500');
  t.equals(dummyResponse.header['Content-Type'], 'text/html', 'Server error response header should be html');
  t.equals(dummyResponse.text, '<h1>Sorry, there was a problem loading the homepage</h1>', 'Server error text should match generic error handling message');
  t.end();
});

test('Test an invalid 404 route', (t) => {
  supertest(router)
    .get('/elephant')
    .end((err, response) => {
      t.error(err, 'Error Detection Test');
      t.equal(response.statusCode, 404, 'Response Code should be 404');
      t.equal(response.type, 'text/html', 'Response Content Type should be html');
      t.equal(response.text.includes('404'), true, 'Response text should include 404 additionally');
      t.end();
    });
});

pageRoutes.forEach((route) => {
  test(`Test ${route.name} Route`, (t) => {
    supertest(router)
      .get(route.url)
      .end((err, response) => {
        t.error(err, 'Error Detection Test');
        t.equal(response.statusCode, 200, 'Response Code should be 200');
        t.equal(response.type, 'text/html', 'Response Content Type should be html');
        t.equal(response.text.includes(route.testString), true, 'Response text should include expected page title');
        t.end();
      });
  });
});

resourceRoutes.forEach((resource) => {
  test(`Test ${resource.name} Resource Route`, (t) => {
    supertest(router)
      .get(resource.url)
      .end((err, response) => {
        t.error(err, 'Error Detection Test');
        t.equal(response.statusCode, 200, 'Response Code should be 200');
        t.equal(response.type, resource.mimeType, 'Response Content Type should be html');
        t.equal(response.text.includes(resource.testString), true, 'Response text should include expected page title');
        t.end();
      });
  });
});
