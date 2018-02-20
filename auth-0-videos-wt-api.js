const app = new (require('express'))(),
  bodyParser = require('body-parser'),
  wt = require('webtask-tools'),
  mLab = require('mlab-data-api');

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

app.post('/:uid/:video', (req, res) => {
  const uid = req.params.uid,
    video = req.params.video;
    
  data = mLab({
    key: req.webtaskContext.secrets.MLAB_KEY
  });
  
  console.log(uid, video);
  
  data.listDatabases()
  .then(function (response) {
    console.log('got',response.data)
  })
  .catch(function (error) {
    console.log('error', error)
  });
  
  res.writeHead(200, { 'Content-Type': 'application/json'});
  res.end(JSON.stringify(RESPONSE.OK));

});

module.exports = wt.fromExpress(app);