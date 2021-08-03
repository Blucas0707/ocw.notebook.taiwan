let course = {
    clearCourses:function(elem){
      while(elem.hasChildNodes()){ //elem child存在
        elem.removeChild(elem.firstChild); //刪除子節點
      };
    },
    renderAllCourses_list:function(object){ // All/台/清/交
      let result = object.allCourse_result;
      let university = object.allCourse_university;
      let course_id, course_name, course_cover, course_teacher, course_description;
      let dataLength = result.data.length;
      for(let index = 0;index<dataLength;index++){
        course_id = result.data[index].course_id;
        course_name = result.data[index].course_name;
        course_cover = result.data[index].course_cover;
        course_teacher = result.data[index].course_teacher;
        course_description = result.data[index].course_description;
        // create new div under course-gallery
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

        div_course_class.appendChild(div_course_class_cover);
        div_course_class.appendChild(div_course_class_name);
        div_course_class.appendChild(div_course_class_teacher);

        let div_allCourse = "";
        if(university === ""){
          div_allCourse = document.querySelector("#allCourse");
        }
        else if(university === "台灣大學"){
          div_allCourse = document.querySelector("#allCourse_NTU");
        }
        else if(university === "清華大學"){
          div_allCourse = document.querySelector("#allCourse_NTHU");
        }
        else{
          div_allCourse = document.querySelector("#allCourse_NYTU");
        }
        div_allCourse.appendChild(div_course_class);
      }
      //點選課程
      // controller_course.chooseCourse();
    }
};

module.exports = course;
