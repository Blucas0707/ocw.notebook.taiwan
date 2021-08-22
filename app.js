const express = require("express");
const path = require("path");
const session = require('express-session')
const AWS = require('aws-sdk');
const region = 'us-east-2'; // e.g. us-west-1
const domain = process.env.DOMAIN; // e.g. search-domain.region.es.amazonaws.com
const index = "courses";
// const bodyParser = require("body-parser");
const userController = require("./Controllers/userController");
const courseController = require("./Controllers/courseController");
const lectureController = require("./Controllers/lectureController");
const noteController = require("./Controllers/noteController");
const learningController = require("./Controllers/learningController");
const mylearningController = require("./Controllers/mylearningController");
const keywordsearchController = require("./Controllers/keywordsearchController");
const myprofileController = require("./Controllers/myprofileController");
const googleloginController = require("./Controllers/googleloginController");

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

// 搜尋頁
app.get("/search", function(req, res){
  res.sendFile(path.join(__dirname,'/templates/'+'search.html'));
});

// 課程頁
app.get("/course/:course_id", function(req, res){
  res.sendFile(path.join(__dirname,'/templates/'+'course.html'));
});

// 學習紀錄
app.get('/mylearning', function (req, res) {
  res.sendFile(path.join(__dirname,'/templates/'+'mylearning.html'));
});

// 個人資料頁
app.get("/myprofile", function(req, res){
  res.sendFile(path.join(__dirname,'/templates/'+'myprofile.html'));
});

//API
//關鍵字搜索
app.get("/api/search", keywordsearchController.keywordsearch);

//課程Course API
app.get("/api/courses",courseController.course);

// 課堂Lecture API
app.get("/api/course/:course_id", lectureController.lecture);

// 筆記Note API
// course_id/lecture_id/user_id
app.get("/api/note/:course_id/:lecture_id", noteController.getNotes);
//上傳筆記
app.post("/api/note", noteController.postNotes);
// 刪除筆記
app.delete("/api/note/:note_id", noteController.deleteNote);

//學習進度Learning API
//更新課堂學習進度
app.patch("/api/learning", learningController.updateLecture_status);
//取得單一課程影片進度
app.get("/api/learning/:course_id/:lecture_id", learningController.getOneLecture_status);

//取得使用者學習進度
app.get("/api/learnings/:course_id", learningController.getAllLecture_status);

//取得全部課程影片進度
app.get("/api/mylearnings", mylearningController.getMyLearnings);

// 使用者資料 API
//更新使用者名稱
app.patch("/api/myprofile/username", myprofileController.modifyUsername);

//更新使用者密碼
app.patch("/api/myprofile/userpassword", myprofileController.modifyUserpassword);

//更新使用者訂閱
app.patch("/api/myprofile/subscription", myprofileController.modifySubscription);

// 使用者API
//取得使用者資訊
app.get("/api/user", userController.checkLogin);
//使用者登出
app.delete("/api/user", userController.logout);
//使用者註冊
app.post("/api/user", userController.Register);
//使用者登入
app.patch("/api/user", userController.Login);
//使用者登入 Google
app.post("/api/google/login/:id_token", googleloginController.login);

//for SEO optimization
app.get("/robots.txt", function (req,res) {
  res.sendFile(path.join(__dirname,'/'+'robots.txt'));
})
app.get("/sitemap.xml", function (req,res) {
  res.sendFile(path.join(__dirname,'/Crawler/'+'sitemap.xml'));
})

// app.use('/', router);
app.listen(3000, function(){
    console.log("server start");
});
