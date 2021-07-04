let models = {

};

let views = {
  nav:function(){
    //按下學習紀錄按鈕 => 導向自己
    let mylearning_btn = document.querySelector("#mylearning-btn");
    mylearning_btn.addEventListener("click",()=>{
      window.location.replace("/mylearning");
    });
    //按下登出按鈕 => 導向首頁
    let logout_btn = document.querySelector("#logout-btn");
    logout_btn.addEventListener("click",()=>{
      window.location.replace("/");
    });

  }
};

let controllers = {
  init:function(){
    views.nav();
  },
};

controllers.init();
