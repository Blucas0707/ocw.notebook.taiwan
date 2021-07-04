const express = require("express");
const path = require("path");
var session = require('express-session')
// const bodyParser = require("body-parser");

const api_user = require("./Controllers/API_USER");
const api_courses = require("./Models/courses/API_COURSES");


const app=express();
app.use(express.static(path.join(__dirname,"static")));
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(session({
  secret: 'ocw notebook',
  resave: false,
  saveUninitialized: true,
  // cookie: { secure: false }
}));

// const router = express.Router();
// let engine = require('ejs');

// app.engine('ejs', engine);
app.set('views', './views');
app.set('view engine', 'ejs');

// Route "/" to index.html
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname,'/templates/'+'index.html'));
});
// Route "/mylearning" to index.html
app.get('/mylearning', function (req, res) {
  res.sendFile(path.join(__dirname,'/templates/'+'mylearning.html'));
});
// Route "/mylearning" to index.html
app.get('/course', function (req, res) {
  res.sendFile(path.join(__dirname,'/templates/'+'course.html'));
});

//API

//課程API
app.get("/api/courses", function(req, res){
  let page = (req.query.page != null) ? (req.query.page):("0");
  let category = (req.query.category != "") ? (req.query.category):("%");
  let university = (req.query.university != "") ? (req.query.university):("%");
  api_courses.getAllCourse(page,category,university).then((result)=>{
    // console.log(result);
    res.send(200,result);
  });


});


// 使用者API
//取得使用者資訊
app.get("/api/user", function(req, res){
  //取得Session
  let email = req.session.email;
  let password = req.session.password;
  let data = {
    "email":email,
    "password":password
  };
  console.log("email" + email,"password" +password);
  if(email && password){ //session 存在
    api_user.checkLogin(data).then((result)=>{
      console.log(result);
      res.json(result);
    });
  }
  else{
    res.json(null);
  }

});
//使用者登入
app.delete("/api/user", function(req, res){
  //移除Session
  req.session.email = null;
  req.session.password = null;

  let data = {
        "ok": true
    };
  console.log("logout  email" + req.session.email,"password" +req.session.password);
  res.json(data);

});
//使用者註冊
app.post("/api/user", function(req, res){
  console.log(req.body);
  api_user.Register(req.body).then((result)=>{
    console.log(result);
    res.json(result);
  })
});
//使用者登入
app.patch("/api/user", function(req, res){
  console.log(req.body);
  api_user.Login(req.body).then((result)=>{
    let login_result = JSON.parse(result);
    if(login_result.ok){
      //登入成功後，存到Session
      req.session.email = req.body.email.toString();
      req.session.password = req.body.password.toString();
      console.log(req.session.email, req.session.password);
    }
    res.json(result);
  })
});


//TEST only
// Route NTU
app.get('/NTU', function (req, res) {
  res.sendFile(path.join(__dirname,'/Crawler/'+'NTU.json'));
});
// Route NTHU
app.get('/NTHU', function (req, res) {
  res.sendFile(path.join(__dirname,'/Crawler/'+'NTHU.json'));
});
// Route NYTU
app.get('/NYTU', function (req, res) {
  res.sendFile(path.join(__dirname,'/Crawler/'+'NYTU.json'));
});
// Route log
app.get('/log', function (req, res) {
  res.sendFile(path.join(__dirname,'/Crawler/'+'log.txt'));
});
// Route nohup log
app.get('/nohup.out', function (req, res) {
  res.sendFile(path.join(__dirname,'/Crawler/'+'nohup.out'));
});

// app.use('/', router);
app.listen(3000, function(){
    console.log("server");
});
