const show = require('../Views/show.js');
const view_course = require('../Views/course.js');
const view_user = require('../Views/User/user.js');
const model_course = require('../Models/Course/course.js');
const model_user = require('../Models/User/user.js');

let member = {
  checkLogin:async function(object){
    object = await model_user.checkLogin(object);
    view_user.isLogin(object);
    return object;
  },
  logout:function(object){
    return new Promise((resolve, reject)=>{
      let logout_btn = document.querySelector("#logout-btn");
      logout_btn.addEventListener("click", async ()=>{
        //Goole logout
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
        });
        await model_user.logout(object);
        // views.user.Logout();
        view_user.Logout(object);
        resolve(true);
      });
    })
  },
  register:function(object){
      let register_btn = document.querySelector(".register-btn");
      register_btn.addEventListener("click", async ()=>{
        //判斷規則
        let formElement = document.querySelector("#register-form");
        let name = formElement.name.value;
        let email = formElement.email.value;
        let password = formElement.password.value;

        // regular rules
        let emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
        let emailCheck = (email.search(emailRule) == 0) ? (true):(false);
        // let nameCheck = (name.length >= 4) ? (true):(false);
        let passwordCheck = (password.length > 6) ? (true):(false);
        object.registerSuccess = emailCheck&&passwordCheck;
        if(!object.registerSuccess){
          let register_status = document.querySelector(".register-status");
          register_status.style.display = "flex";
          register_status.innerHTML = "請確認信箱格式或密碼長度小於6";
          register_status.style.color = "red";
        }else{
          await model_user.register(object);
          // views.user.registerStatus();
          view_user.registerStatus(object);
        }
      });
  },
  login:function(object){
      let login_btn = document.querySelector(".login-btn");
      let google_login_btn = document.querySelector(".g-signin2");
      login_btn.addEventListener("click", async ()=>{
        object = await model_user.login(object);
        // if(object.loginSuccess){
        //   object = await member.checkLogin(object);
        // }
        // views.user.loginStatus();
        view_user.loginStatus(object);
      });
  },
  googlelogin:function(object){
    let google_login_btn = document.querySelector(".g-signin2");
    google_login_btn.addEventListener("click", ()=>{
      object.useGoogleLogin = true;
      onSignIn();
    });
  },
};

module.exports = member;
