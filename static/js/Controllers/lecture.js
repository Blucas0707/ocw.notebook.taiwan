const model_lecture = require('../Models/lecture.js');
const view_lecture = require('../Views/lecture.js');
const actions = require('../Controllers/actions.js');

let lecture = {
  listLectures:async function(lecture_object,note_object){ //列出所有課程到list
    //取得課程資訊
    lecture_object = await model_lecture.getAllLectures(lecture_object,note_object);
    //取得課程狀態
    lecture_object = await model_lecture.getAllLecture_status(lecture_object,note_object);
    //顯示到選單上
    lecture_object = await view_lecture.renderAllLectures(lecture_object);
    //顯示課程是否已完成
    await view_lecture.renderLectureComplete(lecture_object);

    // //點選課程
    // actions.chooseLecture(lecture_object,note_object);

    // let lecture_video = document.querySelector(".lecture-video");
    // lecture_video.addEventListener("loadeddata",()=>{ //video loaded
    //   console.log("video load");
    //   //確認該堂影片是否觀看完成 > 85 %
    //   lecture_object = lecture.checkStatus(lecture_object,note_object);
    // })

  },
  checkStatus:function(lecture_object,note_object){ //確認該堂影片是否觀看完成 > 85 %
    // console.log(lecture_object.allLecture_status);
    let video = document.querySelector("#video-"+note_object.lecture_id);
    video.addEventListener("timeupdate",()=>{
      let video_ratio = video.currentTime / video.duration * 100;
      let lecture_status_elem = document.querySelector("#lecture-status-"+note_object.lecture_id);
      let blank_checkbox = lecture_status_elem.firstChild;
      let checkbox = lecture_status_elem.firstChild.nextElementSibling;
      //存現在時間到model allLecture_data裡面
      let index = parseInt(note_object.lecture_id.substr(6,9)) - 1;
      lecture_object.allLecture_status.lectures[index].lecture_video_current = video.currentTime;
      // console.log(lecture_object.allLecture_status.lectures[index].lecture_video_current);
      if(video_ratio > 85){
        //該堂狀態更新 0:未完成 1:完成
        lecture_object.allLecture_status.lectures[index].lecture_status = 1;
        //隱藏空格 ＆顯示完成格 ＆反藍
        blank_checkbox.style.display = "none";
        checkbox.style.display = "flex";
        lecture_status_elem.parentElement.style.backgroundColor = "#e5fff3";
      }
      return lecture_object;
    });
  },
}

module.exports = lecture;
