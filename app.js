const express = require("express");
const path = require("path");
var session = require('express-session')
// const bodyParser = require("body-parser");

const api_user = require("./Models/users/API_USER");
const api_courses = require("./Models/courses/API_COURSES");
const api_lectures = require("./Models/lectures/API_LECTURES");
const api_notes = require("./Models/notes/API_NOTES");
const api_learnings = require("./Models/learnings/API_LEARNINGS");
const api_mylearnings = require("./Models/mylearnings/API_mylearnings");

const app=express();
app.use(express.static(path.join(__dirname,"static")));
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(session({
  secret: 'ocw notebook',
  resave: false,
  saveUninitialized: true,
  // cookie: { secure: false }
  cookie: { secure: !true }
}));

app.set('views', './views');
app.set('view engine', 'ejs');

// 首頁
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname,'/templates/'+'index.html'));
});

// 課程頁
app.get("/course/:course_id", function(req, res){
  res.sendFile(path.join(__dirname,'/templates/'+'course.html'));
});

// 學習紀錄
app.get('/mylearning', function (req, res) {
  res.sendFile(path.join(__dirname,'/templates/'+'mylearning.html'));
});

//API
//課程Course API
app.get("/api/courses", function(req, res){
  let page = (req.query.page) ? (req.query.page):("0");
  let category = (req.query.category) ? (req.query.category):("%");
  let university = (req.query.university) ? (req.query.university):("%");
  // console.log(page,category,university);
  api_courses.getAllCourse(page,category,university).then((result)=>{
    // console.log(result);
    res.send(200,result);
  });
});

// 課堂Lecture API
app.get("/api/course/:course_id", function(req, res){
  let course_id = req.params.course_id;
  // console.log(course_id);
  api_lectures.getAllLectures(course_id).then((result)=>{
    // console.log(result);
    res.json(result);
  });
});

// 筆記Note API
// course_id/lecture_id/user_id
app.get("/api/note/:course_id/:lecture_id", function(req, res){
  let course_id = req.params.course_id;
  let lecture_id = req.params.lecture_id;
  let user_id = req.session.user_id;
  // console.log("note:" + course_id,lecture_id,user_id);
  if(!course_id || !lecture_id || !user_id){
    let data = {
      "error":true,
      "message":"參數錯誤"
    };
    res.send(200,data);
  }
  else{
    api_notes.getNotes(course_id,lecture_id,user_id).then((result)=>{
      // console.log(result);
      res.send(200,result);
    });
  }
});
//上傳筆記
app.post("/api/note", function(req, res){
  // let user_id = req.session.user_id;
  // console.log(req.body);
  api_notes.postNotes(req.body).then((result)=>{
    // console.log(result);
    res.send(200,result);
  });

});

//學習進度Learning API
//更新學習進度
app.patch("/api/learning", function(req, res){
  // console.log(req.body);
  api_learnings.updateLecture_status(req.body).then((result)=>{
    let update_status = JSON.parse(result);
    // console.log(update_status);
    // console.log(result);
    res.json(result);
  })
});
//取得單一課程影片進度
app.get("/api/learning/:course_id/:lecture_id", function(req, res){
  // console.log("getOneLecture_status start");
  let course_id = req.params.course_id;
  let lecture_id = req.params.lecture_id;
  let user_id = req.session.user_id;
  // console.log("lecture_video:" + course_id,lecture_id,user_id,req.session.email);
  if(user_id){
    api_learnings.getOneLecture_status(user_id,course_id,lecture_id).then((result)=>{
      let update_status = JSON.parse(result);
      // console.log(update_status);
      // console.log(result);
      res.json(result);
    })
  }
});

//取得使用者學習進度
app.get("/api/learnings/:course_id", function(req, res){
  // console.log("getAllLecture_status start");
  let course_id = req.params.course_id;
  let user_id = req.session.user_id;
  // console.log("app getAllLecture_status:" + course_id,user_id);
  if(user_id){
    api_learnings.getAllLecture_status(user_id,course_id).then((result)=>{
      let update_status = JSON.parse(result);
      // console.log(update_status);
      // console.log(result);
      res.send(200,result);
    })
  }
  else{

  }
});

//取得全部課程影片進度
app.get("/api/mylearnings", function(req, res){
  let user_id = req.session.user_id;
  let page = (req.query.page) ? (req.query.page):("0");
  let learning_status = (req.query.status) ? (req.query.status):("0");
  let learning_category = (req.query.category) ? (req.query.category):("%");
  console.log("mylearnings:" + user_id,page,learning_status,learning_category);
  api_mylearnings.getMyLearnings(user_id,page,learning_status,learning_category).then((result)=>{
    console.log("app: " + result);
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
  // console.log("email：" + email,"password：" +password);
  if(email && password){ //session 存在
    api_user.checkLogin(data).then((result)=>{
      // console.log("user get result: "+result);
      // console.log(JSON.parse(result).data.id);
      req.session.user_id = JSON.parse(result).data.id;
      // console.log(req.session.user_id);
      // console.log(req.session.user_id, req.session.email);
      res.json(result);

    });
  }
  else{
    res.json(null);
  }

});
//使用者登出
app.delete("/api/user", function(req, res){
  //移除Session
  req.session.email = null;
  req.session.password = null;
  req.session.user_id = null;
  let data = {
        "ok": true
    };
  // console.log("logout  email" + req.session.email,"password" +req.session.password);
  res.json(data);

});
//使用者註冊
app.post("/api/user", function(req, res){
  // console.log(req.body);
  api_user.Register(req.body).then((result)=>{
    // console.log(result);
    res.json(result);
  })
});
//使用者登入
app.patch("/api/user", function(req, res){
  // console.log(req.body);
  api_user.Login(req.body).then((result)=>{
    let login_result = JSON.parse(result);
    if(login_result.ok){
      //登入成功後，存到Session
      req.session.email = req.body.email.toString();
      req.session.password = req.body.password.toString();
      // console.log(req.session.email, req.session.password);
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
