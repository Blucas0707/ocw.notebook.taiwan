
let lecture = {
  renderAllLectures:function(lecture_object){
    let result = lecture_object.allLecture_data;
    // return new Promise((resolve,reject)=>{
      //課堂標題
      document.querySelector(".course-title").innerHTML = result["course_name"];

      // lecture list
      for(let index=0;index<result.total;index++){
        let lecture_id,lecture_name, lecture_video, lecture_note, lecture_reference;

        //課堂
        lecture_id = result.course_id + result.data[index].lecture_id.toString().padStart(3,"0");
        lecture_name = result.data[index].lecture_name;
        lecture_video = result.data[index].lecture_video;
        lecture_note = result.data[index].lecture_note;
        lecture_reference = result.data[index].lecture_reference;
        // create new li for lecture-list
        let li_lecture = document.createElement("li");
        li_lecture.id = "li-" + lecture_id.toString();
        // create new div under lecture-list
        let div_lecture_status = document.createElement("div");
        div_lecture_status.className = "lecture-status";
        div_lecture_status.id = "lecture-status-" + lecture_id;
        let img = document.createElement("img");
        img.className = "check-box-img";
        img.src = "/img/blank-check-box.svg"
        img.id = "blank-check-box";
        div_lecture_status.appendChild(img);
        img = document.createElement("img");
        img.className = "check-box-img";
        img.src = "/img/check-box.svg"
        img.id = "check-box";
        div_lecture_status.appendChild(img);

        // create new div under lecture-list
        let div_lecture_id = document.createElement("div");
        div_lecture_id.className = "lecture-id";
        div_lecture_id.innerHTML = "單元 " + (index+1).toString() + " ";
        // create new div under lecture-list
        let div_lecture_name = document.createElement("div");
        div_lecture_name.className = "lecture-name";
        div_lecture_name.innerHTML = lecture_name;
        // create new div under lecture-list
        let div_lecture_video = document.createElement("div");
        div_lecture_video.className = "lecture-video-link";
        div_lecture_video.innerHTML = lecture_video;
        // create new div under lecture-list
        let div_lecture_current = document.createElement("div");
        div_lecture_current.className = "lecture-video-current";
        div_lecture_current.innerHTML = 0;

        li_lecture.appendChild(div_lecture_status);
        li_lecture.appendChild(div_lecture_id);
        li_lecture.appendChild(div_lecture_name);
        li_lecture.appendChild(div_lecture_video);
        li_lecture.appendChild(div_lecture_current);

        //新增li to lecture-list
        let ul_lecture_list = document.querySelector(".lecture-list");
        ul_lecture_list.appendChild(li_lecture);

        if(lecture_object.isgetallLecture_status === false){
          //新增到model data
          let data = {
            "lecture_id":lecture_id,
            "lecture_video_current":0,
            "lecture_status":0,
          };
          lecture_object.allLecture_status.lectures.push(data);
        }
      };
      // console.log("renderList: "+models.lectures.allLecture_status);
      //點擊課堂
      // controllers.click.chooseLecture();
      return lecture_object;
      // resolve(true);
    // })
  },
  renderLectureComplete:function(lecture_object){//顯示是否完成
    let li_lectures = document.querySelectorAll("li");
    for(let index=0;index<li_lectures.length;index++){
      //該堂狀態更新 0:未完成 1:完成
      if(lecture_object.allLecture_status.lectures[index].lecture_status == 1){
        //隱藏空格 ＆顯示完成格 ＆反藍
        li_lectures[index].style.backgroundColor = "#e5fff3";
        let blank_checkbox = li_lectures[index].firstChild.firstChild;
        let checkbox = li_lectures[index].firstChild.firstChild.nextSibling;
        blank_checkbox.style.display = "none";
        checkbox.style.display = "flex";
      }
    }
  },
}

module.exports = lecture;
