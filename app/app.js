const express = require('express');
const app = express();
const port = 8080;
// const url = require('url');

//ejsの設定
const ejs = require('ejs');
app.engine('ejs', ejs.renderFile);

// body-parserの設定
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })

// url
app.get('/', function (req, res) {
    var name = "whisper"; 
    res.render('auth/login.ejs', {
        title: "EJS Sample Code",
        content: `${name} wellcome to the world of EJS...`
    });
});

app.post('/login', function (req, res) {
    var name = req.body['email'];
    
    res.render('auth/portal.ejs', {
        title: `${name}`,
        content: `wellcome to the world of EJS...`
    });
});

// app.get('/test1', function (req, res) {
//     var url_parse = url.parse(req.url, true);
//     res.send(JSON.stringify(url_parse) + 'TEST1\n');
// });

// app.post('/test2', function (req, res) {
//     res.send('TEST2\n');
// });

app.get('/newUser', (req, res) => {
    let username = req.query.username || '';
    const password = req.query.password || '';

    username = username.replace(/[!@#$%^&*]/g, '');

    if (!username || !password || users.username) {
        return res.sendStatus(400);
    }

    const salt = crypto.randomBytes(128).toString('base64');
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512');

    users[username] = { salt, hash };

    res.sendStatus(200);
});

app.get('/auth', (req, res) => {
    let username = req.query.username || '';
    const password = req.query.password || '';
  
    username = username.replace(/[!@#$%^&*]/g, '');
  
    if (!username || !password || !users[username]) {
      return res.sendStatus(400);
    }
  
    const { salt, hash } = users[username];
    const encryptHash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512');
  
    if (crypto.timingSafeEqual(hash, encryptHash)) {
      res.sendStatus(200);
    } else {
      res.sendStatus(401);
    }
});