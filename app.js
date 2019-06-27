const express = require('express');
const app = express();
const port = 3000;

const path = require('path');
const url = require('url');
const bodyParser = require('body-parser');

const Api = require('./git').api;

require('./db/db');
const UserSchema = require('./models/user');
// client id 4159078fc6e642273457
// client secret 3fdc37bd69e7280e0fcbb53eea72b656592d4ea4

const cookieParser = require('cookie-parser');

app.use(cookieParser('Secret String'));
app.use(express.static(`${path.join(__dirname)}/public`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));


app.get('/',(req,res) => {

    UserSchema.findOne({login: req.cookies.login, password: req.cookies.password}, (err,user) => {

        if(user === null) {
            res.redirect('/register.html');
        }else {
            res.sendFile(path.join(__dirname) + '/public/git.html');
        }
    });

});

app.get('/register.html',(req,res) => {
   res.sendFile(__dirname + 'public/register.html');
});

app.post('/register', (req,res) => {
const  { login, password } = req.body;

    const newUser = new UserSchema({
       login: login,
       password: password
    });

    newUser.save((err) => {
        if(err) throw err;
        console.log(`new user saved successfully`);
        res.redirect('/register.html');
    });

});

app.get('/login', (req,res) => {
    const data = url.parse(req.url,true).query;
   UserSchema.findOne({login: data.login, password: data.password}, (err,user) => {
       if(err) {
           throw err;
       }

       if(user === null) {
           res.redirect('/register.html');
       }else {
           res.cookie('login',`${data.login}`,{path: '/'});
           res.cookie('password',`${data.password}`,{path: '/'});
           res.redirect('/');
       }
   });
});

app.get('/commit', (req,res) => {
    const {login, password} = req.cookies;
    UserSchema.findOne({login: login, password: password},(err,user) => {
        if(err) throw err;

        res.send(user.commitHistory);
    });

});

app.post('/commit', (req,res) => {
    const { commit, author, avatarUrl} = req.body;
    const {login, password} = req.cookies;
    UserSchema.findOne({login: login, password: password},(err,user) => {
        if(err) throw err;
        user.commitHistory.push({
            commit: commit,
            author: author,
            avatarUrl: avatarUrl
        });
        user.save((err) => {
           if(err) throw err;
            console.log(`commit was added`);
            res.sendStatus(200);
        });
    });

});

app.post('/add-repo',(req,res) => {
    const {login, password} = req.cookies;
    const { repo } = req.body;
    let isRepo = false;
   UserSchema.findOne({login: login, password: password}, (err,user) => {
      if(user === null) {
          res.redirect('/register');
      } else {
          user.reposList.map((e) => {
              console.log(repo);
              isRepo = e === repo;
          });
          if(isRepo === false) {
              user.reposList.push(repo);
              user.save((err) => {
                  if(err) throw err;
                  console.log(`repo saved`);
              });
              res.end();
          }

      }
   });
});

app.get('/repo-list', (req,res) => {
    const {login, password} = req.cookies;
    console.log();
    UserSchema.findOne({login: login, password: password}, (err,user) => {
      if(user === null) {
          res.redirect('/register');
      } else {
          res.send(user.reposList);
      }
   });
});


app.post('/delete-repo',(req,res) => {
    const {login, password} = req.cookies;
    const {repo} = req.body;
    console.log(repo);
    UserSchema.findOne({login: login, password: password}, (err,user) => {
       if(user === null) {
           res.sendStatus(400);
       }else {
          const index = user.reposList.indexOf(repo);
          if(index > -1) {
              user.reposList.splice(index,1);
              user.save((err) => {
                  if(err) throw err;
                  console.log(`repo was deleted`);
                  res.sendStatus(200);
              })
          }
       }
   });
});



app.listen(port,() => console.log(`App listening on port: ${port}`));