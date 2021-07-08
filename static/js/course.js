let models = {
  lecture_id:null,
  course_id:location.pathname.split("course/")[1],
  user_id:null,
  notes:{
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
    postNotes:function(note){
      let course_id = models.course_id;
      let lecture_id = models.lecture_id;
      let user_id = models.user_id;
      return new Promise((resolve, reject)=>{
        let note = document.querySelector("#note-input-content").value;
        let data = {
            "course_id":course_id.toString(),
            "lecture_id":lecture_id.toString(),
            "user_id":user_id.toString(),
            "note":note,
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
          console.log(result);
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
          console.log("update done");
          result = JSON.parse(result);
          console.log(result);
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
          console.log(result);
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
    isLogin:null,
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
};

let views = {
  notes:{
    renderNotes:function(result){
      // console.log(result);
      // console.log(result.data, result.data.length);
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

          //新增div note-time under note-show-list
          let div_note_time = document.createElement("div");
          div_note_time.className = "note-time";
          div_note_time.innerHTML = result.data[index].note_time;
          // console.log(result.data[index].note_time);
          //新增div note-content under note-show-list
          let div_note_content = document.createElement("div");
          div_note_content.className = "note-content";
          div_note_content.innerHTML = result.data[index].note;
          // console.log(result.data[index].note);
          div_note_show_list.appendChild(div_note_time);
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

      //新增div note-time under note-show-list
      let div_note_time = document.createElement("div");
      div_note_time.className = "note-time";
      div_note_time.innerHTML = result.data[0].note_time;
      // console.log(result.data[index].note_time);
      //新增div note-content under note-show-list
      let div_note_content = document.createElement("div");
      div_note_content.className = "note-content";
      div_note_content.innerHTML = result.data[0].note;
      // console.log(result.data[index].note);
      div_note_show_list.appendChild(div_note_time);
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

};

let controllers = {
  click:{
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
            lecture_video.currentTime = video_current_time;
            //For iphone
            lecture_video.addEventListener("loadeddata",function setVideotime(){
              // console.log(lecture_video.currentTime);
              if(lecture_video.currentTime == 0) {
                  // console.lo("11111");
                  lecture_video.play();
                  lecture_video.removeEventListener("loadeddata",setVideotime);
              }
              else {
                  // lecture_video.load();
                  lecture_video.pause();
                  lecture_video.currentTime = video_current_time;
                  lecture_video.removeEventListener("loadeddata",setVideotime);
                  // console.log("22222");
                  lecture_video.play();
                  // setTimeout(lecture_video.play, 500);
              }
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
      });
    },
    postNotes:function(){
      return new Promise((resolve, reject)=>{
        let save_btn = document.querySelector("#note-save-btn");
        save_btn.addEventListener("click",()=>{
          let note = document.querySelector("#note-input-content").value;
          if(note.toString().length != 0){
            models.notes.postNotes(note).then((result)=>{
              // console.log("models back:" + JSON.stringify(result));
              document.querySelector("#note-input-content").value = "";
              views.notes.renderupdateNote(result);
              resolve(result);
            })
          }
        });
      })
    }
  },
  notes:{
    getNotes:function(){
      return new Promise((resolve, reject)=>{
        models.notes.getNotes().then((result)=>{
          views.notes.renderNotes(result);
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
            console.log("login");
            views.user.loginStatus();
          });
        });
    }
  },
  leavePage:function(){
    window.onbeforeunload = function(){
      // return '您確定要離開嗎?';

      if(models.user.isLogin && models.lectures.allLecture_status.user_id != ""){
        // console.log(models.user.isLogin);
        console.log("update Lecture status");
        models.lectures.updateLecture_status();

        // window.onunload = function(){
        //     views.fadeout(document.querySelector("html"));
        // }
      }
      // return
    };
  },
  init:function(){
    controllers.leavePage();
    views.nav();
    controllers.member.checkLogin().then(()=>{
      controllers.member.register();
      controllers.member.login();
      controllers.member.logout();
      controllers.actions.clickMyLearning();
    });
    //display lectures
    controllers.lectures.listLectures();
    controllers.click.cancelNote();

    //Note
    //上傳note
    controllers.click.postNotes();
  },
};
controllers.init();
views.videoTimer();
