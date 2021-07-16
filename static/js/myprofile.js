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
        // let url = "https://search-courses-ptaras3nil34n6zdm7mfwnljhe.us-east-2.es.amazonaws.com/courses/_search?analyzer=ik_max_word&default_operator=AND&q=course_name:" + keyword;
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
    user_id:null,
    user_name:null,
    user_email:null,
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
            models.user.user_id = JSON.parse(result).data.id;
            models.user.user_name = JSON.parse(result).data.name;
            models.user.user_email = JSON.parse(result).data.email;
            // console.log(models.user.user_name);
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
          // console.log(result);
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
  update:{
    updateUsername:function(new_username){
      return new Promise((resolve, reject)=>{
        let data = {
          "user_id":models.user.user_id,
          "user_name":new_username
        };
        // console.log(email,password);
        return fetch("/api/myprofile/username",{
          method:'PATCH',
          headers: {
            "Content-type":"application/json",
          },
          body: JSON.stringify(data),
        }).then((response)=>{
          return response.json();
        }).then((result)=>{
          // result = JSON.parse(result);
          console.log(result);
          if(result.ok){
            // models.user.loginSuccess = true;
          }else{
            // models.user.loginSuccess = false;
          }
          // console.log(result);
          // console.log(models.user.loginSuccess);
          resolve(true);
        });
      });
    },
    updateUserpassword:function(now_password,new_password){
      return new Promise((resolve, reject)=>{
        // let now_password = document.querySelector(".login-email").value;
        // let new_password = document.querySelector(".login-password").value;
        let data = {
          "user_id":models.user.user_id,
          "now_password":now_password,
          "new_password":new_password
        };
        // console.log(email,password);
        return fetch("/api/myprofile/userpassword",{
          method:'PATCH',
          headers: {
            "Content-type":"application/json",
          },
          body: JSON.stringify(data),
        }).then((response)=>{
          return response.json();
        }).then((result)=>{
          // result = JSON.parse(result);
          console.log(result);
          if(result.ok){
            resolve(true);
          }else{
            reject(true);
          }
          // resolve(true);
        });
      });
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
    renderUsername:function(){
      let nav_myname = document.querySelector(".nav-myname");
      nav_myname.innerHTML = models.user.user_name;
    },
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
        let profile_btn = document.querySelector("#profile-btn");
        profile_btn.style.display = "flex";

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

        let profile_btn = document.querySelector("#profile-btn");
        profile_btn.style.display = "none";
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

        let profile_btn = document.querySelector("#profile-btn");
        profile_btn.style.display = "none";

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
  showmyProfile:function(){
    let profile_box_list = document.querySelector(".profile-box-list");
    console.log(profile_box_list.style.display);
    if(profile_box_list.style.display === "none" || profile_box_list.style.display === ""){
        profile_box_list.style.display = "block";
    }else{
      profile_box_list.style.display = "none";
    }
  },
};

let controllers = {
  actions:{
    updateUsername:function(){
      //  顯示username
      document.querySelector("#modify-name").value = models.user.user_name;
      let update_btn = document.querySelector("#main-profile-name-submit-btn");
      update_btn.addEventListener("click",()=>{
        let new_username = document.querySelector("#modify-name").value;
        if(new_username != "" || new_username != null){
          models.update.updateUsername(new_username).then(()=>{
            //顯示成功訊息
            let error_msg = document.querySelector(".edit-name-input-error");
            error_msg.innerHTML = "修改成功";
            error_msg.style.color = "blue";
            window.location.assign("/myprofile");
          })
        }else{ //null username
          //顯示錯誤訊息
          let error_msg = document.querySelector(".edit-name-input-error");
          error_msg.innerHTML = "輸入錯誤";
          error_msg.style.color = "red";
        }
      })
    },
    updateUserpassword:function(){
      let update_btn = document.querySelector("#main-profile-password-submit-btn");
      update_btn.addEventListener("click",()=>{
        let now_password = document.querySelector("#now-password").value;
        let new_password = document.querySelector("#new-password").value;
        let new_password_confirm = document.querySelector("#new-password-confirm").value;
        if(now_password != "" && new_password != "" && new_password_confirm != ""){
          //比對 new_password & new_password_confirm
          if(new_password != new_password_confirm){ //兩次密碼不相等
            //顯示錯誤訊息
            let error_msg = document.querySelector(".edit-password-input-error");
            error_msg.innerHTML = "請重新確認新密碼";
            error_msg.style.color = "red";
          }else if (new_password.length <= 6) {
            //顯示錯誤訊息
            let error_msg = document.querySelector(".edit-password-input-error");
            error_msg.innerHTML = "新密碼長度小於6位";
            error_msg.style.color = "red";
          }
          else{
            models.update.updateUserpassword(now_password,new_password).then(()=>{
              //顯示成功訊息
              let error_msg = document.querySelector(".edit-password-input-error");
              error_msg.innerHTML = "修改成功";
              error_msg.style.color = "blue";
              alert("修改成功,請重新登入!");
              models.user.Logout();
              window.location.assign("/");
            }).catch(()=>{
              //顯示錯誤訊息
              let error_msg = document.querySelector(".edit-password-input-error");
              error_msg.innerHTML = "現有密碼錯誤";
              error_msg.style.color = "red";
            });
          }
        }else{ //null username
          //顯示錯誤訊息
          let error_msg = document.querySelector(".edit-password-input-error");
          error_msg.innerHTML = "輸入錯誤";
          error_msg.style.color = "red";
        }
      })
    },
    chooseProfiles:function(){
      let edit_profile_btn = document.querySelector("#edit-profile");
      edit_profile_btn.addEventListener("click",()=>{
        //顯示profile div
        let profile_div = document.querySelector(".main-profile-content-myprofile");
        profile_div.style.display = "block";
        let title_1 = document.querySelector(".main-profile-content-title-1");
        title_1.innerHTML = "個人檔案";
        let title_2 = document.querySelector(".main-profile-content-title-2");
        title_2.innerHTML = "修改資訊";
        //隱藏account div
        let account_div = document.querySelector(".main-profile-content-myaccount");
        account_div.style.display = "none";
      });

      let edit_account_btn = document.querySelector("#edit-account");
      edit_account_btn.addEventListener("click",()=>{
        //隱藏profile div
        let profile_div = document.querySelector(".main-profile-content-myprofile");
        profile_div.style.display = "none";
        //顯示account div
        let account_div = document.querySelector(".main-profile-content-myaccount");
        account_div.style.display = "block";
        let title_1 = document.querySelector(".main-profile-content-title-1");
        title_1.innerHTML = "帳戶";
        let title_2 = document.querySelector(".main-profile-content-title-2");
        title_2.innerHTML = "帳戶及更改密碼" +"<br>"+"(Google登入，無法更改密碼)";

        let email = document.querySelector(".main-profile-content-myaccount-email-display");
        email.innerHTML = models.user.user_email;
      });
    },
    clickmyProfile:function(){
      let myprofile_btn = document.querySelector("#my-profile");
      myprofile_btn.addEventListener("click",()=>{
        window.location.assign("/myprofile");
      })
    },
    clickProfile:function(){
      let profile_btn = document.querySelector("#profile-btn");
      profile_btn.addEventListener("click",()=>{
        views.showmyProfile();
      })
    },
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
      models.courses.getCourses("","").then(([result,university])=>{
        views.courses.renderAllCourses_list(result,university);
      });
      models.courses.getCourses("","台灣大學").then(([result,university])=>{
        views.courses.renderAllCourses_list(result,university);
      });
      models.courses.getCourses("","清華大學").then(([result,university])=>{
        views.courses.renderAllCourses_list(result,university);
      });
      models.courses.getCourses("","陽明交通大學").then(([result,university])=>{
        views.courses.renderAllCourses_list(result,university);
      });
    },
  },

  member: {
    checkLogin:function(){
      return new Promise((resolve, reject)=>{
        models.user.checkLogin().then(()=>{
          if(models.user.isLogin){
            views.user.isLogin();
            resolve(true);
          }else{
            window.location.assign("/");
            resolve(true);
          }
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
      views.click.renderUsername();
      controllers.actions.updateUsername();
      controllers.actions.updateUserpassword();
    });
    // 顯示課程：all /ntu /nthu /nytu
    // controllers.courses.allCourse_list();
    // controllers.actions.clickNext_allCourse_list();
    // controllers.actions.clickPrevious_allCourse_list();
    // controllers.courses.chooseCategory();
    controllers.courses.searchKeyword();
    controllers.courses.searchBar();
    controllers.actions.clickMenu();
    controllers.actions.clickProfile();
    controllers.actions.clickmyProfile();
    controllers.actions.chooseProfiles();
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
