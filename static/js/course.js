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
  },
  videoTimer:function(){
    let video_ratio = document.querySelector(".completed-ratio");
    let video = document.querySelector("video");
    console.log(video.duration);
    // video change
    video.addEventListener("timeupdate",()=>{
      let video_Length = video.duration;
      let video_playLength = video.currentTime;
      let playRatio = (video_playLength/video_Length *100).toFixed(2);
      video_ratio.innerHTML = playRatio + "%";
    });
  },


};

let controllers = {
  init:function(){
    views.nav();

  },
};

controllers.init();
views.videoTimer();
