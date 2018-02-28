const bodyParser = require('body-parser');
const express = require('express');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const mongoose = require('mongoose');
const wt = require('webtask-tools');


const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  const issuer = 'https://' + req.webtaskContext.secrets.AUTH0_DOMAIN + '/';
  jwt({
    secret: jwksRsa.expressJwtSecret({ jwksUri: issuer + '.well-known/jwks.json' }),
    audience: req.webtaskContext.secrets.AUDIENCE,
    issuer: issuer,
    algorithms: [ 'RS256' ]
  })(req, res, next);
});

app.get('/test', (req, res) => {
  mLab.listDatabases()
  .then(function (response) {
    console.log('got',response.data)
  })
  .catch(function (error) {
    console.log('error', error)
  })
  
  res.send(200);
});

app.get('/', (req, res) => {
  // add your logic, you can use scopes from req.user
  // req.user.sub;
  res.send(200);
});

module.exports = wt.fromExpress(app);