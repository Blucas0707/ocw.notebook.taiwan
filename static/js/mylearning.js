let models = {
  courses:{
    searchKeyword:function(keyword){
      return new Promise((resolve, reject)=>{
        let url = "/api/search?keyword=" + keyword;
        return fetch(url,{
          method:"GET",
        }).then((response)=>{
          return response.json();
        }).then((result)=>{
          // console.log(result);
          // console.log(result.hits.hits);
          resolve(result);
        });
      });
    },
  },
  learnings:{
    allLearning_nextPage:0,
    allLearning_tempPage:0,
    allLearning_category:"",
    allLearning_status:-1, //-1:all, 0:not start, 1:in progress, 100:done
    allLearning_data:null,
    complete_course_count:0,
    getLearningData:function(){
      return new Promise((resolve, reject)=>{
        let url = "/api/mylearnings" + "?page=" + models.learnings.allLearning_nextPage + "&status=" + models.learnings.allLearning_status + "&category=" + models.learnings.allLearning_category;
        // console.log(url);
        return fetch(url).then((response) => {
          return response.json();
        }).then((result) => {
          models.learnings.allLearning_data = result;
          models.learnings.allLearning_nextPage = result.nextPage;
          // console.log(result);
          resolve(true);
        });
      });
    },
  },
  user:{
    isLogin:null,
    checkLogin:function(){
      return new Promise((resolve, reject)=>{
        return fetch("/api/user",{
          method:"GET"
        }).then((response)=>{
          return response.json();
        }).then((result)=>{
          // console.log("checkLogin: " + result);
          // console.log(JSON.parse(result).data.id);
          if(result != null){
            models.user.isLogin = true;
            models.user_id = JSON.parse(result).data.id;
          }
          else{
            models.user.isLogin = null;
          }
          resolve(true);
        });
      });
    },
    Logout:function(){
      return new Promise((resolve, reject)=>{
        return fetch("/api/user",{
          method:"DELETE"
        }).then((response)=>{
          return response.json();
        }).then((result)=>{
          console.log(result);
          models.user.isLogin = null;
          resolve(true);
        });
      });
    },
  },
};

let views = {
  courses:{
    clearCourses:function(elem){
      while(elem.hasChildNodes()){ //elem child存在
        elem.removeChild(elem.firstChild); //刪除子節點
      };
    },
  },
  learnings:{
    renderData:function(){
      let course_id, course_name, course_cover, course_teacher, course_status, course_description;
      let result = models.learnings.allLearning_data.data;
      // console.log("result:"+result[0].course_id);
      // console.log(result);
      // console.log(result===null);
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

          // console.log(course_id,course_name,course_cover,course_teacher,course_description);
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
            models.learnings.complete_course_count += 1;
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
          // div_course_class.appendChild(div_course_class_description);
          div_allCourse = document.querySelector("#allCourse");
          // div_allCourse.style.opacity = 0;
          div_allCourse.appendChild(div_course_class);
          // views.fadein(div_allCourse);

        }
        //選取課程
        controllers.learnings.chooseCourse();
      }else{ //無紀錄
        document.querySelector(".course-content-page").style.display = "none";
        document.querySelector(".course-content-main").innerHTML = "無紀錄";
        document.querySelector(".course-content-main").style.fontSize = "2rem";
        document.querySelector(".course-border").style.border = "none";
      }
      //show 完成數
      // document.querySelector(".static-count").innerHTML = models.learnings.complete_course_count;
    },
  },
  user:{
    isLogin:function(){
      //判斷未登入
      if(models.user.isLogin == null){
        //導向首頁
        window.location.assign("/");
      }
    },
    Logout:function(){
      //判斷已經登出
      if(models.user.isLogin == null){
        //導向首頁
        window.location.assign("/");
      }
    },
  },
  nav:function(){
    //按下學習紀錄按鈕 => 導向自己
    let mylearning_btn = document.querySelector("#mylearning-btn");
    mylearning_btn.addEventListener("click",()=>{
      window.location.replace("/mylearning");
    });
  },
  fadein:function(elem){
    return new Promise((resolve,reject)=>{
      let speed = 2;
      let num = 0;
      let timer = setInterval(()=>{
        // views.isFadein = false;
        num += speed;
        elem.style.opacity = (num / 1000);
        // console.log(main.style.opacity);
        if(num >= 1000){
          clearInterval(timer);
          // views.isFadein = true;
          // resolve(true);
        }
      },10);
      resolve(true);
    })
  },
  clearSubElem:function(elem){

    while(elem.hasChildNodes()){ //elem child存在
      elem.removeChild(elem.firstChild); //刪除子節點
    };
  },
  showSearch:function(result){
    let search_results = result.hits.hits;
    // console.log(search_results[0]);
    // console.log(search_results[0]._source);
    let search_list = document.querySelector(".search-list");
    // clear
    views.courses.clearCourses(search_list);
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
};

