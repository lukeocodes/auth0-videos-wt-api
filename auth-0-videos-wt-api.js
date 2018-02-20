'use latest';
import bodyParser from 'body-parser';
import express from 'express';
import Webtask from 'webtask-tools';
import MLab from 'mlab-data-api';

const app = new express(),
  mLab = new MLab;

const RESPONSE = {
  OK : {
    statusCode : 200,
    message: "OK",
  },
  ERROR : {
    statusCode : 400,
    message: "ERROR"
  }
};

app.use(bodyParser.json());

app.get('/:uid/watch/:video', (req, res) => {
  const uid = req.params.uid,
    video = req.params.video;

  data = mLab({
    key: req.webtaskContext.secrets.MLAB_KEY
  });

  data.listDocuments({
    database: 'auth0-videos',
    collection: 'viewers',
    query: {
      'viewer': uid
    }
  })
  .then(function (response) {
    console.log('got',response.data)
  })
  .catch(function (error) {
    console.log('error', error)
  });
  
  res.writeHead(200, { 'Content-Type': 'application/json'});
  res.end(JSON.stringify(RESPONSE.OK));
});

app.get('/:uid', (req, res) => {
  const uid = req.params.uid;
  
  data = mLab({
    key: req.webtaskContext.secrets.MLAB_KEY
  });
  
  data.listDocuments({
    database: 'auth0-videos',
    collection: 'viewers',
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
    res.end(JSON.stringify(RESPONSE.ERROR));
  });
});

module.exports = Webtask.fromExpress(app);