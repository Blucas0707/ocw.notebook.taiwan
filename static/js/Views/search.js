let search = {
  renderTitle:function(){
    let search_title = document.querySelector(".course-title");
    let keyword = decodeURIComponent(window.location.search).split("=")[1];
    search_title.innerHTML = "搜尋結果:「" + keyword +"」";
  },
  renderAllSearch:function(course_object){
    let result = course_object.searchResult;
    let search_results = result.hits.hits;
    let search_list = document.querySelector(".course-content-main");
    if(search_results.length != 0){
      for(let index=0;index<search_results.length;index++){
        //新增 div search-box under div search-list
        let search_result = search_results[index];
        course_id = search_result._id;
        course_name = search_result._source.course_name; //course_name
        course_cover = search_result._source.course_cover; //course_name
        course_teacher = search_result._source.course_teacher; //course_name
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
        search_list.appendChild(div_course_class);

        div_course_class.addEventListener("click",()=>{
          window.location.assign("course/"+div_course_class.id);
        })
      }
    }else{ //no result
      search_list.innerHTML = "此次搜尋無結果";
      search_list.style.fontSize = "2rem";
      document.querySelector(".course-content").style.display = "flex";
      document.querySelector(".course-content").style.justifyContent = "center";
      document.querySelector(".course-content").style.alignItems = "center";

    }
  }
};

module.exports = search;
