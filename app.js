const express = require('express');
const app = express();
const port = 8080;
// const url = require('url');

// db 設定
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./db/test.db");

//ejsの設定
const ejs = require('ejs');
app.engine('ejs', ejs.renderFile);
app.use(express.static('public'));

// body-parserの設定
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// router定義
//portal
// htttp://localhost:8080/
app.get('/', function (req, res) {
  let error = '';
  if (req.query.error == 1) {
    error = 'ユーザーまたパスワードが不正です。'
  };
  res.render('auth/login.ejs', {
    error: error,
  });
});

// login 
// htttp://localhost:8080/login
app.post('/login', function (req, res) {
  let email = req.body['email'];
  let password = req.body['password'];
  db.get("select * from members where email = $email and password = $password ", { $email: email, $password: password }, (err, row) => {
    if (err) {
      throw err;
    }
    if (row) {
      console.log(`${row.name} ${row.age}`);
      res.render('portal.ejs', {
        title: `wellcome to the world of EJS...`,
        content: JSON.stringify(row)
      });
    } else {
      res.redirect(req.baseUrl + '/?error=1');
    }
  })
  // db.close();
});

// user list
// htttp://localhost:8080/users
app.get('/users', function (req, res) {
  db.all("select * from members", (err, rows) => {
    if (err) {
      res.status(400).json({
        "status": "error",
        "message": err.message
      });
      return;
    }
    res.render('portal.ejs', {
      title: `wellcome to the world of EJS...`,
      content: JSON.stringify(rows)
    });
  });
});

// DB初期化
// htttp://localhost:8080/init_db
app.get('/init_db', function (req, res) {
  db.serialize(() => {
    db.run("drop table if exists members");
    db.run("create table if not exists members(email, password, name,age)", (err) => {
      if (err) {
        console.error("table error: " + err.message);
      } else {
        //初期データinsert
        db.run("insert into members(email, password, name,age) values(?,?,?,?)", 'test@example.com', '111111', "hoge", 33);
        db.run("insert into members(email, password, name,age) values(?,?,?,?)", 'demo@example.com', '111111', "foo", 44);
      }
    });

    // db.run("update members set age = ? where name = ?", 55, "foo");
    // db.each("select * from members", (err, row) => {
    //   console.log(`${row.name} ${row.age}`);
    // });
    // db.all("select * from members", (err, rows) => {
    //   console.log(JSON.stringify(rows));
    // });
    // db.get("select count(*) from members", (err, count) => {
    //   console.log(count["count(*)"]);
    // })
  });

  db.close();

  res.sendStatus(200);
});
