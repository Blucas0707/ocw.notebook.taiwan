const view_course = require('./course.js');

let show = {
  showSearch:function(object){
    let result = object.searchResult;
    let search_results = result.hits.hits;
    let search_list = document.querySelector(".search-list");
    // clear
    view_course.clearCourses(search_list);
    for(let index=0;index<search_results.length;index++){
      //新增 div search-box under div search-list
      let div_search_box = document.createElement("div");
      div_search_box.innerHTML = search_results[index]._source.course_name; //course_name
      div_search_box.className = "search-box";
      div_search_box.id = search_results[index]._id; //course_name
      search_list.appendChild(div_search_box);
      //滑鼠靠近反灰
      div_search_box.addEventListener("mouseover",()=>{
        div_search_box.style.backgroundColor = "#cccccc";
      })
      //滑鼠離開反白
      div_search_box.addEventListener("mouseout",()=>{
        div_search_box.style.backgroundColor = "white";
      })
      //點擊後，導向課程頁面
      div_search_box.addEventListener("click",()=>{
        window.location.assign("course/"+div_search_box.id);
      })
    }
    search_list.style.display = "block";
  },
  showMenu:function(object){
    let menu_box = document.querySelector(".nav-login-menu-box");
    if(object.isMenushow === false){
        menu_box.style.display = "block";
        object.isMenushow = true;
    }else{
      menu_box.style.display = "none";
      object.isMenushow = false;
    }
  },
  showmyProfile:function(){
    let profile_box_list = document.querySelector(".profile-box-list");
    if(profile_box_list.style.display === "none" || profile_box_list.style.display === ""){
        profile_box_list.style.display = "block";
    }else{
      profile_box_list.style.display = "none";
    }
  },
}

module.exports = show;
