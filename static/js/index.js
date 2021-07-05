let models = {
  courses:{
    allCourse_nextPage:0,
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
        console.log(url);
        return fetch(url).then((response) => {
          return response.json();
        }).then((result) => {
          if(university == ""){
            models.courses.allCourse_datalist[0] = result;
          }
          else if(university == "台灣大學"){
            models.courses.allCourse_datalist[1] = result;
          }
          else if (university == "清華大學") {
            models.courses.allCourse_datalist[2] = result;
          }
          else{
            models.courses.allCourse_datalist[3] = result;
          }
          // console.log(models.courses.allCourse_data);
          console.log(result);
          resolve([result,university]);
        });
      });
    },
  },
  user:{
    loginSuccess:null,
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
        div_allCourse.appendChild(div_course_class);
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
  }
};

let controllers = {
  actions:{
    clickNext_allCourse_list:function(){
      return new Promise((resolve,reject)=>{
        let next_btns = document.querySelectorAll(".next-arrow");
        for(let index=0;index<next_btns.length;index++){
          let next_btn = next_btns[index];
          next_btn.addEventListener("click",()=>{
            console.log(models.courses.allCourse_nextPages[index]);
            models.courses.allCourse_nextPages[index]++;
            let allCourse_div = document.querySelectorAll(".course-content")[index];
            views.click.allCourse(index);
            views.courses.clearCourses(allCourse_div);
            controllers.courses.updateCourse(index,allCourse_div);
            resolve(true);
          });
        }
      })
    },
    clickPrevious_allCourse_list:function(){
      return new Promise((resolve,reject)=>{
        let next_btns = document.querySelectorAll(".previous-arrow");
        for(let index=0;index<next_btns.length;index++){
          let next_btn = next_btns[index];
          next_btn.addEventListener("click",()=>{
            models.courses.allCourse_nextPages[index]--;
            let allCourse_div = document.querySelectorAll(".course-content")[index];
            views.click.allCourse(index);
            views.courses.clearCourses(allCourse_div);
            controllers.courses.updateCourse(index,allCourse_div);
            resolve(true);
          });
        }
      })
    },
  },
  courses:{
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
      models.courses.getCourses("",update_university).then(([result,university])=>{
        views.courses.renderAllCourses_list(result,university);
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
    register:function(){
        let register_btn = document.querySelector(".register-btn");
        register_btn.addEventListener("click", ()=>{
          models.user.Register().then(()=>{
            console.log("tstet");
            views.user.registerStatus();
          });
        });
    },
    login:function(){
        let login_btn = document.querySelector(".login-btn");
        login_btn.addEventListener("click", ()=>{
          models.user.Login().then(()=>{
            console.log("login");
            views.user.loginStatus();
          });
        });
    }
  },

  init:function(){
    views.nav();
    controllers.member.checkLogin().then(()=>{
      controllers.member.register();
      controllers.member.login();
      controllers.member.logout();
    });
    // 顯示課程：all /ntu /nthu /nytu
    controllers.courses.allCourse_list();
    controllers.actions.clickNext_allCourse_list();
    controllers.actions.clickPrevious_allCourse_list();

  },
};

controllers.init();
