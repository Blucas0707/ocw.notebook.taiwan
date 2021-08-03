function nav(){
  //按下login btn
  let login_btn = document.querySelector("#login-btn");
  login_btn.addEventListener("click",()=>{

    //Goole logout
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
    });
    //顯示隱藏層
    let hideall = document.querySelector(".hideall");
    hideall.style.display="block";  //顯示隱藏層
    hideall.style.height=document.body.clientHeight+"px";  //設定隱藏層的高度為當前頁面高度   px是字尾

    //顯示登入窗
    let login_box = document.querySelector(".login-box");
    login_box.style.display = "block";
  });

  //按下register btn
  let register_btn = document.querySelector("#register-btn");
  register_btn.addEventListener("click",()=>{

    //顯示隱藏層
    let hideall = document.querySelector(".hideall");
    hideall.style.display="block";  //顯示隱藏層
    hideall.style.height=document.body.clientHeight+"px";  //設定隱藏層的高度為當前頁面高度   px是字尾

    //顯示註冊窗
    let register_box = document.querySelector(".register-box");
    register_box.style.display = "block";

  });

  //按下轉到註冊窗按鈕
  let transfertoRegister_btn = document.querySelector(".login-register");
  transfertoRegister_btn.addEventListener("click",()=>{
    //隱藏登入窗
    document.querySelector(".login-box").style.display = "none";
    //顯示註冊窗
    document.querySelector(".register-box").style.display = "block";
  });

  //按下轉到登入窗按鈕
  let transfertoLogin_btn = document.querySelector(".register-login");
  transfertoLogin_btn.addEventListener("click",()=>{
    //隱藏註冊窗
    document.querySelector(".register-box").style.display = "none";
    //顯示登入窗
    document.querySelector(".login-box").style.display = "block";
  });

  //按下登入取消按紐
  let login_cancel_btn = document.querySelector(".login-cancel");
  login_cancel_btn.addEventListener("click",()=>{
    //隱藏 隱藏層
    let hideall = document.querySelector(".hideall");
    hideall.style.display="none";  //顯示隱藏層

    //隱藏登入窗
    let login_box = document.querySelector(".login-box");
    login_box.style.display = "none";
  });

  //按下註冊取消按紐
  let register_cancel_btn = document.querySelector(".register-cancel");
  register_cancel_btn.addEventListener("click",()=>{
    //隱藏 隱藏層
    let hideall = document.querySelector(".hideall");
    hideall.style.display="none";  //顯示隱藏層

    //隱藏註冊窗
    let register_box = document.querySelector(".register-box");
    register_box.style.display = "none";
  });
}

module.exports = nav;
