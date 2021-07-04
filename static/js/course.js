let models = {
  lectures:{
    allLecture_data:null,
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
          models.lectures.allLecture_data = result;
          // console.log(result);
          // console.log(models.user.loginSuccess);
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
  lectures:{
    renderAllLectures:function(result){
      //models.lectures.allLecture_data;
      //課堂標題
      document.querySelector(".course-title").innerHTML = result["course_name"];

      // lecture list
      for(let index=0;index<result.total;index++){
        let lecture_id,lecture_name, lecture_video, lecture_note, lecture_reference;

        //課堂
        lecture_id = result.data[index].lecture_id;
        lecture_name = result.data[index].lecture_name;
        lecture_video = result.data[index].lecture_video;
        lecture_note = result.data[index].lecture_note;
        lecture_reference = result.data[index].lecture_reference;
        // create new li for lecture-list
        let li_lecture = document.createElement("li");

        // create new div under lecture-list
        let div_lecture_status = document.createElement("div");
        div_lecture_status.className = "lecture-status";
        div_lecture_status.id = lecture_id.toString();
        // create new div under lecture-list
        let div_lecture_id = document.createElement("div");
        div_lecture_id.className = "lecture-id";
        div_lecture_id.innerHTML = "單元 " + lecture_id.toString() + " ";
        // create new div under lecture-list
        let div_lecture_name = document.createElement("div");
        div_lecture_name.className = "lecture-name";
        div_lecture_name.innerHTML = lecture_name;
        // create new div under lecture-list
        let div_lecture_video = document.createElement("div");
        div_lecture_video.className = "lecture-video-link";
        div_lecture_video.innerHTML = lecture_video;

        li_lecture.appendChild(div_lecture_status);
        li_lecture.appendChild(div_lecture_id);
        li_lecture.appendChild(div_lecture_name);
        li_lecture.appendChild(div_lecture_video);

        //新增li to lecture-list
        let ul_lecture_list = document.querySelector(".lecture-list");
        ul_lecture_list.appendChild(li_lecture);
        //點擊課堂
        controllers.click.chooseLecture(li_lecture, lecture_video, lecture_note, lecture_reference);

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
        window.location.reload();

      }else{ // register fail
        login_status.innerHTML = "登入失敗，帳號或密碼錯誤";
        login_status.style.color = "red";
      }
    },
    isLogin:function(){
      // console.log(models.user.isLogin);
      //判斷已經登入
      if(models.user.isLogin){
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
        document.querySelector(".note-not-login").style.display = "block";
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
        document.querySelector(".note-not-login").style.display = "block";
      }
    },
  },
  // nav:function(){
  //   //按下學習紀錄按鈕 => 導向自己
  //   let mylearning_btn = document.querySelector("#mylearning-btn");
  //   mylearning_btn.addEventListener("click",()=>{
  //     window.location.replace("/mylearning");
  //   });
  //   //按下登出按鈕 => 導向首頁
  //   let logout_btn = document.querySelector("#logout-btn");
  //   logout_btn.addEventListener("click",()=>{
  //     window.location.reload();
  //   });
  // },
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


};

let controllers = {
  click:{
    chooseLecture:function(elem, lecture_video_link, lecture_note_link, lecture_reference_link){
      elem.addEventListener("click",()=>{
        //清空note box
        let notebox = document.querySelector("#note-input-content");
        notebox.value = "";
        //更改影片網址
        let lecture_video = document.querySelector(".lecture-video");
        lecture_video.src = lecture_video_link;
        //影片自動播放
        // document.querySelector("")
        //更改下載相關
        //clear first
        let note_download = document.querySelector(".note-download");
        let reference_download = document.querySelector(".reference-download");
        let video_download = document.querySelector(".video-download");

        let elems = [note_download,reference_download,video_download];
        let elems_names = ["講義下載", "參考資料下載", "影音下載"];
        let elems_links = [lecture_note_link, lecture_reference_link, lecture_video_link];
        for(let index = 0;index<elems.length;index++){

          if(elems_links[index] == ""){
            if(elems[index].innerHTML == ""){
              elems[index].innerHTML = elems_names[index];
            }
          }else{
            //clear child first
            elems[index].innerHTML = "";
            while(elems[index].hasChildNodes()){
              elems[index].removeChild(elems[index].firstChild); //刪除子節點
            };
            let link = document.createElement("a");
            link.href = elems_links[index];
            link.download = "";
            link.innerHTML = elems_names[index];
            elems[index].appendChild(link);
          }
        }
      });
    },
    cancelNote:function(){
      let cancel_btn = document.querySelector("#note-cancel-btn");
      cancel_btn.addEventListener("click",()=>{
        let notebox = document.querySelector("#note-input-content");
        notebox.value = "";
      });
    },
  },
  lectures:{
    listLectures:function(){
      models.lectures.getAllLectures().then((result)=>{
        // console.log(result);
        views.lectures.renderAllLectures(result);
      });
    }
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
    //display lecctures
    controllers.lectures.listLectures();
    controllers.click.cancelNote();

  },
};

controllers.init();
views.videoTimer();