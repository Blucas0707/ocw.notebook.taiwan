let models = {
  courses:{
    allCourse_nextPage:0,
    allCourse_tempPage:0,
    allCourse_category:"",
    allCourse_university:"",
    allCourse_data:null,
    getAllCourse:function(){
      return new Promise((resolve, reject)=>{
        let url = "/api/courses" + "?page=" + models.courses.allCourse_nextPage + "&category=" + models.courses.allCourse_category + "&university=" + models.courses.allCourse_university;
        // console.log(url);
        return fetch(url).then((response) => {
          return response.json();
        }).then((result) => {
          models.courses.allCourse_data = result;
          // console.log(models.courses.allCourse_data);
          resolve(true);
        });
      });
    },
    allCourse_nextPages:[0,0,0,0], // All/台/清/交
    allCourse_tempPages:[0,0,0,0], // All/台/清/交
    allCourse_datalist:[null,null,null,null], // All/台/清/交
    getCourses:function(category,university){
      return new Promise((resolve, reject)=>{

        let page = "";
        if (university == ""){
          page = models.courses.allCourse_nextPages[0];
        }
        else if (university == "台灣大學"){
          page = models.courses.allCourse_nextPages[1];
        }
        else if (university == "清華大學") {
          page = models.courses.allCourse_nextPages[2];
        }
        else{
          page = models.courses.allCourse_nextPages[3];
        }

        let url = "/api/courses" + "?page=" + page + "&category=" + category + "&university=" + university;
        // console.log(url);
        return fetch(url).then((response) => {
          return response.json();
        }).then((result) => {
          if(university == ""){
            models.courses.allCourse_datalist[0] = result;
            models.courses.allCourse_nextPages[0] = result.nextPage;
          }
          else if(university == "台灣大學"){
            models.courses.allCourse_datalist[1] = result;
            models.courses.allCourse_nextPages[1] = result.nextPage;
          }
          else if (university == "清華大學") {
            models.courses.allCourse_datalist[2] = result;
            models.courses.allCourse_nextPages[2] = result.nextPage;
          }
          else{
            models.courses.allCourse_datalist[3] = result;
            models.courses.allCourse_nextPages[3] = result.nextPage;
          }
          // console.log(models.courses.allCourse_data);
          // console.log(result);
          resolve([result,university]);
        });
      });
    },
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
  user:{
    isGoogleLogin:null,
    loginSuccess:null,
    useGoogleLogin:false,
    Login:function(){
      return new Promise((resolve, reject)=>{
        //reset registerSuccess
        models.user.loginSuccess = null;
        let email = document.querySelector(".login-email").value;
        let password = document.querySelector(".login-password").value;
        let data = {
          "email":email,
          "password":password
        };
        // console.log(email,password);
        return fetch("/api/user",{
          method:'PATCH',
          headers: {
            "Content-type":"application/json",
          },
          body: JSON.stringify(data),
        }).then((response)=>{
          return response.json();
        }).then((result)=>{
          result = JSON.parse(result);
          if(result.ok){
            models.user.loginSuccess = true;
          }else{
            models.user.loginSuccess = false;
          }
          // console.log(result);
          // console.log(models.user.loginSuccess);
          resolve(true);
        });
      });
    },
    GoogleLogin:function(id_token){
      return new Promise((resolve, reject)=>{
        models.user.loginSuccess = null;
        return fetch('/api/google/login/' + id_token,{
          method:'POST',
          headers: {
            'Content-Type':'application/x-www-form-urlencoded',
          },
        }).then((response)=>{
          return response.json();
        }).then((result)=>{
          result = JSON.parse(result);
          if(result.ok){
            models.user.loginSuccess = true;
            models.user.isGoogleLogin = true;
            console.log(models.user.isGoogleLogin);
          }else{
            models.user.loginSuccess = false;
            models.user.isGoogleLogin = false;
          }
          resolve(true);
        });
      });
    },
    isLogin:null,
    checkLogin:function(){
      return new Promise((resolve, reject)=>{
        return fetch("/api/user",{
          method:"GET"
        }).then((response)=>{
          return response.json();
        }).then((result)=>{
          // console.log(result);
          if(result != null){
            models.user.isLogin = true;
          }
          else{
            models.user.isLogin = false;
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
    registerSuccess:null,
    Register:function(){
      return new Promise((resolve, reject)=>{
        //reset registerSuccess
        models.user.registerSuccess = null;
        let formElement = document.querySelector("#register-form");
        let name = formElement.name.value;
        let email = formElement.email.value;
        let password = formElement.password.value;
        let data = {
            name:name.toString(),
            email:email.toString(),
            password:password.toString()
          };
        console.log(data);
        return fetch("/api/user",{
          method:"POST",
          headers: {
            "Content-type":"application/json",
          },
          body: JSON.stringify(data)
        }).then((response)=>{
          return response.json();
        }).then((result)=>{
          result = JSON.parse(result);
          if(result.ok){
            models.user.registerSuccess = true;
          }else{
            models.user.registerSuccess = false;
          }
          // console.log(result);
          // console.log(models.user.registerSuccess);
          resolve(true);
        });
      })
    },
  },
};

let views = {
  fadeout:function(elem){
    let speed = 10;
    let num = 1000;
    let timer = setInterval(()=>{
      // views.isFadeout = false;
      num -= speed;
      elem.style.opacity = (num / 1000);
      // console.log(main.style.opacity);
      if(num <= 0){
        clearInterval(timer);
        views.isFadeout = true;
        resolve(true);
      }
    },10);
  },
  fadein:function(elem){
    let speed = 10;
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
  },
  click:{
    allCourse:function(index){
      return new Promise((resolve, reject)=>{
        let previous = document.querySelectorAll(".previous-arrow")[index];
        let next = document.querySelectorAll(".next-arrow")[index];
        console.log(models.courses.allCourse_nextPages[index]);
        if(models.courses.allCourse_nextPages[index]==0){
          //隱藏previous btn
          previous.style.display="none";
        }else if (models.courses.allCourse_nextPages[index]==null) {
          //隱藏next btn
          next.style.display="none";
        }else{
          //顯示previous & next btn
          previous.style.display="flex";
          next.style.display="flex";
        }
        resolve(true);
      });
    }
  },
  courses:{
    clearCourses:function(elem){
      while(elem.hasChildNodes()){ //elem child存在
        elem.removeChild(elem.firstChild); //刪除子節點
      };
    },
    renderTitle:function(){
      let search_title = document.querySelector(".course-title");
      let keyword = decodeURIComponent(window.location.search).split("=")[1];
      search_title.innerHTML = "搜尋結果:「" + keyword +"」";
    },
    renderAllSearch:function(result){
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
    },
    renderAllCourses_list:function(result,university){ // All/台/清/交
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
        //course_description
        // let div_course_class_description= document.createElement("div");
        // div_course_class_description.className = "course-class-description";
        // div_course_class_description.innerHTML = course_description;

        div_course_class.appendChild(div_course_class_cover);
        div_course_class.appendChild(div_course_class_name);
        div_course_class.appendChild(div_course_class_teacher);
        // div_course_class.appendChild(div_course_class_description);
        let div_allCourse = "";
        if(university ==""){
          div_allCourse = document.querySelector("#allCourse");
        }
        else if(university =="台灣大學"){
          div_allCourse = document.querySelector("#allCourse_NTU");
        }
        else if(university =="清華大學"){
          div_allCourse = document.querySelector("#allCourse_NTHU");
        }
        else{
          div_allCourse = document.querySelector("#allCourse_NYTU");
        }
        // div_allCourse.style.opacity = 0;
        div_allCourse.appendChild(div_course_class);
        // views.fadein(div_allCourse);
      }

      //點選課程
      controllers.courses.chooseCourse();

    }
  },
  user:{
    registerStatus:function(){
      let register_status = document.querySelector(".register-status");
      register_status.style.display = "flex";
      if(models.user.registerSuccess){ // register success
        register_status.innerHTML = "註冊成功，請登入";
        register_status.style.color = "blue";

        //清除註冊資訊
        let formElement = document.querySelector("#register-form");
        formElement.name.value = "";
        formElement.email.value = "";
        formElement.password.value = "";

      }else{
        // register fail
        let formElement = document.querySelector("#register-form");
        let name = formElement.name.value;
        let email = formElement.email.value;
        let password = formElement.password.value;
        //其中為空
        if(name == "" || email == "" || password == ""){
          register_status.innerHTML = "註冊失敗，請確認輸入";
          register_status.style.color = "red";
        }
        else{
          register_status.innerHTML = "註冊失敗，電子信箱已被註冊";
          register_status.style.color = "red";
        }
      }
    },
    loginStatus:function(){
      let login_status = document.querySelector(".login-status");
      login_status.style.display = "flex";
      if(models.user.loginSuccess){ // register success
        login_status.innerHTML = "登入成功";
        login_status.style.color = "blue";

        //清除登入資訊
        document.querySelector(".login-email").value = "";
        document.querySelector(".login-password").value = "";
        // 重新導向 "/"
        window.location.replace('/');

      }else{ // register fail
        login_status.innerHTML = "登入失敗，帳號或密碼錯誤";
        login_status.style.color = "red";
      }
    },
    isLogin:function(){
      //判斷已經登入
      if(models.user.isLogin){
        ///已登入 顯示學習紀錄&登出 隱藏登入＆註冊
        let mylearning_btn = document.querySelector("#mylearning-btn");
        let logout_btn = document.querySelector("#logout-btn");
        mylearning_btn.style.display = "flex";
        logout_btn.style.display = "flex";

        let login_btn = document.querySelector("#login-btn");
        let register_btn = document.querySelector("#register-btn");
        login_btn.style.display = "none";
        register_btn.style.display = "none";
      }else{
        //未登入 顯示登入＆註冊 隱藏學習紀錄 & 登出
        //未登入 顯示登入＆註冊 隱藏學習紀錄 & 登出
        let login_btn = document.querySelector("#login-btn");
        let register_btn = document.querySelector("#register-btn");
        login_btn.style.display = "flex";
        register_btn.style.display = "flex";

        let mylearning_btn = document.querySelector("#mylearning-btn");
        let logout_btn = document.querySelector("#logout-btn");
        mylearning_btn.style.display = "none";
        logout_btn.style.display = "none";
      }
    },
    Logout:function(){
      //判斷已經登出
      if(models.user.isLogin == null){
        //顯示登入＆註冊
        let login_btn = document.querySelector("#login-btn");
        let register_btn = document.querySelector("#register-btn");
        login_btn.style.display = "flex";
        register_btn.style.display = "flex";
        //隱藏學習紀錄 & 登出
        let mylearning_btn = document.querySelector("#mylearning-btn");
        let logout_btn = document.querySelector("#logout-btn");
        mylearning_btn.style.display = "none";
        logout_btn.style.display = "none";
      }
    },
  },
  nav:function(){
    //按下login btn
    let login_btn = document.querySelector("#login-btn");
    login_btn.addEventListener("click",()=>{

      //Goole logout
      var auth2 = gapi.auth2.getAuthInstance();
      auth2.signOut().then(function () {
        console.log('User signed out.');
      });
      //顯示隱藏層
      let hideall = document.querySelector(".hideall");
      hideall.style.display="block";  //顯示隱藏層
      hideall.style.height=document.body.clientHeight+"px";  //設定隱藏層的高度為當前頁面高度   px是字尾

      //顯示登入窗
      let login_box = document.querySelector(".login-box");
      login_box.style.display = "block";
    });

    //按下register btn
    let register_btn = document.querySelector("#register-btn");
    register_btn.addEventListener("click",()=>{

      //顯示隱藏層
      let hideall = document.querySelector(".hideall");
      hideall.style.display="block";  //顯示隱藏層
      hideall.style.height=document.body.clientHeight+"px";  //設定隱藏層的高度為當前頁面高度   px是字尾

      //顯示註冊窗
      let register_box = document.querySelector(".register-box");
      register_box.style.display = "block";

    });

    //按下轉到註冊窗按鈕
    let transfertoRegister_btn = document.querySelector(".login-register");
    transfertoRegister_btn.addEventListener("click",()=>{
      //隱藏登入窗
      document.querySelector(".login-box").style.display = "none";
      //顯示註冊窗
      document.querySelector(".register-box").style.display = "block";
    });

    //按下轉到登入窗按鈕
    let transfertoLogin_btn = document.querySelector(".register-login");
    transfertoLogin_btn.addEventListener("click",()=>{
      //隱藏註冊窗
      document.querySelector(".register-box").style.display = "none";
      //顯示登入窗
      document.querySelector(".login-box").style.display = "block";
    });

    //按下登入取消按紐
    let login_cancel_btn = document.querySelector(".login-cancel");
    login_cancel_btn.addEventListener("click",()=>{
      //隱藏 隱藏層
      let hideall = document.querySelector(".hideall");
      hideall.style.display="none";  //顯示隱藏層

      //隱藏登入窗
      let login_box = document.querySelector(".login-box");
      login_box.style.display = "none";
    });

    //按下註冊取消按紐
    let register_cancel_btn = document.querySelector(".register-cancel");
    register_cancel_btn.addEventListener("click",()=>{
      //隱藏 隱藏層
      let hideall = document.querySelector(".hideall");
      hideall.style.display="none";  //顯示隱藏層

      //隱藏註冊窗
      let register_box = document.querySelector(".register-box");
      register_box.style.display = "none";
    });
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
  showMenu:function(){
    let menu_box = document.querySelector(".nav-login-menu-box");
    if(controllers.actions.isMenushow === false){
        menu_box.style.display = "block";
        controllers.actions.isMenushow = true;
    }else{
      menu_box.style.display = "none";
      controllers.actions.isMenushow = false;
    }
  },
};

let controllers = {
  actions:{
    isMenushow:false,
    clickMenu:function(){
      let menu_btn = document.querySelector(".img-hamburger-menu");
      menu_btn.addEventListener("click",()=>{
        views.showMenu();
      });
    },
    clickMyLearning:function(){
      let mylearning_btn = document.querySelector("#mylearning-btn");
      mylearning_btn.addEventListener("click",()=>{
        window.location.assign("/mylearning");
      });
    },
    clickNext_allCourse_list:function(){
      return new Promise((resolve,reject)=>{
        let next_btns = document.querySelectorAll(".next-arrow");
        let allCourse_university_list =["","台灣大學","清華大學","陽明交通大學"];
        for(let index=0;index<next_btns.length;index++){
          let next_btn = next_btns[index];
          let allCourse_university = allCourse_university_list[index];
          next_btn.addEventListener("click",()=>{
            models.courses.getCourses(models.courses.allCourse_category,allCourse_university).then(([result,university])=>{
              //data < 4 => 最後一頁,隱藏next btn
              if(models.courses.allCourse_datalist[index].data == null){
                next_btn.style.display = "none";
              }
              else if (models.courses.allCourse_datalist[index].data.length < 4){
                next_btn.style.display = "none";
              }

              if(models.courses.allCourse_nextPages[index] != null){
                //最後not null page 存到temp
                models.courses.allCourse_tempPages[index] = models.courses.allCourse_nextPages[index];
                // console.log("not null");
                //clear sub elem
                let allCourse_div = document.querySelectorAll(".course-content-main")[index];
                views.courses.clearCourses(allCourse_div); //清除.course-content-main 的子元素
                views.courses.renderAllCourses_list(result,university);
                //顯示previous btn
                // document.querySelector(".previous-arrow").style.display= "flex";
                let previous = document.querySelectorAll(".previous-arrow")[index];
                previous.style.display= "flex";
              }else{
                //隱藏Next button
                next_btn.style.display = "none";
                models.courses.allCourse_nextPages[index] = models.courses.allCourse_tempPages[index];
              }
            });
          });
        }
      })
    },
    clickPrevious_allCourse_list:function(){
      return new Promise((resolve,reject)=>{

        let previous_btns = document.querySelectorAll(".previous-arrow");
        let allCourse_university_list =["","台灣大學","清華大學","陽明交通大學"];
        for(let index=0;index<previous_btns.length;index++){
          let previous_btn = previous_btns[index];
          let allCourse_university = allCourse_university_list[index];
          previous_btn.addEventListener("click",()=>{

            //第一頁 隱藏previous btn
            if(models.courses.allCourse_nextPages[index]>1){
              models.courses.allCourse_nextPages[index] -= 2;
            }else{
              models.courses.allCourse_nextPages[index] = 0;
            }
            if(models.courses.allCourse_nextPages[index] == 0){
              let previous_btns = document.querySelectorAll(".previous-arrow")[index].style.display = "none";
            }

            models.courses.getCourses(models.courses.allCourse_category,allCourse_university).then(([result,university])=>{
              // console.log(models.courses.allCourse_data,models.courses.allCourse_nextPages[index]);
              if(models.courses.allCourse_nextPages[index] != null){
                //最後not null page 存到temp
                models.courses.allCourse_tempPages[index] = models.courses.allCourse_nextPages[index];
                // console.log("not null");
                //clear sub elem
                let allCourse_div = document.querySelectorAll(".course-content-main")[index];
                views.courses.clearCourses(allCourse_div); //清除.course-content-main 的子元素
                views.courses.renderAllCourses_list(result,university);
                //顯示next btn
                // document.querySelector(".next-arrow").style.display= "flex";
                let next = document.querySelectorAll(".next-arrow")[index];
                next.style.display= "flex";
              }else{
                //隱藏previous_btn
                previous_btn.style.display = "none";
                models.courses.allCourse_nextPages[index] = models.courses.allCourse_tempPages[index];
              }
            });
          });
        }
      })
    },
  },
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
        if(window.outerWidth >= 1200){
          if(keyword !=""){
            // models.courses.searchKeyword(keyword);
            window.location.assign("/search?keyword=" + keyword);
          }
          else{
            alert("關鍵字不得為空！");
          }
        }else{
          let search_box = document.querySelector("#keyword");
          if(search_box.style.display === "none"){
            search_box.style.display = "flex";
          }else{
            search_box.style.display = "none";
          }
        }
      })
    },
    chooseCategory:function(){
      let course_category = document.querySelector("#learning-category");
      course_category.addEventListener("change",()=>{
        models.courses.allCourse_category = course_category.value;
        models.courses.allCourse_nextPages[0] = 0;
        // console.log(models.learnings.allLearning_category,models.learnings.allLearning_nextPage);
        models.courses.getCourses(models.courses.allCourse_category,"").then(([result,university])=>{
          //clear sub elem
          let allCourse_div = document.querySelector("#allCourse");
          views.courses.clearCourses(allCourse_div); //清除.course-content-main 的子元素
          views.courses.renderAllCourses_list(result,university);
        })
      })
    },
    allCourse:function(){
      models.courses.getAllCourse().then(()=>{
        views.courses.renderAllCourses();
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
    updateCourse:function(index, elem){ // All台清交
      let university_list = ["","台灣大學","清華大學","陽明交通大學"];
      let update_university = university_list[index];
      models.courses.getCourses("",update_university).then(([result,university])=>{ //取得資料
        // //隱藏Loading img box
        // elem.previousElementSibling.style.display = "none";
        views.courses.renderAllCourses_list(result,university); //渲染畫面
        // views.fadein(elem);
      });
    },
    allCourse_list:function(){ // All台清交
      let keyword = decodeURIComponent(window.location.search).split("=")[1];
      models.courses.searchKeyword(keyword).then((result)=>{
        views.courses.renderAllSearch(result);
      });
    },
  },

  member: {
    checkLogin:function(){
      return new Promise((resolve, reject)=>{
        models.user.checkLogin().then(()=>{
          views.user.isLogin();
          resolve(true);
        });
      })
    },
    logout:function(){
      return new Promise((resolve, reject)=>{
        let logout_btn = document.querySelector("#logout-btn");
        logout_btn.addEventListener("click", ()=>{
          //Goole logout
          var auth2 = gapi.auth2.getAuthInstance();
          auth2.signOut().then(function () {
            console.log('User signed out.');
          });
          models.user.Logout().then(()=>{
            views.user.Logout();
            resolve(true);
          });
        });
      })
    },
    register:function(){
        let register_btn = document.querySelector(".register-btn");
        register_btn.addEventListener("click", ()=>{
          //判斷規則
          let formElement = document.querySelector("#register-form");
          let name = formElement.name.value;
          let email = formElement.email.value;
          let password = formElement.password.value;

          // regular rules
          let emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
          let emailCheck = (email.search(emailRule) == 0) ? (true):(false);
          // let nameCheck = (name.length >= 4) ? (true):(false);
          let passwordCheck = (password.length > 6) ? (true):(false);
          models.user.registerSuccess = emailCheck&&passwordCheck;
          if(!models.user.registerSuccess){
            let register_status = document.querySelector(".register-status");
            register_status.style.display = "flex";
            register_status.innerHTML = "請確認信箱格式或密碼長度小於6";
            register_status.style.color = "red";
          }else{
            models.user.Register().then(()=>{
              console.log("tstet");
              views.user.registerStatus();
            });
          }
        });
    },
    login:function(){
        let login_btn = document.querySelector(".login-btn");
        let google_login_btn = document.querySelector(".g-signin2");
        login_btn.addEventListener("click", ()=>{
          models.user.Login().then(()=>{
            console.log("login");
            views.user.loginStatus();
          });
        });
    },
    googlelogin:function(){
      let google_login_btn = document.querySelector(".g-signin2");
      google_login_btn.addEventListener("click", ()=>{
        console.log("google click");
        models.user.useGoogleLogin = true;
      });
    },

  },

  init:function(){
    views.nav();
    controllers.member.checkLogin().then(()=>{
      controllers.member.register();
      controllers.member.login();
      // controllers.member.googlelogin();
      controllers.member.logout();
      controllers.actions.clickMyLearning();
    });
    // 顯示課程：all /ntu /nthu /nytu
    controllers.courses.allCourse_list();
    views.courses.renderTitle();
    controllers.courses.searchKeyword();
    controllers.courses.searchBar();
    controllers.actions.clickMenu();
  },
};

controllers.init();
function ClickLogin(){
  models.user.useGoogleLogin=true;
};
function onSignIn(googleUser) {
  // console.log("onsigin:", models.user.useGoogleLogin);
  if(models.user.useGoogleLogin){
    // console.log(googleUser);
    // Useful data for your client-side scripts:
    var profile = googleUser.getBasicProfile();
    // console.log("ID: " + profile.getId()); // Don't send this directly to your server!
    // console.log('Full Name: ' + profile.getName());
    // console.log('Given Name: ' + profile.getGivenName());
    // console.log('Family Name: ' + profile.getFamilyName());
    // console.log("Image URL: " + profile.getImageUrl());
    // console.log("Email: " + profile.getEmail());

    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;
    // console.log("ID Token: " + id_token);
    console.log("Done!");
    models.user.GoogleLogin(id_token).then(()=>{
      window.location.assign("/");
    });
  }
};
