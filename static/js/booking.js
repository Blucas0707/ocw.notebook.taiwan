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
      // console.log(this.loginData);
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
  booking:{
    bookingData:null,
    bookingDeleted:null,
    getBookingData:function(){
      return fetch("/api/booking",{
        method:"GET",
        headers: {"Content-type":"application/json;"},
      }).then((response)=>{
        return response.json();
      }).then((result)=>{
          this.bookingData = result;
          this.bookingDeleted = null;
          // console.log(result);
        // console.log(this.loginData);
      });
    },
    deleteBookingDate:function(){
      return fetch("api/booking", {
        method:"DELETE",
        headers: {"Content-type":"application/json;"},
      }).then((response)=>{
        return response.json();
      }).then((result)=>{
          this.bookingDeleted = result;
          this.bookingData = null;
          console.log(result);
        // console.log(this.loginData);
      });
    },
  },
  order:{
    Prime:null,
    orderData:null,
    establishOrder:function(){
      //judge if can get Prime
      if(TPDirect.card.getTappayFieldsStatus().canGetPrime==true){
        //get Prime from TapPay
        TPDirect.card.getPrime((result) => {
            if (result.status !== 0) {
                alert('get prime error ' + result.msg)
                return
            }
            // console.log('get prime 成功，prime: ' + result.card.prime);

            this.Prime = result.card.prime;

            let prime = result.card.prime;
            let price = models.booking.bookingData.data.price;
            let attractionId = models.booking.bookingData.data.attraction.id;
            let attractionName = models.booking.bookingData.data.attraction.name;
            let attractionAddress = models.booking.bookingData.data.attraction.address;
            let attractionImage = models.booking.bookingData.data.attraction.image;
            let date = models.booking.bookingData.data.date;
            let time = models.booking.bookingData.data.time;
            let name = models.loginData.data.name;
            let email = models.loginData.data.email;
            let phone = document.querySelector(".input-contact-phonenumber").value;

            let data = {
              "prime": prime,
              "order": {
                "price": price,
                "trip": {
                  "attraction": {
                    "id": attractionId,
                    "name": attractionName,
                    "address": attractionAddress,
                    "image": attractionImage
                  },
                  "date": date,
                  "time": time
                },
                "contact": {
                  "name": name,
                  "email": email,
                  "phone": phone
                }
              }
            };
            return fetch("/api/orders",{
              method:"POST",
              headers: {"Content-type":"application/json;"},
              body: JSON.stringify(data)
            }).then((response)=>{
              return response.json();
            }).then((result)=>{
              this.orderData = result;
              let order_number = result.data.number;
              console.log(order_number);
              //fade out
              let fadeout = new Promise(views.fadeout);
              fadeout.then(()=>{
                //redirect to thankyou page
                window.location.replace("/thankyou?number=" + order_number);
              });
            });
          });
      }
      else{ //can't get Prime
        //need check card info
        let primeFail = document.querySelector(".prime-fail");
        primeFail.style.display = "flex";

      }

    },
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
  renderData: function(resolve) {
    let greeting,username, email, attractionId, name, address, image, date, price, time, span, div;
    // let checkdeleted = models.booking.bookingDeleted;
    let dataexisted = models.booking.bookingData;
    //greeting
    username = models.loginData.data.name;
    greeting = document.querySelector(".greeting");
    greeting.innerHTML = "你好，" + username + "，待預訂的行程如下：";

    if(dataexisted == null){ //no booking data
      div = document.querySelector(".no-booking");
      div.style.display = "flex";
      div = document.querySelector(".attraction");
      div.style.display = "None";
      div = document.querySelector(".contact");
      div.style.display = "None";
      div = document.querySelector(".payment");
      div.style.display = "None";
      div = document.querySelector(".confirm");
      div.style.display = "None";
    }
    else{ //booking data exist
      let data = models.booking.bookingData.data;
      image = data.attraction.image;
      attractionId = data.attraction.id;
      name = data.attraction.name;
      address = data.attraction.address;
      image = data.attraction.image;
      date = data.date;
      price = data.price;
      time = data.time;

      //input username
      let input_name = document.querySelector(".input-contact-name");
      input_name.value = username;
      //input email
      email = models.loginData.data.email;
      let input_email = document.querySelector(".input-contact-email");
      input_email.value = email;
      // image
      let img = document.querySelector(".attraction-img-pic");
      img.src = image.toString();
      // name
      div = document.querySelector(".attraction-title");
      div.innerHTML = name;
      // date
      span = document.querySelector(".input-attraction-date");
      span.innerHTML = date;
      // time
      span = document.querySelector(".input-attraction-time");
      if(time=="morning"){
        span.innerHTML = "早上九點到下午四點";
      }else{
        span.innerHTML = "下午二點到晚上九點";
      }
      // price
      span = document.querySelector(".input-attraction-price");
      span.innerHTML = price + " 元";
      // address
      span = document.querySelector(".input-attraction-address");
      span.innerHTML = address;
    }
    //fade in
    views.fadein();
    resolve(true);
  },
  isloaded:function(){
    let loading = document.querySelector(".loading");
    let loaded = document.querySelector(".loaded");
    loading.style.display = "none";
    loaded.style.display = "block";
  },
  initCard:function(){
    var fields = {
      number: {
          // css selector
          element: "#card-number",
          placeholder: '**** **** **** ****'
      },
      expirationDate: {
          // DOM object
          element: "#card-expiration-date",
          placeholder: 'MM / YY'
      },
      ccv: {
          element: "#card-ccv",
          placeholder: 'ccv'
      },
    };
    // console.log(fields);
    // console.log(fields.number.element.value,fields.expirationDate.element.value,fields.ccv.element.value);
    //setup
    TPDirect.card.setup({
      fields:fields,
      styles:{
        // Style all elements
        'input':{
            'color':'gray',
        },
        // Styling ccv field
        'input.ccv': {
            // 'font-size': '16px'
        },
        // Styling expiration-date field
        'input.expiration-date': {
            // 'font-size': '16px'
        },
        // Styling card-number field
        'input.card-number': {
            // 'font-size': '16px'
        },
        // style focus state
        ':focus': {
            // 'color': 'black'
        },
        // style valid state
        '.valid': {
            'color': 'green'
        },
        // style invalid state
        '.invalid': {
            'color': 'red'
        },
        // Media queries
        // Note that these apply to the iframe, not the root window.
        // '@media screen and (max-width: 400px)': {
        //     'input': {
        //         'color': 'orange'
        //     }
        // }
      },
    });
  },
};


