let learning = {
  renderData:function(learning_object){
    let course_id, course_name, course_cover, course_teacher, course_status, course_description;
    let result = learning_object.allLearning_data.data;
    if(result != null){
      document.querySelector(".course-border").style.border = "1px solid #dcdacb";
      let dataLength = result.length;
      for(let index=0;index<dataLength;index++){
        course_id = result[index].course_id;
        course_name = result[index].course_name;
        course_cover = result[index].course_cover;
        course_teacher = result[index].course_teacher;
        course_status = result[index].course_status;
        course_description = result[index].course_description;

        let div_course_class = document.createElement('div');
        div_course_class.className = "course-class";
        div_course_class.id = course_id;

        // course_cover
        let div_course_class_cover = document.createElement("div");
        div_course_class_cover.className = "course-class-cover";
        // create new img under new div
        let img_cover = document.createElement("img");
        img_cover.src = course_cover;
        div_course_class_cover.appendChild(img_cover);
        //course_name
        let div_course_class_name = document.createElement("div");
        div_course_class_name.className = "course-class-name";
        div_course_class_name.innerHTML = course_name;
        if(course_name.length > 20 && course_name.length < 30){
          div_course_class_name.style.fontSize = "medium";
        }else if (course_name.length > 30) {
          div_course_class_name.style.fontSize = "small";
        }
        //course_teacher
        let div_course_class_teacher = document.createElement("div");
        div_course_class_teacher.className = "course-class-teacher";
        div_course_class_teacher.innerHTML = course_teacher;
        //course_status_bar
        let div_course_class_status_bar = document.createElement("div");
        div_course_class_status_bar .className = "course-class-status-bar";
        //course_status_subbar
        let div_course_class_status_subbar = document.createElement("div");
        div_course_class_status_subbar.className = "course-class-status-subbar";
        div_course_class_status_subbar.style.width = course_status + "%";
        div_course_class_status_bar.appendChild(div_course_class_status_subbar);
        //course_status
        let div_course_class_status = document.createElement("div");
        div_course_class_status.className = "course-class-status";
        div_course_class_status.innerHTML = course_status + "% Complete";
        if(course_status == 100){
          learning_object.complete_course_count += 1;
        }
        //course_description
        // let div_course_class_description= document.createElement("div");
        // div_course_class_description.className = "course-class-description";
        // div_course_class_description.innerHTML = course_description;

        div_course_class.appendChild(div_course_class_cover);
        div_course_class.appendChild(div_course_class_name);
        div_course_class.appendChild(div_course_class_teacher);
        div_course_class.appendChild(div_course_class_status_bar);
        div_course_class.appendChild(div_course_class_status);
        div_allCourse = document.querySelector("#allCourse");
        div_allCourse.appendChild(div_course_class);

      }
    }else{ //無紀錄
      document.querySelector(".course-content-page").style.display = "none";
      document.querySelector(".course-content-main").innerHTML = "無紀錄";
      document.querySelector(".course-content-main").style.fontSize = "2rem";
      document.querySelector(".course-border").style.border = "none";
    }
  },
  clearSubElem:function(elem){
    while(elem.hasChildNodes()){ //elem child存在
      elem.removeChild(elem.firstChild); //刪除子節點
    };
  },
  fadein:function(elem){
   return new Promise((resolve,reject)=>{
     let speed = 2;
     let num = 0;
     let timer = setInterval(()=>{
       // views.isFadein = false;
       num += speed;
       elem.style.opacity = (num / 1000);
       if(num >= 1000){
         clearInterval(timer);
       }
     },10);
     resolve(true);
   })
  },
  isLogin:function(user_object){
      //判斷已經登入
      if(user_object.isLogin){
        ///已登入 顯示學習紀錄&登出 隱藏登入＆註冊
        let mylearning_btn = document.querySelector("#mylearning-btn");
        let logout_btn = document.querySelector("#logout-btn");
        mylearning_btn.style.display = "flex";
        logout_btn.style.display = "flex";
        let profile_btn = document.querySelector("#profile-btn");
        profile_btn.style.display = "flex";

      }else{
        //導向首頁
        window.location.assign("/");
      }
    },
Logout:function(user_object){
  //判斷已經登出
  if(user_object.isLogin != true){
    //導向首頁
    window.location.assign("/");
  }
},
}

module.exports = learning;
