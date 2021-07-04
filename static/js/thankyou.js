/*
    MVC (Model-View-Controller)
    資料處理 - 畫面處理 - 控制流程
  */
//models
let models = {
  data: null,
  loginData:null,
  logoutData:null,
  regsiterData:null,
  checkUserLogout:function(){
    return fetch("/api/user",{
      method:"DELETE"
    }).then((response)=>{
      return response.json();
    }).then((result)=>{
      this.logoutData = result;
      this.loginData = null;
      // console.log(this.loginData);
    })
  },
  checkUserLogin:function(){
    return fetch("/api/user",{
      method:"GET"
    }).then((response)=>{
      return response.json();
    }).then((result)=>{
      this.loginData = result;
      this.logoutData = null;
      console.log(this.loginData);
    });
  },
  validateRegister:function(){
    let formElement = document.querySelector("#register-form");
    let name = formElement.name.value;
    let email = formElement.email.value;
    let password = formElement.password.value;
    // regular rules
    var emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
    let emailCheck = true;
    let nameCheck = true;
    let passwordCheck = true;
    emailCheck = email.search(emailRule) == 0; //check email format
    nameCheck = name.length >= 4; //check name length >= 4
    passwordCheck = password.length >= 6; //check password >= 6
    // console.log(emailCheck,nameCheck,passwordCheck);
    this.regsiterData = {
      "name":nameCheck,
      "email":emailCheck,
      "password":passwordCheck
    };

    return nameCheck&&emailCheck&&passwordCheck;

  },
  getuserRegister:function(){
    let formElement = document.querySelector("#register-form");
    let name = formElement.name.value;
    let email = formElement.email.value;
    let password = formElement.password.value;
    let data = {
        "name":name,
        "email":email,
        "password":password
      };
    return fetch("/api/user",{
      method:"POST",
      headers: {"Content-type":"application/json;"},
      body: JSON.stringify(data)
    }).then((response)=>{
      return response.json();
    }).then((result)=>{
      this.regsiterData = result;
    });

  },
  validateLogin:function(){
    let email = document.querySelector(".login-email").value;
    let password = document.querySelector(".login-password").value;
    // regular rules
    // var emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
    let emailCheck = true;
    let passwordCheck = true;
    emailCheck = email.length > 0; //check email format
    passwordCheck = password.length > 0; //check password >= 0
    // console.log(emailCheck,passwordCheck);
    this.loginData = {
      "email":emailCheck,
      "password":passwordCheck
    };

    return emailCheck&&passwordCheck;

  },
  getuserLogin:function(){
    // let formElement = document.querySelector("#login-form");
    // let email = formElement.email.value;
    // let password = formElement.password.value;
    let email = document.querySelector(".login-email").value;
    let password = document.querySelector(".login-password").value;
    let data = {
      "email":email,
      "password":password
    };
    // console.log(email,password);
    return fetch("/api/user",{
      method:'PATCH',
      headers: {"Content-type":"application/json;"},
      body: JSON.stringify(data),
    }).then((response)=>{
      // console.log(response.json());
      return response.json();
    }).then((result)=>{

      this.loginData = result;
      // console.log(result);
    });
  },
  order:{
    orderData:null,
    getOrderData:function(){
      let orderNumber = location.search.split("?number=")[1];
      return fetch("/api/order/" + orderNumber ,{
        method:'GET',
        headers: {"Content-type":"application/json;"},
      }).then((response)=>{
        // console.log(response.json());
        return response.json();
      }).then((result)=>{
        this.orderData = result;
        // console.log(result);
      });
    }
  },
};
//views
let views = {
  isFadeout:false,
  isFadein:false,
  fadeout:function(resolve){
    let main = document.querySelector("html");
    let speed = 10;
    let num = 1000;
      let timer = setInterval(()=>{
        views.isFadeout = false;
        num -= speed;
        main.style.opacity = (num / 1000);
        // console.log(main.style.opacity);
        if(num <= 0){
          clearInterval(timer);
          views.isFadeout = true;
          resolve(true);
        }
      },10);
  },
  fadein:function(resolve){
    let main = document.querySelector("html");
    let speed = 10;
    let num = 0;
    let timer = setInterval(()=>{
      views.isFadein = false;
      num += speed;
      main.style.opacity = (num / 1000);
      // console.log(main.style.opacity);
      if(num >= 1000){
        clearInterval(timer);
        views.isFadein = true;
      }
    },10);
  },
  renderLogout:function(){
    let navLogin = document.querySelector(".nav-login");
    let navLogout = document.querySelector(".nav-logout");
    if(models.logoutData != null){ //get session success
      navLogin.style.display = "block";
      navLogout.style.display = "none";
    }
  },
  renderLogin:function(){
    let navLogin = document.querySelector(".nav-login");
    // let navLogout = document.querySelector(".nav-logout");
    if(models.loginData != null){ //get session success
      // navLogin.style.display = "none";
      // navLogout.style.display = "block";
      navLogin.innerHTML = "登出系統";
    }else{
      navLogin.innerHTML = "註冊/登入";
      window.location.replace("/"); //redirect to home page
    }
  },
  renderLoginValidation:function(){
    let loginstatus = document.querySelector(".login-status");
    loginstatus.style.display = "block";
    if(models.loginData.name == false || models.loginData.password == false){
      loginstatus.innerHTML = "帳號或密碼不得為空";
    }
  },
  LoginStatus:function(){
    let loginstatus = document.querySelector(".login-status");
    loginstatus.style.display = "block";
    if(models.loginData != null){
      if(models.loginData.error == true ){
        loginstatus.innerHTML = "登入失敗，帳號或密碼錯誤";
      }
      else{
        loginstatus.innerHTML = "登入成功";
        window.location.reload(); // reload
      }
    }
  },
  renderRegisterValidation:function(){
    let registerstatus = document.querySelector(".register-status");
    registerstatus.style.display = "block";
    if(models.regsiterData.name == false){
      registerstatus.innerHTML = "姓名長度必須大於4";
    }
    else if (models.regsiterData.email == false) {
      registerstatus.innerHTML = "電子信箱格式有誤";
    }
    else if (models.regsiterData.password == false) {
      registerstatus.innerHTML = "密碼長度亦須大於6";
    }
  },
  RegisterStatus:function(){
    let registerstatus = document.querySelector(".register-status");
    registerstatus.style.display = "block";
    if(models.regsiterData.error == true){
      registerstatus.innerHTML = "註冊失敗，電子信箱已被註冊";
    }
    else{
      if(models.regsiterData.ok == true){
        registerstatus.innerHTML = "註冊成功，請重新登入";
      }
      else{
        if(models.regsiterData.name == false){
          registerstatus.innerHTML = "姓名必須大於4個字元";
        }else if (models.regsiterData.email == false) {
          registerstatus.innerHTML = "電子郵件格式錯誤";
        }else if (models.regsiterData.password == false) {
          registerstatus.innerHTML = "密碼必須大於6個字元";
        }
      }
    }
  },
  showRegister:function(){
    let loginBox = document.querySelector(".login-box");
    loginBox.style.display = "none"; //隱藏loginBox
    let registerBox = document.querySelector(".register-box");
    registerBox.style.display = "block"; //show registerBox

    let registerStatus = document.querySelector(".register-status"); //clear login/register status
    let loginStatus = document.querySelector(".login-status");
    registerStatus.style.display = "none";
    loginStatus.style.display = "none";
  },
  showLogin:function(){
    let login = document.querySelector(".nav-login");
    if(login.innerHTML == "註冊/登入"){
      let hideall = document.querySelector(".hideall");
      hideall.style.display="block";  //顯示隱藏層
      hideall.style.height=document.body.clientHeight+"px";  //設定隱藏層的高度為當前頁面高度   px是字尾

      let loginBox = document.querySelector(".login-box");
      loginBox.style.display = "block"; //顯示彈出層
      let registerBox = document.querySelector(".register-box");
      registerBox.style.display = "none"; //隱藏 registerBox

      let registerStatus = document.querySelector(".register-status"); //clear login/register status
      let loginStatus = document.querySelector(".login-status");
      registerStatus.style.display = "none";
      loginStatus.style.display = "none";
    }else{
      login.style.display = "block";
      login.innerHTML = "註冊/登入";
      models.checkUserLogout(); //logout & delete session
      window.location.replace("/"); //direct to home page
    }

  },
  cancelLogin:function(){
    let hideall = document.querySelector(".hideall");
    hideall.style.display="none"; //隱藏hide
    let loginBox = document.querySelector(".login-box");
    loginBox.style.display="none"; //隱loginBox
    let registerBox = document.querySelector(".register-box");
    registerBox.style.display="none";  //隱藏register box
  },
  renderData: function() {
    //fade in
    views.fadein();
    let greeting = document.querySelector(".greeting");
    let paymentStatus = document.querySelector(".payment-status");
    if(models.order.orderData != null){
      greeting.innerHTML = "您好，" + models.order.orderData.data.contact.name +",";
      paymentStatus.innerHTML ="訂單："+models.order.orderData.data.number+ " 已成立，請歡迎再次下訂！";
    }
    else{
      greeting.style.display = "None";
      paymentStatus.innerHTML ="預定失敗，請重新下訂！";
    }
  },
};


