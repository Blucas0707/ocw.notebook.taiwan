let user = {
  registerStatus:function(object){
    let register_status = document.querySelector(".register-status");
    register_status.style.display = "flex";
    if(object.registerSuccess){ // register success
      register_status.innerHTML = "註冊成功，請登入";
      register_status.style.color = "blue";

      //清除註冊資訊
      let formElement = document.querySelector("#register-form");
      formElement.name.value = "";
      formElement.email.value = "";
      formElement.password.value = "";

    }else{
      // register fail
      let formElement = document.querySelector("#register-form");
      let name = formElement.name.value;
      let email = formElement.email.value;
      let password = formElement.password.value;
      //其中為空
      if(name == "" || email == "" || password == ""){
        register_status.innerHTML = "註冊失敗，請確認輸入";
        register_status.style.color = "red";
      }
      else{
        register_status.innerHTML = "註冊失敗，電子信箱已被註冊";
        register_status.style.color = "red";
      }
    }
  },
  loginStatus:function(object){
    let login_status = document.querySelector(".login-status");
    login_status.style.display = "flex";
    if(object.loginSuccess){ // register success
      login_status.innerHTML = "登入成功";
      login_status.style.color = "blue";

      //清除登入資訊
      document.querySelector(".login-email").value = "";
      document.querySelector(".login-password").value = "";
      // 重新導向本頁
      window.location.reload();
      // window.location.replace('/');

    }else{ // register fail
      login_status.innerHTML = "登入失敗，帳號或密碼錯誤";
      login_status.style.color = "red";
    }
  },
  isLogin:function(object){
    //判斷已經登入
    if(object.isLogin){
      ///已登入 顯示學習紀錄&登出 隱藏登入＆註冊
      let mylearning_btn = document.querySelector("#mylearning-btn");
      let logout_btn = document.querySelector("#logout-btn");
      mylearning_btn.style.display = "flex";
      logout_btn.style.display = "flex";
      let profile_btn = document.querySelector("#profile-btn");
      profile_btn.style.display = "flex";

      let login_btn = document.querySelector("#login-btn");
      let register_btn = document.querySelector("#register-btn");
      login_btn.style.display = "none";
      register_btn.style.display = "none";
      //顯示Note box & 隱藏note-not-login box
      if(document.querySelector(".note-list") &&document.querySelector(".note-not-login")){
        document.querySelector(".note-list").style.display = "block";
        document.querySelector(".note-not-login").style.display = "none";
      }
    }else{
      //未登入 顯示登入＆註冊 隱藏學習紀錄 & 登出
      let login_btn = document.querySelector("#login-btn");
      let register_btn = document.querySelector("#register-btn");
      login_btn.style.display = "flex";
      register_btn.style.display = "flex";

      let mylearning_btn = document.querySelector("#mylearning-btn");
      let logout_btn = document.querySelector("#logout-btn");
      mylearning_btn.style.display = "none";
      logout_btn.style.display = "none";

      let profile_btn = document.querySelector("#profile-btn");
      profile_btn.style.display = "none";

      //隱藏Note box & 顯示note-not-login box
      if(document.querySelector(".note-list") &&document.querySelector(".note-not-login")){
        document.querySelector(".note-list").style.display = "none";
        document.querySelector(".note-not-login").style.display = "flex";
      }
    }
  },
  Logout:function(object){
    //判斷已經登出
    if(object.isLogin === false){
      //顯示登入＆註冊
      let login_btn = document.querySelector("#login-btn");
      let register_btn = document.querySelector("#register-btn");
      login_btn.style.display = "flex";
      register_btn.style.display = "flex";
      //隱藏學習紀錄 & 登出
      let mylearning_btn = document.querySelector("#mylearning-btn");
      let logout_btn = document.querySelector("#logout-btn");
      mylearning_btn.style.display = "none";
      logout_btn.style.display = "none";

      let profile_btn = document.querySelector("#profile-btn");
      profile_btn.style.display = "none";
      //隱藏Note box & 顯示note-not-login box
      if(document.querySelector(".note-list") &&document.querySelector(".note-not-login")){
        document.querySelector(".note-list").style.display = "none";
        document.querySelector(".note-not-login").style.display = "flex";
      }
    }
  },

};

module.exports = user;
