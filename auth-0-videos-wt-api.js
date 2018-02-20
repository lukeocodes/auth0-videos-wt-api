'use latest';
import bodyParser from 'body-parser';
import express from 'express';
import Webtask from 'webtask-tools';
import MLab from 'mlab-data-api';

const app = new express();
const database = 'auth0-videos';
const collection = 'viewers';

app.use(bodyParser.json());

app.get('/:uid/watch/:video', (req, res) => {
  const uid = req.params.uid,
    video = req.params.video;

  data = MLab({
    key: req.webtaskContext.secrets.MLAB_KEY
  });

  data.listDocuments({
    database: database,
    collection: collection,
    query: {
      'viewer': uid
    }
  })
  .then(function (response) {
    console.log('got',response.data)
  })
  .catch(function (error) {
    res.writeHead(400, { 'Content-Type': 'application/json'});
    res.end(JSON.stringify({
      statusCode : 400,
      message: "ERROR",
    }));
  });
  
  res.writeHead(200, { 'Content-Type': 'application/json'});
  res.end(JSON.stringify('hello'));
});

app.get('/:uid', (req, res) => {
  const uid = req.params.uid;
  
  data = MLab({
    key: req.webtaskContext.secrets.MLAB_KEY
  });
  
  data.listDocuments({
    database: database,
    collection: collection,
    query: {
      'viewer': uid
    }
  })
  .then(function (response) {
    res.writeHead(200, { 'Content-Type': 'application/json'});
    res.end(JSON.stringify(response.data));
  })
  .catch(function (error) {
    res.writeHead(400, { 'Content-Type': 'application/json'});
    res.end(JSON.stringify({
      statusCode : 400,
      message: "ERROR",
    }));
  });
});

module.exports = Webtask.fromExpress(app);