//controller
let controller = {
  booking:{
    deleteBooking:function(){
      let deletebtn = document.querySelector(".delete-icon");
      deletebtn.addEventListener("click",()=>{
        models.booking.deleteBookingDate().then(()=>{
          views.renderData();
          // models.booking.getBookingData().then(()=>{ //delete booking ans and refresh
          //   if(models.booking.bookingData == null){
          //     views.renderData();
          //   }
          //   });
        });
      });
    },
    viewBooking:function(){
      //init card info
      views.initCard();

      let viewbooking_btn = document.querySelector(".nav-schedule");
      viewbooking_btn.addEventListener("click",()=>{
        //not login
        let login = document.querySelector(".nav-login");
        if(login.innerHTML != "登出系統"){
          views.showLogin();
        }
        else{ //logged in => direct to /booking
          models.booking.getBookingData().then(()=>{ //get product pic
            if(models.booking.bookingData == null){
              views.renderData();
              }
            });
          }
      });
    },
  },
  order:{
    establishOrder:function(){
      let order_btn = document.querySelector(".confirm-btn");
      order_btn.addEventListener("click",()=>{
        let isInfoNull = new Promise(controller.isInfoNull);
        isInfoNull.then(()=>{
          models.order.establishOrder();
        });

      });
    },
  },
  isInfoNull:function(resolve){
    let nameInput = document.querySelector(".input-contact-name").value.replace(/\s*/g,""); //去除空白
    let emailUnput = document.querySelector(".input-contact-email").value.replace(/\s*/g,""); //去除空白
    let phoneInput = document.querySelector(".input-contact-phonenumber").value.replace(/\s*/g,""); //去除空白
    let confirm = document.querySelector(".info-fail");

    if(nameInput == "" || emailUnput == "" || phoneInput == ""){
      confirm.style.display = "flex";
    }
    else if(phoneInput.search(/^09\d{8}$/) != 0){ //phone format error
      confirm.style.display = "flex";
    }
    else{
      confirm.style.display = "none";
      resolve(true);
    }
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
  init:function(){
    let p = new Promise(controller.checkLogin);
    p.then(()=>{
      models.booking.getBookingData().then(()=>{ //get product pic
        let render = new Promise(views.renderData);
        render.then(()=>{
          views.isloaded();
        });
        //login/register or cancel
        controller.loginRegister();
        controller.cancelLoginRegister();
        // check login & logout
        controller.userRegister(); // user register btn
        controller.userLogin(); // user login btn
        // check delete booking
        controller.booking.deleteBooking();
        // view booking
        controller.booking.viewBooking();
        // orders
        controller.order.establishOrder();
      });
    }); //check login session

  }
}

controller.init();
