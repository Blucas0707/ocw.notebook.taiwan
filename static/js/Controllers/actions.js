const show = require('../Views/show.js');
const view_course = require('../Views/course.js');
const view_note = require('../Views/note.js');
const view_learning = require('../Views/learning.js');
const model_course = require('../Models/Course/course.js');
const model_lecture = require('../Models/lecture.js');
const controller_course = require('./course.js');
const model_note = require('../Models/note.js');
const controller_note = require('./note.js');
const model_learning = require('../Models/learning.js');
const controller_learning = require('./learning.js');

let actions = {
  clickmyProfile:function(){
    let myprofile_btn = document.querySelector("#my-profile");
    myprofile_btn.addEventListener("click",()=>{
      window.location.assign("/myprofile");
    })
  },
  clickProfile:function(){
    let profile_btn = document.querySelector("#profile-btn");
    profile_btn.addEventListener("click",()=>{
      show.showmyProfile();
    })
  },
  clickMenu:function(object){
    let menu_btn = document.querySelector(".img-hamburger-menu");
    menu_btn.addEventListener("click",()=>{
      // views.showMenu();
      show.showMenu(object);
    });
  },
  clickMyLearning:function(){
    let mylearning_btn = document.querySelector("#mylearning-btn");
    mylearning_btn.addEventListener("click",()=>{
      window.location.assign("/mylearning");
    });
  },
  clickNext_allCourse_list:function(object){
    return new Promise((resolve,reject)=>{
      let next_btns = document.querySelectorAll(".next-arrow");
      let allCourse_university_list =["","台灣大學","清華大學","陽明交通大學"];
      for(let index=0;index<next_btns.length;index++){
        let next_btn = next_btns[index];
        let allCourse_university = allCourse_university_list[index];
        next_btn.addEventListener("click",async ()=>{
          object.allCourse_university = allCourse_university;
          //  清空category
          if(index != 0){
            object.allCourse_category = "";
          }
          await model_course.getCourses(object);
            //data < 4 => 最後一頁,隱藏next btn
          if(object.allCourse_datalist[index].data == null){
            next_btn.style.display = "none";
          }
          else if (object.allCourse_datalist[index].data.length < 4){
            next_btn.style.display = "none";
          }

          if(object.allCourse_nextPages[index] != null){
            //最後not null page 存到temp
            object.allCourse_tempPages[index] = object.allCourse_nextPages[index];
            // console.log("not null");
            //clear sub elem
            let allCourse_div = document.querySelectorAll(".course-content-main")[index];
            view_course.clearCourses(allCourse_div); //清除.course-content-main 的子元素
            await view_course.renderAllCourses_list(object);
            controller_course.chooseCourse();
            //顯示previous btn
            // document.querySelector(".previous-arrow").style.display= "flex";
            let previous = document.querySelectorAll(".previous-arrow")[index];
            previous.style.display= "flex";
          }else{
            //隱藏Next button
            next_btn.style.display = "none";
            object.allCourse_nextPages[index] = object.allCourse_tempPages[index];
          }
          // });
        });
      }
      resolve(true);
    })
  },
  clickPrevious_allCourse_list:function(object){
    return new Promise((resolve,reject)=>{
      let previous_btns = document.querySelectorAll(".previous-arrow");
      let allCourse_university_list =["","台灣大學","清華大學","陽明交通大學"];
      for(let index=0;index<previous_btns.length;index++){
        let previous_btn = previous_btns[index];
        let allCourse_university = allCourse_university_list[index];
        previous_btn.addEventListener("click",async ()=>{
          //  清空category
          if(index != 0){
            object.allCourse_category = "";
          }

          //第一頁 隱藏previous btn
          if(object.allCourse_nextPages[index]>1){
            object.allCourse_nextPages[index] -= 2;
          }else{
            object.allCourse_nextPages[index] = 0;
          }
          if(object.allCourse_nextPages[index] == 0){
            let previous_btns = document.querySelectorAll(".previous-arrow")[index].style.display = "none";
          }

          object.allCourse_university = allCourse_university;
          await model_course.getCourses(object);
            // console.log(object.allCourse_data,object.allCourse_nextPages[index]);
          if(object.allCourse_nextPages[index] != null){
            //最後not null page 存到temp
            object.allCourse_tempPages[index] = object.allCourse_nextPages[index];
            // console.log("not null");
            //clear sub elem
            let allCourse_div = document.querySelectorAll(".course-content-main")[index];
            view_course.clearCourses(allCourse_div); //清除.course-content-main 的子元素
            await view_course.renderAllCourses_list(object);
            controller_course.chooseCourse();
            //顯示next btn
            // document.querySelector(".next-arrow").style.display= "flex";
            let next = document.querySelectorAll(".next-arrow")[index];
            next.style.display= "flex";
          }else{
            //隱藏previous_btn
            previous_btn.style.display = "none";
            object.allCourse_nextPages[index] = object.allCourse_tempPages[index];
          }
        });
      }
      resolve(true);
    })
  },
  chooseLecture:function(lecture_object,note_object){
    let result = lecture_object.allLecture_data;
    //取得所有li elems
    let li_elems = document.querySelectorAll("li");
    for(let index=0;index<li_elems.length;index++){
      let elem = li_elems[index];
      let last_click_elem = null;
      elem.addEventListener("click",async ()=>{
        //取得課程狀態
        // lecture_object = await model_lecture.getAllLecture_status(lecture_object,note_object);
        // 清空video src for reset
        document.querySelector(".lecture-video").src ="";
        //取得lecture_id
        note_object.lecture_id = elem.id.split("-")[1];

        // lecture_object = await model_lecture.getAllLectures(lecture_object,note_object);
        //取得&顯示notes
        note_object = await controller_note.getNotes(note_object);
        //清空notebox
        let notebox = document.querySelector("#note-input-content");
        notebox.value = "";
        //更改影片網址
        let lecture_video = document.querySelector(".lecture-video");
        lecture_video.id = "video-" + note_object.lecture_id.toString();
        lecture_video.src = result.data[index].lecture_video;
        if(lecture_object.allLecture_status.lectures[index] != undefined){ //SQL中有data
          // let video_current_time = lecture_object.allLecture_status.lectures[index].lecture_video_current;
          // lecture_video.currentTime = video_current_time;
          await changeVideotime(lecture_object,index);
          // console.log("change Time done");
          // console.log("video_current_time:",video_current_time);
          //For iphone
          // lecture_video.addEventListener("loadeddata",function setVideotime(){
          //   // console.log(lecture_video.currentTime);
          //   if(lecture_video.currentTime === 0) {
          //       // console.lo("11111");
          //       lecture_video.play();
          //       lecture_video.removeEventListener("loadeddata",setVideotime);
          //   }
          //   else {
          //       lecture_video.pause();
          //       lecture_video.currentTime = video_current_time;
          //       lecture_video.removeEventListener("loadeddata",setVideotime);
          //       lecture_video.play();
          //       // setTimeout(lecture_video.play, 500);
          //   }
          // })
        }

        // lecture_video.addEventListener("timeupdate",()=>{ //video loaded
        //   //儲存影片播放位置
        //   lecture_object.allLecture_status.lectures[video_index].lecture_video_current = lecture_video.currentTime;
        // })
        let this_video = document.querySelector("#"+lecture_video.id);
        this_video.addEventListener("loadeddata",()=>{ //video loaded
          console.log("video loadeddata: ",lecture_video.id);
          console.log("video index: ",index);
          //確認該堂影片是否觀看完成 > 85 %
          actions.checkStatus(lecture_object,note_object,index);
        })

        //更改下載相關
        let note_download = document.querySelector(".note-download");
        let reference_download = document.querySelector(".reference-download");
        let video_download = document.querySelector(".video-download");
        let download_elems = [note_download,reference_download,video_download];
        let download_elems_names = ["講義下載", "參考資料下載", "影音下載"];
        let download_elems_links = [result.data[index].lecture_note, result.data[index].lecture_reference, result.data[index].lecture_video];
        for(let download_index=0;download_index<download_elems.length;download_index++){
          //if link = "", 隱藏元素, else, 附加連結
          if(download_elems_links[download_index] == ""){
            download_elems[download_index].style.display = "none";
          }else{
            download_elems[download_index].style.display = "flex";
            download_elems[download_index].innerHTML = "";
            let link = document.createElement("a");
            link.href = download_elems_links[download_index];
            link.download = "";
            link.innerHTML = download_elems_names[download_index];
            download_elems[download_index].appendChild(link);
          }
        }
      });
    }
    function changeVideotime(lecture_object,index){
      let lecture_video = document.querySelector(".lecture-video");
      let video_current_time = lecture_object.allLecture_status.lectures[index].lecture_video_current;
      lecture_video.currentTime = video_current_time;
    }
  },
  checkStatus:function(lecture_object,note_object,index){ //確認該堂影片是否觀看完成 > 85 %
    let video = document.querySelector("#video-"+note_object.lecture_id);
    // let test;
    lecture_object = video.addEventListener("timeupdate",checkvideostatus);
    console.log("checkvideostatus");
    console.log(lecture_object);
    function checkvideostatus(){
      // console.log(index,video.currentTime);
      let video_ratio = video.currentTime / video.duration * 100;
      let lecture_status_elem = document.querySelector("#lecture-status-"+note_object.lecture_id);
      let blank_checkbox = lecture_status_elem.firstChild;
      let checkbox = lecture_status_elem.firstChild.nextElementSibling;
      //存現在時間到model allLecture_data裡面
      // let index = parseInt(note_object.lecture_id.substr(6,9)) - 1;
      // console.log("set time");
      lecture_object.allLecture_status.lectures[index].lecture_video_current = video.currentTime;
      // console.log(index,lecture_object.allLecture_status.lectures[index].lecture_video_current);

      if(video_ratio > 85){
        //該堂狀態更新 0:未完成 1:完成
        lecture_object.allLecture_status.lectures[index].lecture_status = 1;
        //隱藏空格 ＆顯示完成格 ＆反藍
        blank_checkbox.style.display = "none";
        checkbox.style.display = "flex";
        lecture_status_elem.parentElement.style.backgroundColor = "#e5fff3";
      }
      console.log("checkvideostatus");
      console.log(lecture_object);
      return lecture_object;
    };
    // let index = parseInt(note_object.lecture_id.substr(6,9)) - 1;
    // console.log(index,lecture_object.allLecture_status.lectures[index].lecture_video_current);
    return lecture_object;
  },
  clickCategory:function(learning_object){
    let course_category = document.querySelector("#learning-category");
    course_category.addEventListener("change",async ()=>{
      learning_object.allLearning_category = course_category.value;
      learning_object.allLearning_nextPage = 0;
      learning_object.complete_course_count = 0;
      learning_object = await model_learning.getLearningData(learning_object);
      //clear sub elem
      let course_content_main = document.querySelector(".course-content-main");
      view_learning.clearSubElem(course_content_main);
      //renderData
      await view_learning.renderData(learning_object);
      controller_learning.chooseCourse();
    })
  },
  clickProgess:function(learning_object){
    let progress_status = document.querySelector("#learning-status");
    progress_status.addEventListener("change",async ()=>{
      learning_object.allLearning_status = progress_status.value;
      learning_object.allLearning_nextPage = 0;
      learning_object.complete_course_count = 0;
      // console.log(models.learnings.allLearning_status,models.learnings.allLearning_nextPage);
      learning_object = await model_learning.getLearningData(learning_object);
        //clear sub elem
        let course_content_main = document.querySelector(".course-content-main");
        view_learning.clearSubElem(course_content_main);
        //renderData
        await view_learning.renderData(learning_object);
        controller_learning.chooseCourse();
      // });
    })
  },
  clickNextPage:function(learning_object){
    let nextpage_btn = document.querySelector(".next-arrow");
    nextpage_btn.addEventListener("click",async ()=>{
      learning_object = await model_learning.getLearningData(learning_object); //先取得data 來判斷是否為null
        // console.log(models.learnings.allLearning_nextPage);
        if(learning_object.allLearning_nextPage != null){
          //顯示頁碼
          document.querySelector(".course-content-page-number").innerHTML = learning_object.allLearning_nextPage;

          //最後not null page 存到temp
          learning_object.allLearning_tempPage = learning_object.allLearning_nextPage;
          //clear sub elem
          let course_content_main = document.querySelector(".course-content-main");
          view_learning.clearSubElem(course_content_main);
          // controllers.learnings.getAllLearnings();
          await view_learning.renderData(learning_object);
          controller_learning.chooseCourse();
          //顯示previous btn
          document.querySelector(".previous-arrow").style.display= "flex";
        }else{
          //隱藏Next button
          nextpage_btn.style.display = "none";
          learning_object.allLearning_nextPage = learning_object.allLearning_tempPage;
        }
      // })
    })
  },
  clickPreviousPage:function(learning_object){
    let previouspage_btn = document.querySelector(".previous-arrow");
    previouspage_btn.addEventListener("click",async ()=>{
      learning_object.allLearning_nextPage -= 2;
      learning_object = await model_learning.getLearningData(learning_object); //先取得data 來判斷是否為null
        // console.log(models.learnings.allLearning_nextPage);
        if(learning_object.allLearning_nextPage != null){
          //顯示頁碼
          document.querySelector(".course-content-page-number").innerHTML = learning_object.allLearning_nextPage;
          //最後not null page 存到temp
          learning_object.allLearning_tempPage = learning_object.allLearning_nextPage;
          //clear sub elem
          let course_content_main = document.querySelector(".course-content-main");
          view_learning.clearSubElem(course_content_main);
          // controllers.learnings.getAllLearnings();
          await view_learning.renderData(learning_object);
          controller_learning.chooseCourse();
          //顯示next btn
          document.querySelector(".next-arrow").style.display= "flex";
        }else{
          //隱藏Previous button
          previouspage_btn.style.display = "none";
          learning_object.allLearning_nextPage = learning_object.allLearning_tempPage;
        }
      // })
    })
  }
};

module.exports = actions;
