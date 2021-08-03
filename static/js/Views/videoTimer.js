function videoTimer(){
  let video_ratio = document.querySelector(".completed-ratio");
  let video = document.querySelector("video");
  // console.log(video.duration);
  // video change
  video.addEventListener("timeupdate",()=>{
    let video_Length = video.duration;
    let video_playLength = video.currentTime;
    let playRatio = (video_playLength/video_Length *100).toFixed(2);
    video_ratio.innerHTML = playRatio + "%";

    let note_video_current = document.querySelector("#note-video-current");
    let hour,min,sec;

    hour = (parseInt(video_playLength / 3600)).toString().padStart(2,"0");
    min = (parseInt((video_playLength - hour*3600) / 60)).toString().padStart(2,"0");
    sec = parseInt((video_playLength - min*60 - hour*3600)).toString().padStart(2,"0");
    // console.log(video_playLength,hour,min,sec);
    note_video_current.innerHTML = "at "+hour+":"+min+":"+sec;
  });
}

module.exports = videoTimer;