let controllers = {
  courses:{
    searchBar:function(){
      let search_bar = document.querySelector("#keyword");
      search_bar.addEventListener("input",()=>{
        let keyword = search_bar.value;
        if(keyword != ""){
          models.courses.searchKeyword(keyword).then((result)=>{
            views.showSearch(result);
            //點擊其他地方=> 隱藏搜尋結果
            document.querySelector("html").addEventListener("click",()=>{
              document.querySelector(".search-list").style.display = "none";
            })
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
        if(keyword !=""){
          // models.courses.searchKeyword(keyword);
          window.location.assign("/search?keyword=" + keyword);
        }else{
          alert("關鍵字不得為空！");
        }
      })
    },
  },
  click:{
    clickCategory:function(){
      let course_category = document.querySelector("#learning-category");
      course_category.addEventListener("change",()=>{
        models.learnings.allLearning_category = course_category.value;
        models.learnings.allLearning_nextPage = 0;
        models.learnings.complete_course_count = 0;
        console.log(models.learnings.allLearning_category,models.learnings.allLearning_nextPage);
        models.learnings.getLearningData().then(()=>{
          //clear sub elem
          let course_content_main = document.querySelector(".course-content-main");
          views.clearSubElem(course_content_main);
          //renderData
          views.learnings.renderData();
        });
      })
    },
    clickProgess:function(){
      let progress_status = document.querySelector("#learning-status");
      progress_status.addEventListener("change",()=>{
        models.learnings.allLearning_status = progress_status.value;
        models.learnings.allLearning_nextPage = 0;
        models.learnings.complete_course_count = 0;
        // console.log(models.learnings.allLearning_status,models.learnings.allLearning_nextPage);
        models.learnings.getLearningData().then(()=>{
          //clear sub elem
          let course_content_main = document.querySelector(".course-content-main");
          views.clearSubElem(course_content_main);
          //renderData
          views.learnings.renderData();
        });
      })
    },
    clickNextPage:function(){
      let nextpage_btn = document.querySelector(".next-arrow");
      nextpage_btn.addEventListener("click",()=>{
        models.learnings.getLearningData().then(()=>{ //先取得data 來判斷是否為null
          // console.log(models.learnings.allLearning_nextPage);
          if(models.learnings.allLearning_nextPage != null){
            //顯示頁碼
            document.querySelector(".course-content-page-number").innerHTML = models.learnings.allLearning_nextPage;

            //最後not null page 存到temp
            models.learnings.allLearning_tempPage = models.learnings.allLearning_nextPage;
            //clear sub elem
            let course_content_main = document.querySelector(".course-content-main");
            views.clearSubElem(course_content_main);
            // controllers.learnings.getAllLearnings();
            views.learnings.renderData();
            //顯示previous btn
            document.querySelector(".previous-arrow").style.display= "flex";
          }else{
            //隱藏Next button
            nextpage_btn.style.display = "none";
            models.learnings.allLearning_nextPage = models.learnings.allLearning_tempPage;
          }
        })
      })
    },
    clickPreviousPage:function(){
      let previouspage_btn = document.querySelector(".previous-arrow");
      previouspage_btn.addEventListener("click",()=>{
        models.learnings.allLearning_nextPage -= 2;
        models.learnings.getLearningData().then(()=>{ //先取得data 來判斷是否為null
          // console.log(models.learnings.allLearning_nextPage);
          if(models.learnings.allLearning_nextPage != null){
            //顯示頁碼
            document.querySelector(".course-content-page-number").innerHTML = models.learnings.allLearning_nextPage;
            //最後not null page 存到temp
            models.learnings.allLearning_tempPage = models.learnings.allLearning_nextPage;
            //clear sub elem
            let course_content_main = document.querySelector(".course-content-main");
            views.clearSubElem(course_content_main);
            // controllers.learnings.getAllLearnings();
            views.learnings.renderData();
            //顯示next btn
            document.querySelector(".next-arrow").style.display= "flex";
          }else{
            //隱藏Previous button
            previouspage_btn.style.display = "none";
            models.learnings.allLearning_nextPage = models.learnings.allLearning_tempPage;
          }
        })
      })
    }

  },
  initialfadein:function(){
    return new Promise((resolve,reject)=>{
      let html = document.querySelector("html");
      views.fadein(html).then(()=>{
        resolve(true);
      });
    })
  },
  learnings:{
    getAllLearnings:function(){
      controllers.initialfadein().then(()=>{
        models.learnings.getLearningData().then(()=>{
          views.learnings.renderData();
        })
      });
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
  },
  member: {
    checkLogin:function(){
      return new Promise((resolve, reject)=>{
        models.user.checkLogin().then(()=>{
          // console.log("checkLogin");
          views.user.isLogin();
          resolve(true);
        });
      })
    },
    logout:function(){
      return new Promise((resolve, reject)=>{
        let logout_btn = document.querySelector("#logout-btn");
        logout_btn.addEventListener("click", ()=>{
          models.user.Logout().then(()=>{
            views.user.Logout();
            resolve(true);
          });
        });
      })
    },
  },
  init:function(){
    views.nav();
    controllers.member.checkLogin().then(()=>{
      controllers.member.logout();
      controllers.learnings.getAllLearnings();
      controllers.click.clickNextPage();
      controllers.click.clickPreviousPage();
      controllers.click.clickProgess();
      controllers.click.clickCategory();
      controllers.courses.searchKeyword();
      controllers.courses.searchBar();
      // controllers.initialfadein().then(()=>{
      //   controllers.learnings.getAllLearnings();
      // })
    });
  },
};

controllers.init();
