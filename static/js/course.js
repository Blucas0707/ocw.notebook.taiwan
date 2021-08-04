let models = {
  lecture_id:null,
  course_id:location.pathname.split("course/")[1],
  user_id:null,
  notes:{
    deleteNote:function(note_id){
      return new Promise((resolve, reject)=>{
        // let course_id = models.course_id;
        // console.log("/api/note/"+ models.course_id+ "/"+ models.lecture_id);
        return fetch("/api/note/"+ note_id,{
          method:'delete',
          headers: {
            "Content-type":"application/json",
          },
        }).then((response)=>{
          return response.json();
        }).then((result)=>{
          // console.log("delete:" + result);
          // console.log(typeof(result));
          // console.log(models.user.loginSuccess);
          resolve(result);
        });
      });
    },
    getNotes:function(){
      return new Promise((resolve, reject)=>{
        // let course_id = models.course_id;
        // console.log("/api/note/"+ models.course_id+ "/"+ models.lecture_id);
        return fetch("/api/note/"+ models.course_id+ "/"+ models.lecture_id,{
          method:'GET',
          headers: {
            "Content-type":"application/json",
          },
        }).then((response)=>{
          return response.json();
        }).then((result)=>{
          // console.log(result);
          // console.log(typeof(result));
          // console.log(models.user.loginSuccess);
          resolve(result);
        });
      });
    },
    postNotes:function(note,note_record_time,note_video_current){
      let course_id = models.course_id;
      let lecture_id = models.lecture_id;
      let user_id = models.user_id;
      // console.log(course_id,lecture_id,user_id);
      return new Promise((resolve, reject)=>{
        let note = document.querySelector("#note-input-content").value;
        let data = {
            "course_id":course_id.toString(),
            "lecture_id":lecture_id.toString(),
            "user_id":user_id.toString(),
            "note":note,
            "note_video_current":note_video_current,
            "note_record_time":note_record_time
          };
        console.log(data);
        return fetch("/api/note",{
          method:"POST",
          headers: {
            "Content-type":"application/json",
          },
          body: JSON.stringify(data)
        }).then((response)=>{
          return response.json();
        }).then((result)=>{
          // console.log(result);
          resolve(result);
        });
      })
    },
  },
  lectures:{
    allLecture_status:{
      "user_id":"",
      "course_id":"",
      "lectures":[]
    },
    isgetallLecture_status:false,
    allLecture_data:null,
    updateLecture_status:function(){
      return new Promise((resolve, reject)=>{
        return fetch("/api/learning",{
          method:'PATCH',
          headers: {
            "Content-type":"application/json",
          },
          body: JSON.stringify(models.lectures.allLecture_status),
        }).then((response)=>{
          return response.json();
        }).then((result)=>{
          // console.log("update done");
          result = JSON.parse(result);
          // console.log(result);
          if(result.ok){
            models.user.loginSuccess = true;
            models.user.isLogin = true;
          }else{
            models.user.loginSuccess = false;
          }
          // console.log("update done");
          resolve(true);
        });
      });
    },
    oneLecture_status:null,
    getOneLecture_status:function(){
      return new Promise((resolve, reject)=>{
        return fetch("/api/learning/"+ models.course_id+ "/"+ models.lecture_id,{
          method:'GET',
          headers: {
            "Content-type":"application/json",
          },
        }).then((response)=>{
          return response.json();
        }).then((result)=>{
          // console.log(result);
          models.lectures.oneLecture_status = result;
          // console.log(typeof(result));
          // console.log(models.user.loginSuccess);
          resolve(result);
        });
      });
    },
    getAllLecture_status:function(){
      return new Promise((resolve, reject)=>{
        return fetch("/api/learnings/"+ models.course_id,{
          method:'GET',
          headers: {
            "Content-type":"application/json",
          },
        }).then((response)=>{
          return response.json();
        }).then((result)=>{
          // console.log(result);
          // console.log("js result:" + JSON.stringify(result));
          if(result.error){
            models.lectures.isgetallLecture_status = false;
          }else{
            models.lectures.isgetallLecture_status = true;
            models.lectures.allLecture_status = result;
          }
          // models.lectures.oneLecture_status = result;
          // console.log(typeof(result));
          // console.log(models.user.loginSuccess);
          resolve(result);
        });
      });
    },
    getAllLectures:function(){
      return new Promise((resolve, reject)=>{
        let course_id = location.pathname.split("course/")[1];
        return fetch("/api/course/" + course_id,{
          method:'GET',
          headers: {
            "Content-type":"application/json",
          },
        }).then((response)=>{
          return response.json();
        }).then((result)=>{
          models.lectures.allLecture_status.course_id = course_id;
          models.lectures.allLecture_data = result;
          resolve(result);
        });
      });
    },
  },
  user:{
    isGoogleLogin:null,
    loginSuccess:null,
    useGoogleLogin:false,
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
          // result = JSON.parse(result);
          // console.log(result);
          if(result.ok){
            models.user.loginSuccess = true;
            models.user.isLogin = true;
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
    user_name:null,
    checkLogin:function(){
      return new Promise((resolve, reject)=>{
        return fetch("/api/user",{
          method:"GET"
        }).then((response)=>{
          return response.json();
        }).then((result)=>{
          // console.log(result);
          // console.log(JSON.parse(result).data.id);
          if(result != null){
            models.user.isLogin = true;
            models.lectures.allLecture_status.user_id = JSON.parse(result).data.id;
            models.user_id = JSON.parse(result).data.id;
            models.user.user_name = JSON.parse(result).data.name;
            // console.log(models.user.user_name);
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
  courses:{
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
};

let views = {
  click:{
    renderUsername:function(){
      let nav_myname = document.querySelector(".nav-myname");
      nav_myname.innerHTML = models.user.user_name;
    },
  },
  courses:{
    clearCourses:function(elem){
      while(elem.hasChildNodes()){ //elem child存在
        elem.removeChild(elem.firstChild); //刪除子節點
      };
    },
  },
  notes:{
    renderNotesCount:function(notecount){
      let alert = document.querySelector("#note-alert");
      alert.innerHTML = "(" + (1000 - notecount) + "/1000)";
      if(1000 - notecount < 0 ){
        alert.style.color = "red";
      }else{
        alert.style.color = "black";
      }
    },
    renderNotes:function(result){
      //取得 note-show-all
      let div_note_show_all = document.querySelector(".note-show-all");
      //清除包含內容
      while(div_note_show_all.hasChildNodes()){
        div_note_show_all.removeChild(div_note_show_all.firstChild);
      }
      if(result.data.length){
        for(let index=0;index<result.data.length;index++){
          //新增div note-show-list under note-show-all
          let div_note_show_list = document.createElement("div");
          div_note_show_list.className = "note-show-list";

          //新增div note-time-box
          let div_note_time_box = document.createElement("div");
          div_note_time_box.className = "note-time-box";

          //新增div note-time under note-time-box
          let div_note_time = document.createElement("div");
          div_note_time.className = "note-time";
          div_note_time.innerHTML = result.data[index].note_time;

          //新增div note-time-current under note-time-box
          let div_note_time_current = document.createElement("div");
          div_note_time_current.className = "note-time-current";
          div_note_time_current.innerHTML = result.data[index].note_current;
          // console.log(div_note_time_current.innerHTML);

          //新增div note-delete under note-time-box
          let div_note_delete = document.createElement("div");
          div_note_delete.className = "note-delete";
          div_note_delete.id = result.data[index].note_id;
          //新增img note-delete under div note-delete
          let img_note_delete = document.createElement("img");
          img_note_delete.src = "/img/trash.svg";
          div_note_delete.appendChild(img_note_delete);

          div_note_time_box.appendChild(div_note_time);
          div_note_time_box.appendChild(div_note_time_current);
          div_note_time_box.appendChild(div_note_delete);

          // console.log(result.data[index].note_time);
          //新增div note-content under note-show-list
          let div_note_content = document.createElement("div");
          div_note_content.className = "note-content";
          div_note_content.innerHTML = "";
          let lines = result.data[index].note.split("\n");
          for(let line_index=0;line_index<lines.length;line_index++){
            let line = "<p>" + lines[line_index] + "</p>";
            div_note_content.innerHTML += line;
          }
          // console.log(result.data[index].note);
          div_note_show_list.appendChild(div_note_time_box);
          div_note_show_list.appendChild(div_note_content);
          div_note_show_all.appendChild(div_note_show_list);
        }
      }
    },
    renderupdateNote:function(result){
      // console.log("result:" + result);
      //取得 note-show-all
      let div_note_show_all = document.querySelector(".note-show-all");
      //新增div note-show-list under note-show-all
      let div_note_show_list = document.createElement("div");
      div_note_show_list.className = "note-show-list";

      //新增div note-time-box
      let div_note_time_box = document.createElement("div");
      div_note_time_box.className = "note-time-box";

      //新增div note-time under note-show-list
      let div_note_time = document.createElement("div");
      div_note_time.className = "note-time";
      div_note_time.innerHTML = result.data[0].note_time;

      //新增div note-time-current under note-time-box
      let div_note_time_current = document.createElement("div");
      div_note_time_current.className = "note-time-current";
      div_note_time_current.innerHTML = result.data[0].note_current;

      //新增div note-delete under note-time-box
      let div_note_delete = document.createElement("div");
      div_note_delete.className = "note-delete";
      div_note_delete.id = result.data[0].note_id;
      //新增img note-delete under div note-delete
      let img_note_delete = document.createElement("img");
      img_note_delete.src = "/img/trash.svg";
      div_note_delete.appendChild(img_note_delete);

      div_note_time_box.appendChild(div_note_time);
      div_note_time_box.appendChild(div_note_time_current);
      div_note_time_box.appendChild(div_note_delete);

      // console.log(result.data[index].note_time);
      //新增div note-content under note-show-list
      let div_note_content = document.createElement("div");
      div_note_content.className = "note-content";
      let lines = result.data[0].note.split("\n");
      div_note_content.innerHTML = "";
      for(let line_index=0;line_index<lines.length;line_index++){
        let line = "<p>" + lines[line_index] + "</p>";
        div_note_content.innerHTML += line;
      }

      div_note_show_list.appendChild(div_note_time_box);
      div_note_show_list.appendChild(div_note_content);
      div_note_show_all.insertBefore(div_note_show_list,div_note_show_all.childNodes[0]);
    }

  },
  lectures:{
    renderAllLectures:function(result){
      return new Promise((resolve,reject)=>{
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

          if(models.lectures.isgetallLecture_status == false){
            //新增到model data
            let data = {
              "lecture_id":lecture_id,
              "lecture_video_current":0,
              "lecture_status":0,
            };
            models.lectures.allLecture_status.lectures.push(data);
          }
        };
        // console.log("renderList: "+models.lectures.allLecture_status);
        //點擊課堂
        controllers.click.chooseLecture();
        resolve(true);
      })
    },
    renderLectureComplete:function(){//顯示是否完成
      let li_lectures = document.querySelectorAll("li");
      for(let index=0;index<li_lectures.length;index++){
        //該堂狀態更新 0:未完成 1:完成
        if(models.lectures.allLecture_status.lectures[index].lecture_status == 1){
          //隱藏空格 ＆顯示完成格 ＆反藍
          li_lectures[index].style.backgroundColor = "#e5fff3";
          let blank_checkbox = li_lectures[index].firstChild.firstChild;
          let checkbox = li_lectures[index].firstChild.firstChild.nextSibling;
          blank_checkbox.style.display = "none";
          checkbox.style.display = "flex";
        }
      }
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
      if(models.user.loginSuccess){ // login success
        login_status.innerHTML = "登入成功";
        login_status.style.color = "blue";

        //清除登入資訊
        document.querySelector(".login-email").value = "";
        document.querySelector(".login-password").value = "";
        // 重新導向 "/"
        window.location.reload();
        // views.user.isLogin();
        // //隱藏login_status
        // login_status.style.display = "none";

      }else{ // register fail
        login_status.innerHTML = "登入失敗，帳號或密碼錯誤";
        login_status.style.color = "red";
      }
    },
    isLogin:function(){
      // console.log(models.user.isLogin);
      //判斷已經登入
      if(models.user.isLogin){

        //已登入 隱藏隱藏層 ＆ 登入窗
        let hide = document.querySelector(".hideall");
        hide.style.display = "none";
        let login_box = document.querySelector(".login-box");
        login_box.style.display = "none";

        //已登入 顯示學習紀錄&登出 隱藏登入＆註冊

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
        //顯示Note box & 隱藏note-not-login box
        document.querySelector(".note-list").style.display = "block";
        document.querySelector(".note-not-login").style.display = "none";
      }else{
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
        //隱藏Note box & 顯示note-not-login box
        document.querySelector(".note-list").style.display = "none";
        document.querySelector(".note-not-login").style.display = "flex";
      }
    },
    Logout:function(){
      //判斷已經登出
      if(models.user.isLogin == null){
        //未登入 顯示登入＆註冊
        let login_btn = document.querySelector("#login-btn");
        let register_btn = document.querySelector("#register-btn");
        login_btn.style.display = "flex";
        register_btn.style.display = "flex";
        //顯示Note box & 隱藏note-not-login box
        document.querySelector(".note-list").style.display = "block";
        document.querySelector(".note-not-login").style.display = "none";
        //已登入 隱藏學習紀錄 & 登出
        let mylearning_btn = document.querySelector("#mylearning-btn");
        let logout_btn = document.querySelector("#logout-btn");
        mylearning_btn.style.display = "none";
        logout_btn.style.display = "none";
        let profile_btn = document.querySelector("#profile-btn");
        profile_btn.style.display = "none";
        //隱藏Note box & 顯示note-not-login box
        document.querySelector(".note-list").style.display = "none";
        document.querySelector(".note-not-login").style.display = "flex";

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
  videoTimer:function(){
    let video_ratio = document.querySelector(".completed-ratio");
    let video = document.querySelector("video");
    // console.log(video.duration);
    // video change
    video.addEventListener("timeupdate",()=>{
      let video_Length = video.duration;
      let video_playLength = video.currentTime;
      let playRatio = (video_playLength/video_Length *100).toFixed(2);
      video_ratio.innerHTML = playRatio + "%";

      let note_video_current = document.querySelector("#note-video-current");
      let hour,min,sec;

      hour = (parseInt(video_playLength / 3600)).toString().padStart(2,"0");
      min = (parseInt((video_playLength - hour*3600) / 60)).toString().padStart(2,"0");
      sec = parseInt((video_playLength - min*60 - hour*3600)).toString().padStart(2,"0");
      // console.log(video_playLength,hour,min,sec);
      note_video_current.innerHTML = "at "+hour+":"+min+":"+sec;

    });
  },
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
        // views.isFadeout = true;
        resolve(true);
      }
    },10);
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
        window.location.assign(window.location.href.substr(0,window.location.href.length-6)+div_search_box.id);
      })
    }
    search_list.style.display = "block";
  },
  showmyProfile:function(){
    let profile_box_list = document.querySelector(".profile-box-list");
    if(profile_box_list.style.display === "none" || profile_box_list.style.display === ""){
        profile_box_list.style.display = "block";
    }else{
      profile_box_list.style.display = "none";
    }
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
          if(search_box.style.display === "none" || search_box.style.display === ""){
            search_box.style.display = "flex";
          }else{
            search_box.style.display = "none";
          }
        }
      })
    },
  },
  click:{
    clickNoteDelete:function(){
      let note_delete_list = document.querySelectorAll(".note-delete");
      for(let index=0;index<note_delete_list.length;index++){
        let note_delete = note_delete_list[index];
        note_delete.addEventListener("click",()=>{
          let note_id = note_delete.id;
          console.log(note_id);
          models.notes.deleteNote(note_id);
          //移除 note-show-list
          note_delete.parentElement.parentElement.remove();
        })
      }
    },
    clickNoteCurrent:function(){
      let note_current_list = document.querySelectorAll(".note-time-current");
      for(let index=0;index<note_current_list.length;index++){
        let note_current = note_current_list[index];
        note_current.addEventListener("click",()=>{
          let video_currents = note_current.innerHTML.split(":");
          let hour = parseInt(video_currents[0])*3600;
          let min = parseInt(video_currents[1])*60;
          let sec = parseInt(video_currents[2]);
          let video_current = hour + min + sec;

          // console.log(hour,min,sec,video_current);
          //設定影片時間

          let video = document.querySelector(".lecture-video");
          video.currentTime = video_current;
        })
      }
    },
    chooseLecture:function(){
      let result = models.lectures.allLecture_data;
      //取得所有li elems
      let li_elems = document.querySelectorAll("li");
      for(let index=0;index<li_elems.length;index++){
        let elem = li_elems[index];
        elem.addEventListener("click",()=>{
          // 清空video src for reset
          document.querySelector(".lecture-video").src ="";
          //取得lecture_id
          models.lecture_id = elem.id.split("-")[1];
          //顯示Note
          controllers.notes.getNotes();
          //清空note box
          let notebox = document.querySelector("#note-input-content");
          notebox.value = "";
          //更改影片網址
          let lecture_video = document.querySelector(".lecture-video");
          lecture_video.id = "video-" + models.lecture_id.toString();
          lecture_video.src = result.data[index].lecture_video;
          if(models.lectures.allLecture_status.lectures[index] != undefined){ //SQL中有data
            let video_current_time = models.lectures.allLecture_status.lectures[index].lecture_video_current;
            //For Chrome & iphone
            lecture_video.addEventListener("loadeddata",function setVideotime(){
              lecture_video.addEventListener("canplay",function setVideo_foriOS(){
                lecture_video.pause();
                lecture_video.currentTime = video_current_time;
                lecture_video.play();
                lecture_video.removeEventListener("canplay",setVideo_foriOS);
              })
              lecture_video.removeEventListener("loadeddata",setVideotime);
            })
          }

          lecture_video.addEventListener("loadeddata",()=>{ //video loaded
            //確認該堂影片是否觀看完成 > 85 %
            controllers.lectures.checkStatus();
          })

          //更改下載相關
          let note_download = document.querySelector(".note-download");
          let reference_download = document.querySelector(".reference-download");
          let video_download = document.querySelector(".video-download");
          let download_elems = [note_download,reference_download,video_download];
          let download_elems_names = ["講義下載", "參考資料下載", "影音下載"];
          let download_elems_links = [result.data[index].lecture_note, result.data[index].lecture_reference, result.data[index].lecture_video];
          for(let download_index=0;download_index<download_elems.length;download_index++){
            //if link = "", 隱藏元素, else, 附加連結
            if(download_elems_links[download_index] == ""){
              download_elems[download_index].style.display = "none";
            }else{
              download_elems[download_index].style.display = "flex";
              download_elems[download_index].innerHTML = "";
              let link = document.createElement("a");
              link.href = download_elems_links[download_index];
              link.download = "";
              link.innerHTML = download_elems_names[download_index];
              download_elems[download_index].appendChild(link);
            }
          }
        });
      }
    },
    cancelNote:function(){
      let cancel_btn = document.querySelector("#note-cancel-btn");
      cancel_btn.addEventListener("click",()=>{
        let notebox = document.querySelector("#note-input-content");
        notebox.value = "";
        //字數顯示
        views.notes.renderNotesCount(0);
      });
    },
    postNotes:function(){
      return new Promise((resolve, reject)=>{
        let save_btn = document.querySelector("#note-save-btn");
        save_btn.addEventListener("click",()=>{
          let note = document.querySelector("#note-input-content").value;
          // console.log(note);
          if(note.toString().length != 0 && note.toString().length <= 1000){
            //字數顯示
            views.notes.renderNotesCount(0);
            let time_now = new Date();
            let note_record_time = time_now.getFullYear()+"/"+(time_now.getMonth()+1).toString().padStart(2,"0")+"/"+(time_now.getDate()).toString().padStart(2,"0")+ " "+(time_now.getHours()).toString().padStart(2,"0")+":"+(time_now.getMinutes()).toString().padStart(2,"0")+":"+(time_now.getSeconds()).toString().padStart(2,"0");
            let note_video_current = document.querySelector("#note-video-current").innerHTML.substr(3);
            // console.log(note_video_current);
            models.notes.postNotes(note,note_record_time,note_video_current).then((result)=>{
              // console.log(result);
              // console.log("models back:" + JSON.stringify(result));
              document.querySelector("#note-input-content").value = "";
              views.notes.renderupdateNote(result);
              controllers.click.clickNoteCurrent();
              controllers.click.clickNoteDelete();
              resolve(result);
            })
          }
        });
      })
    }
  },
  notes:{
    noteIsOverload:false,
    notesAlert:function(){
      let notes = document.querySelector("#note-input-content");
      notes.addEventListener("input",()=>{
        let notes_count = notes.value.length;
        if(notes_count >= 1000){
          controllers.notes.noteIsOverload = true;
        }
        views.notes.renderNotesCount(notes_count);
      });
    },
    getNotes:function(){
      return new Promise((resolve, reject)=>{
        models.notes.getNotes().then((result)=>{
          views.notes.renderNotes(result);
          // console.log(result);
          controllers.click.clickNoteCurrent();
          controllers.click.clickNoteDelete();
        });
      })
    }
  },
  lectures:{
    listLectures:function(){ //列出所有課程到list
      models.lectures.getAllLectures().then((result)=>{
        views.lectures.renderAllLectures(result).then(()=>{
          models.lectures.getAllLecture_status().then(()=>{
            views.lectures.renderLectureComplete();
          })
        });

        //取得課堂資訊
        // models.lectures.getAllLecture_status()
        // views.lectures.renderAllLectures(result);
        // controllers.lectures.countCourseLength(result);
      });
    },
    checkStatus:function(){ //確認該堂影片是否觀看完成 > 85 %
      let video = document.querySelector("#video-"+models.lecture_id);
      video.addEventListener("timeupdate",()=>{
        let video_ration = video.currentTime / video.duration * 100;
        let lecture_status_elem = document.querySelector("#lecture-status-"+models.lecture_id);
        let blank_checkbox = lecture_status_elem.firstChild;
        let checkbox = lecture_status_elem.firstChild.nextElementSibling;
        //存現在時間到model allLecture_data裡面
        let index = parseInt(models.lecture_id.substr(6,9)) - 1;
        models.lectures.allLecture_status.lectures[index].lecture_video_current = video.currentTime;
        // video_current.innerHTML = video.currentTime;
        // console.log(models.lectures.allLecture_status);
        if(video_ration > 85){
          //該堂狀態更新 0:未完成 1:完成
          models.lectures.allLecture_status.lectures[index].lecture_status = 1;
          //隱藏空格 ＆顯示完成格 ＆反藍
          blank_checkbox.style.display = "none";
          checkbox.style.display = "flex";
          lecture_status_elem.parentElement.style.backgroundColor = "#e5fff3";
        }
      });
    },
  },
  actions:{
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
  member: {
    checkLogin:function(){
      return new Promise((resolve, reject)=>{
        models.user.checkLogin().then(()=>{
          // models.lectures.getAllLecture_status();
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
            // console.log('User signed out.');
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
          models.user.Register().then(()=>{
            // console.log("tstet");
            views.user.registerStatus();
          });
        });
    },
    login:function(){
        let login_btn = document.querySelector(".login-btn");
        login_btn.addEventListener("click", ()=>{
          models.user.Login().then(()=>{
            // console.log("login");
            views.user.loginStatus();
          });
        });
    },
    googlelogin:function(){
      let google_login_btn = document.querySelector(".g-signin2");
      google_login_btn.addEventListener("click", ()=>{
        // console.log("google click");
        models.user.useGoogleLogin = true;
      });
    },
  },
  leavePage:function(){
    window.onbeforeunload = function(){
      // return '您確定要離開嗎?';

      if(models.user.isLogin && models.lectures.allLecture_status.user_id != ""){
        // console.log(models.user.isLogin);
        // console.log("update Lecture status");
        models.lectures.updateLecture_status();

      }
    };
    //For ios
    window.onpagehide = function(){
      // return '您確定要離開嗎?';

      if(models.user.isLogin && models.lectures.allLecture_status.user_id != ""){
        // console.log(models.user.isLogin);
        // console.log("update Lecture status");
        models.lectures.updateLecture_status();

      }
    };
  },
  handpose:function(){
    const videoElement = document.querySelector('.input_video');
    const canvasElement = document.querySelector('.output_canvas');
    const canvasCtx = canvasElement.getContext('2d');
    let last_handmarks = [];
    function onResults(results) {
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      canvasCtx.drawImage(
          results.image, 0, 0, canvasElement.width, canvasElement.height);
      if (results.multiHandLandmarks) {
        detectDirection(last_handmarks,results.multiHandLandmarks[0]);
        last_handmarks = results.multiHandLandmarks[0];
        for (const landmarks of results.multiHandLandmarks) {
          drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,
                         {color: '#00FF00', lineWidth: 5});
          drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 2});
        }
      }
      canvasCtx.restore();
    }

    const hands = new Hands({locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }});
    hands.setOptions({
      maxNumHands: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.6
    });
    hands.onResults(onResults);

    const camera = new Camera(videoElement, {
      onFrame: async () => {
        await hands.send({image: videoElement});
      },
      width: 150,
      height: 150
    });
    let hand_direction_btn = document.querySelector(".hand_direction_btn");
    hand_direction_btn.addEventListener("click",()=>{
      camera.start();
      //隱藏hand_direction
      document.querySelector(".hand_direction").style.display = "none";
      //顯示說明
      document.querySelector(".hand_direction_description").style.display = "block";
    });
    // camera.start();

    //偵測手勢左右
    function detectDirection(last_handmarks,now_handmarks){
      let play_video = document.querySelector(".lecture-video");
      if(last_handmarks.length === 0 || now_handmarks.length === 0){
        return ;
      }
      //hand position : https://google.github.io/mediapipe/solutions/hands
      // x(左到右):1=>0 , y(上到下):0=>1
      //握拳停止
      //MCP
      let last_MCP_y_avg = (last_handmarks[5].y + last_handmarks[9].y + last_handmarks[13].y + last_handmarks[17].y) / 4;
      let now_MCP_y_avg = (now_handmarks[5].y + now_handmarks[9].y + now_handmarks[13].y + now_handmarks[17].y) / 4;
      let last_MCP_x_avg = (last_handmarks[5].x + last_handmarks[9].x + last_handmarks[13].x + last_handmarks[17].x) / 4;
      let now_MCP_x_avg = (now_handmarks[5].x + now_handmarks[9].x + now_handmarks[13].x + now_handmarks[17].x) / 4;
      //TIP
      let last_TIP_y_avg = (last_handmarks[8].y + last_handmarks[12].y + last_handmarks[16].y + last_handmarks[20].y) / 4;
      let now_TIP_y_avg = (now_handmarks[8].y + now_handmarks[12].y + now_handmarks[16].y + now_handmarks[20].y) / 4;
      let last_TIP_x_avg = (last_handmarks[8].x + last_handmarks[12].x + last_handmarks[16].x + last_handmarks[20].x) / 4;
      let now_TIP_x_avg = (now_handmarks[8].x + now_handmarks[12].x + now_handmarks[16].x + now_handmarks[20].x) / 4;
      //  手勢條件
      if ((now_TIP_x_avg - last_TIP_x_avg) > 0.15) { //向左揮動
        let direction = document.querySelector(".hand-direction");
        direction.innerHTML = "左";
        play_video.currentTime = play_video.currentTime - 10; //+ 10 secs
      }else if ((now_TIP_x_avg - last_TIP_x_avg) < -0.13) { //向右揮動
        let direction = document.querySelector(".hand-direction");
        direction.innerHTML = "右";
        play_video.currentTime = play_video.currentTime + 10; //- 10 secs
      }

      //影片暫停or播放 => 握拳/鬆手
      if(play_video.paused){ //暫停
        if (now_TIP_y_avg < last_TIP_y_avg && now_TIP_y_avg<now_MCP_y_avg) { //鬆開
          let direction = document.querySelector(".hand-direction");
          direction.innerHTML = "繼續播放";
          play_video.play();
        }
      }else{
        if(now_TIP_y_avg > last_TIP_y_avg && now_TIP_y_avg>now_MCP_y_avg && (now_TIP_x_avg - now_MCP_x_avg < 0.1)){ //握拳停止
          let direction = document.querySelector(".hand-direction");
          direction.innerHTML = "暫停";
          play_video.pause();
        }
      }
    }
  },
  cameraIson:function(){
    var constraints = window.constraints = {
      audio: false,
      video: true
    };
    navigator.mediaDevices.getUserMedia(constraints).then((result)=>{
    // console.log(result.active);
      if(result.active){
        document.querySelector(".hand-direction").innerHTML = "已開啟攝影機";
        document.querySelector(".hand-direction").style.color = "blue";
      }
    }).catch((error)=>{
    // console.log(error);
    document.querySelector(".hand-direction").innerHTML = "未開啟攝影機";
    document.querySelector(".hand-direction").style.color = "red";
    });
  },
  handpose2:function(){
    let play_video = document.querySelector(".lecture-video");
    const ctx = document.querySelector("#cvs").getContext("2d");
    const video = document.createElement("video");
    video.className = "input_video";
    // 建立初始化程序 1.載入模型 2.建立視訊
    let model = null;
    async function init(){
      model = await handpose.load();
    }
    init();
    let last_handmarks = [];
    let intervalId = null;
    //開啟/關閉攝像頭
    let cameraisOn = false;
    function cameraOn(){
      const camera_btn = document.querySelector(".hand_direction_btn");
      camera_btn.addEventListener("click",()=>{
        if(cameraisOn === false){ // 開啟Camera
          navigator.mediaDevices.getUserMedia({audio:false,video:true}).then((stream)=>{
            video.srcObject = stream;
            video.play();
            cameraisOn = true;
            camera_btn.innerHTML = "關閉手勢偵測";
            document.querySelector("#cvs").style.display = "block";
            video.addEventListener("loadeddata",ontime_refresh);
            //顯示說明
            document.querySelector(".hand_direction_description").style.display = "block";
          })
        }else{ // 關掉Camera
          const stream = video.srcObject;
          const tracks = stream.getTracks();
          tracks.forEach(function(track) {
            track.stop();
          });
          video.srcObject = null;
          cameraisOn = false;
          camera_btn.innerHTML = "開啟手勢偵測";
          document.querySelector("#cvs").style.display = "none";
          window.clearInterval(intervalId);
          //隱藏hand_direction
          document.querySelector(".hand_direction_description").style.display = "none";
          //影片黑屏
          ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
        }
      })
    }
    cameraOn();
    function ontime_refresh(){
      intervalId = window.setInterval(refresh,10); //每0.01秒執行refresh
    }
    // video.removeEventListener("loadeddata",ontime_refresh);
    async function refresh() {
      //利用模型對圖片/影片等物件做手勢辨識
      const predictions = await model.estimateHands(video);
      //設定畫布尺寸
      ctx.canvas.width = video.videoWidth;
      ctx.canvas.height = video.videoHeight;
      if (predictions.length > 0) {
        //取出每隻手的keypoints[]
        for(let i = 0; i < predictions.length; i++){
          const keypoints = predictions[i].landmarks;
          let now_handmarks = keypoints;
          detectDirection(last_handmarks,now_handmarks);
          last_handmarks = now_handmarks;
          // 該手的keypoints
          // for(let i = 0; i < keypoints.length; i++){
          //   const [x, y, z] = keypoints[i];
          //   console.log(`Keypoint ${i}: [${x}, ${y}, ${z}]`);
          //   顯示數字
          //   ctx.fillStyle = "rgb(200,0,0)";
          //   ctx.font = "16pt Arial";
          //   ctx.fillText(i,x+10,y+10);
          //   ctx.fillRect(x-5,y-5,10,10);
          // }
          //連接keypoints線條
          drawLine(keypoints);
        }
      }
      //補上影片背景
      ctx.save();
      ctx.globalCompositeOperation = "destination-atop"; //圖片組合規則
      ctx.drawImage(video,0,0);
      ctx.restore();
    }

    function drawLine(keypoints){
      // 畫出節點
      for(let i = 0; i < keypoints.length; i++){
        const [x, y, z] = keypoints[i];
        // console.log(`Keypoint ${i}: [${x}, ${y}, ${z}]`);
        //畫出節點＆數字
        ctx.fillStyle = "rgb(200,0,0)";
        ctx.fillRect(x-5,y-5,10,10);
      }

      //draw 0=>1,5,9,13,17
      let draw_lists = [keypoints[0],keypoints[1],keypoints[5],keypoints[9],keypoints[13],keypoints[17]];
      for(let i = 1; i < draw_lists.length; i++){
        ctx.beginPath();
        ctx.lineWidth = "3";
        ctx.strokeStyle = "green";
        ctx.stroke();
        ctx.moveTo(draw_lists[0][0],draw_lists[0][1]);
        ctx.lineTo(draw_lists[i][0],draw_lists[i][1]);
        ctx.stroke();
        ctx.closePath();
      }
      //draw 1,2,3,4
      for(let i = 1; i < 4; i++){
        ctx.beginPath();
        ctx.lineWidth = "3";
        ctx.strokeStyle = "green";
        ctx.stroke();
        ctx.moveTo(keypoints[i][0],keypoints[i][1]);
        ctx.lineTo(keypoints[i+1][0],keypoints[i+1][1]);
        ctx.stroke();
        ctx.closePath();
      }
      //draw 5,6,7,8
      for(let i = 5; i < 8; i++){
        ctx.beginPath();
        ctx.lineWidth = "3";
        ctx.strokeStyle = "green";
        ctx.stroke();
        ctx.moveTo(keypoints[i][0],keypoints[i][1]);
        ctx.lineTo(keypoints[i+1][0],keypoints[i+1][1]);
        ctx.stroke();
        ctx.closePath();
      }
      //draw 9,10,11,12
      for(let i = 9; i < 12; i++){
        ctx.beginPath();
        ctx.lineWidth = "3";
        ctx.strokeStyle = "green";
        ctx.stroke();
        ctx.moveTo(keypoints[i][0],keypoints[i][1]);
        ctx.lineTo(keypoints[i+1][0],keypoints[i+1][1]);
        ctx.stroke();
        ctx.closePath();
      }
      //draw 13,14,15,16
      for(let i = 13; i < 16; i++){
        ctx.beginPath();
        ctx.lineWidth = "3";
        ctx.strokeStyle = "green";
        ctx.stroke();
        ctx.moveTo(keypoints[i][0],keypoints[i][1]);
        ctx.lineTo(keypoints[i+1][0],keypoints[i+1][1]);
        ctx.stroke();
        ctx.closePath();
      }
      //draw 17,18,19,20
      for(let i = 17; i < 20; i++){
        ctx.beginPath();
        ctx.lineWidth = "3";
        ctx.strokeStyle = "green";
        ctx.stroke();
        ctx.moveTo(keypoints[i][0],keypoints[i][1]);
        ctx.lineTo(keypoints[i+1][0],keypoints[i+1][1]);
        ctx.stroke();
        ctx.closePath();
      }
    }
    //偵測手勢左右
    function detectDirection(last_handmarks,now_handmarks){
      let play_video = document.querySelector(".lecture-video");
      if(last_handmarks.length === 0 || now_handmarks.length === 0){
        return ;
      }
      //hand position : https://google.github.io/mediapipe/solutions/hands
      // x(左到右):1=>0 , y(上到下):0=>1
      //握拳停止
      //MCP
      let last_MCP_y_avg = (last_handmarks[5][1] + last_handmarks[9][1] + last_handmarks[13][1] + last_handmarks[17][1]) / 4;
      let now_MCP_y_avg = (now_handmarks[5][1] + now_handmarks[9][1] + now_handmarks[13][1] + now_handmarks[17][1]) / 4;
      let last_MCP_x_avg = (last_handmarks[5][0] + last_handmarks[9][0] + last_handmarks[13][0] + last_handmarks[17][0]) / 4;
      let now_MCP_x_avg = (now_handmarks[5][0] + now_handmarks[9][0] + now_handmarks[13][0] + now_handmarks[17][0]) / 4;
      //TIP
      let last_TIP_y_avg = (last_handmarks[8][1] + last_handmarks[12][1] + last_handmarks[16][1] + last_handmarks[20][1]) / 4;
      let now_TIP_y_avg = (now_handmarks[8][1] + now_handmarks[12][1] + now_handmarks[16][1] + now_handmarks[20][1]) / 4;
      let last_TIP_x_avg = (last_handmarks[8][0] + last_handmarks[12][0] + last_handmarks[16][0] + last_handmarks[20][0]) / 4;
      let now_TIP_x_avg = (now_handmarks[8][0] + now_handmarks[12][0] + now_handmarks[16][0] + now_handmarks[20][0]) / 4;
      //  手勢條件
      // console.log(now_TIP_x_avg,last_TIP_x_avg,(now_TIP_x_avg - last_TIP_x_avg));
      if ((now_TIP_x_avg - last_TIP_x_avg) > 300) { //向左揮動
        let direction = document.querySelector(".hand-direction");
        direction.innerHTML = "左";
        play_video.currentTime = play_video.currentTime - 10; //+ 10 secs
      }else if ((now_TIP_x_avg - last_TIP_x_avg) < -300) { //向右揮動
        let direction = document.querySelector(".hand-direction");
        direction.innerHTML = "右";
        play_video.currentTime = play_video.currentTime + 10; //- 10 secs
      }

      //影片暫停or播放 => 握拳/鬆手
      // console.log(now_TIP_y_avg,last_TIP_y_avg,now_TIP_y_avg,now_MCP_y_avg,(now_TIP_x_avg - now_MCP_x_avg));
      // if (now_TIP_y_avg < last_TIP_y_avg && now_TIP_y_avg<now_MCP_y_avg) { //鬆開
      //   let direction = document.querySelector(".hand-direction");
      //   direction.innerHTML = "繼續播放";
      //   // play_video.play();
      // }
      // if(now_TIP_y_avg > last_TIP_y_avg && now_TIP_y_avg>now_MCP_y_avg && (now_TIP_x_avg - now_MCP_x_avg < 100)){ //握拳停止
      //   let direction = document.querySelector(".hand-direction");
      //   direction.innerHTML = "暫停";
      //   // play_video.pause();
      // }

      if(play_video.paused){ //暫停
        if (now_TIP_y_avg < last_TIP_y_avg && now_TIP_y_avg<now_MCP_y_avg) { //鬆開
          let direction = document.querySelector(".hand-direction");
          direction.innerHTML = "繼續播放";
          play_video.play();
        }
      }else{
        if(now_TIP_y_avg > last_TIP_y_avg && now_TIP_y_avg>now_MCP_y_avg && (now_TIP_x_avg - now_MCP_x_avg < 100)){ //握拳停止
          let direction = document.querySelector(".hand-direction");
          direction.innerHTML = "暫停";
          play_video.pause();
        }
      }
    }

  },
  init:function(){
    controllers.leavePage();
    views.nav();
    controllers.member.checkLogin().then(()=>{
      controllers.member.register();
      controllers.member.login();
      controllers.member.logout();
      controllers.actions.clickMyLearning();
      views.click.renderUsername();
      controllers.handpose2();
    });
    controllers.actions.clickMenu();
    controllers.courses.searchKeyword();
    controllers.courses.searchBar();
    //display lectures
    controllers.lectures.listLectures();
    controllers.click.cancelNote();
    controllers.actions.clickProfile();
    controllers.actions.clickmyProfile();
    //Note
    //上傳note
    controllers.click.postNotes();
    //攝影機是否開啟
    // controllers.cameraIson();
  },
};
controllers.init();
views.videoTimer();
controllers.notes.notesAlert();
// controllers.click.clickNoteCurrent();
// views.notes.renderNoteCurrentTime();
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
    // console.log("Done!");
    models.user.GoogleLogin(id_token).then(()=>{
      window.location.reload();
    });
  }
};
