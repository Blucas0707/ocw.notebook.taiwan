function learning_nav(){
  //按下學習紀錄按鈕 => 導向自己
  let mylearning_btn = document.querySelector("#mylearning-btn");
  mylearning_btn.addEventListener("click",()=>{
    window.location.replace("/mylearning");
  });
}

module.exports = learning_nav;
