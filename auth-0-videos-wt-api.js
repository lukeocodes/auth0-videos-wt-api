const bodyParser = require('body-parser');
const express = require('express');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const mongoose = require('mongoose');
const wt = require('webtask-tools');

console.log(wt);

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  [AUTH0_DOMAIN, AUTH0_API_AUDIENCE] = req.webtaskContext.secrets;
  const issuer = `https://${AUTH0_DOMAIN}/`;
  jwt({
    secret: jwksRsa.expressJwtSecret({ jwksUri: `${issuer}.well-known/jwks.json` }),
    audience: AUTH0_API_AUDIENCE,
    issuer: issuer,
    algorithms: [ 'RS256' ]
  })(req, res, next);
});

app.use((req, res, next) => {
  const options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };

  [DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_PORT] = req.webtaskContext.secrets;
  const mongodbUri = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

  mongoose.connect(mongodbUri, options);

  var VideoSchema = new Schema({
    name: String,
    id: String
  });

  var WatchSchema = new Schema({
    user: String,
    video: VideoSchema
  });

  mongoose.model('Video', VideoSchema);
  mongoose.model('Watch', WatchSchema);
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