//controller
let controller = {
  order:{

  },
  checkLogin:function(resolve){
    models.checkUserLogin().then(()=>{
      views.renderLogin();
      resolve(true);
    });
  },
  userRegister:function(){
    let register = document.querySelector(".register-btn");
    register.addEventListener("click",()=>{
      let validation = models.validateRegister(); //驗證註冊資料
      // console.log(validation);
      if(validation){
        models.getuserRegister().then(()=>{
          views.RegisterStatus();
        });
      }else{
        views.renderRegisterValidation();
      }
    });
  },
  userLogin:function(){
    let login = document.querySelector(".login-btn");
    login.addEventListener("click",()=>{
      let validation = models.validateLogin(); //驗證登入資料
      // console.log(validation);
      if(validation){
        models.getuserLogin().then(()=>{
          views.LoginStatus();
        });
      }else{
        views.renderLoginValidation();
      }
    });
  },
  cancelLoginRegister:function(){
    let cancelLoginbtn = document.querySelector(".login-cancel");
    let cancelRegisterbtn = document.querySelector(".register-cancel");
    cancelLoginbtn.addEventListener("click",views.cancelLogin);
    cancelRegisterbtn.addEventListener("click",views.cancelLogin);
  },
  loginRegister:function(){

    let loginBox = document.querySelector(".nav-login"); //index to loginBox
    loginBox.addEventListener("click",views.showLogin);

    let register = document.querySelector(".login-register"); //loginBox to RegisterBox
    register.addEventListener("click",views.showRegister);

    let loginbtn =  document.querySelector(".login-btn"); //login btn
    loginbtn.addEventListener("click",this.userLogin);

    let backtologin = document.querySelector(".register-login"); // registerBox to loginBox
    backtologin.addEventListener("click",views.showLogin);
  },
  booking:{
    viewBooking:function(){
      let viewbooking_btn = document.querySelector(".nav-schedule");
      viewbooking_btn.addEventListener("click",()=>{
        window.location.replace("/booking");
      });
    },
  },
  init:function(){
    let p = new Promise(controller.checkLogin);
    p.then(()=>{
      models.order.getOrderData().then(()=>{ //get product pic
        views.renderData();
        //login/register or cancel
        controller.loginRegister();
        controller.cancelLoginRegister();
        // check login & logout
        controller.userRegister(); // user register btn
        controller.userLogin(); // user login btn
        // view booking
        controller.booking.viewBooking();
      });
    });

  }
}

controller.init();
