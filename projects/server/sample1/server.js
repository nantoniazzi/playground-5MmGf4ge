var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(express.static('.'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var firstUserDesc = null;
var secondUserDesc = null;

var beat = function() {
    console.log(new Date().getTime() + ' <3');
    setTimeout(beat, 800);
};
//beat();

app.post('/register', function(req, res) {
    console.log('register');
    let ret = {};
    if(firstUserDesc === null) {
        console.log('first user');
        ret = {'role': 'makeOffer'};
    } else if(secondUserDesc === null) {
        console.log('second user');
        ret = {'role': 'pollOffer'};
    } else {
        res = {'error': 'No more than 2 users allowed'};
    }
    res.json(ret);
});

app.post('/offer', function(req, res) {
    console.log('offer');
    firstUserDesc = req.body.desc;
    res.sendStatus(200);
    console.log('offer sent');
});

app.post('/answer', function(req, res) {
    console.log('answer');
    secondUserDesc = req.body.desc;
    res.sendStatus(200);
});

app.get('/offer', function(req, res) {
    console.log('getOffer');
    res.send({'desc': firstUserDesc});
});

app.get('/answer', function(req, res) {
    console.log(secondUserDesc ? '  getAnswer -> YES' : '  getAnswer -> NO');
    res.send({'desc': secondUserDesc});
});

var candidates = [];

app.post('/candidate', function(req, res) {
    console.log('candidate');
//    console.log('  ' + req.body.candidate);
    candidates.push(req.body.candidate);
    res.sendStatus(200);
});


app.get('/candidates', function(req, res) {
    res.send(candidates);
});

app.use(function(err, req, res, next) {
  console.log(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(3000);

