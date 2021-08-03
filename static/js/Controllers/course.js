const show = require('../Views/show.js');
const view_course = require('../Views/course.js');
const model_course = require('../Models/Course/course.js');

let course = {
  searchBar:function(course_object){
    let search_bar = document.querySelector("#keyword");
    search_bar.addEventListener("input",async ()=>{
      let keyword = search_bar.value;
      course_object.searchkeyword = search_bar.value;
      if(keyword != ""){
        await model_course.searchKeyword(course_object);
        show.showSearch(course_object);
        //點擊其他地方=> 隱藏搜尋結果
        document.querySelector("html").addEventListener("click",()=>{
          document.querySelector(".search-list").style.display = "none";
        })
      }else{
        document.querySelector(".search-list").style.display = "none";
      }

    })
  },
  searchKeyword:function(){
    let search_btn = document.querySelector(".keyin_Keyword");
    search_btn.addEventListener("click",()=>{
      let keyword = document.querySelector("#keyword").value;
      if(window.outerWidth >= 1200){ //RWD解析度
        if(keyword !=""){
          window.location.assign("/search?keyword=" + keyword);
        }
        else{
          alert("關鍵字不得為空！");
        }
      }else{
        let search_box = document.querySelector("#keyword");
        if(search_box.style.display === "none" || search_box.style.display === ""){
          search_box.style.display = "flex";
        }else{
          search_box.style.display = "none";
        }
      }
    })
  },
  chooseCategory:function(course_object){
    let course_category = document.querySelector("#learning-category");
    course_category.addEventListener("change",async ()=>{
      course_object.allCourse_category = course_category.value;
      course_object.allCourse_nextPages[0] = 0;
      course_object.allCourse_university = "";
      await model_course.getCourses(course_object);
      //clear sub elem
      let allCourse_div = document.querySelector("#allCourse");
      view_course.clearCourses(allCourse_div); //清除.course-content-main 的子元素
      await view_course.renderAllCourses_list(course_object);
      this.chooseCourse();
    })
  },
  chooseCourse:function(){
    let course_list = document.querySelectorAll(".course-class");
    for(let index=0;index<course_list.length;index++){
      let url = "/course/" + course_list[index].id;
      course_list[index].addEventListener("mouseover",()=>{
        course_list[index].style.opacity = 0.5;
      });
      course_list[index].addEventListener("mouseout",()=>{
        course_list[index].style.opacity = 1;
      });

      course_list[index].addEventListener("click",()=>{
        window.location.assign(url);
      });
    }
  },
  allCourse_list:async function(course_object){ // All台清交
    //All
    course_object.allCourse_university = "";
    await model_course.getCourses(course_object);
    view_course.renderAllCourses_list(course_object);
    //台大
    course_object.allCourse_university = "台灣大學";
    await model_course.getCourses(course_object);
    view_course.renderAllCourses_list(course_object);
    //清大
    course_object.allCourse_university = "清華大學";
    await model_course.getCourses(course_object);
    view_course.renderAllCourses_list(course_object);
    //交大
    course_object.allCourse_university = "陽明交通大學";
    await model_course.getCourses(course_object);
    view_course.renderAllCourses_list(course_object);

    this.chooseCourse();
  },
};

module.exports = course;
