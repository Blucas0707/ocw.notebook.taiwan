const model_myprofile = require('../Models/myprofile.js');
const controller_member = require('./member.js');

let myprofile = {
  updateSubscription:function(user_object){
    let update_btn = document.querySelector("#main-profile-mysubscription-submit-btn");
    update_btn.addEventListener("click",()=>{
      // 確認是否繼續訂閱
      let subcription;
      if(document.querySelector("#keep-sub").checked){
        subcription = 1;
      }else{
        subcription = 0;
      }
      model_myprofile.updateSubscription(subcription,user_object).then(()=>{
        //顯示成功訊息
        let error_msg = document.querySelector(".edit-subscription-input-error");
        error_msg.innerHTML = "修改成功";
        error_msg.style.color = "blue";
        window.location.assign("/myprofile");
      })
    })
  },
  updateUsername:function(user_object){
    //  顯示username
    document.querySelector("#modify-name").value = user_object.user_name;
    let update_btn = document.querySelector("#main-profile-name-submit-btn");
    update_btn.addEventListener("click",()=>{
      let new_username = document.querySelector("#modify-name").value;
      if(new_username != "" || new_username != null){
        model_myprofile.updateUsername(new_username,user_object).then(()=>{
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
  updateUserpassword:function(user_object){
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
          model_myprofile.updateUserpassword(now_password,new_password,user_object).then(()=>{
            //顯示成功訊息
            let error_msg = document.querySelector(".edit-password-input-error");
            error_msg.innerHTML = "修改成功";
            error_msg.style.color = "blue";
            alert("修改成功,請重新登入!");
            controller_member.logout(user_object);
            // models.user.Logout();
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
  chooseProfiles:function(user_object){
    // 點擊 個人檔案
    let edit_profile_btn = document.querySelector("#edit-profile");
    edit_profile_btn.addEventListener("click",()=>{
      //顯示profile div
      let profile_div = document.querySelector(".main-profile-content-myprofile");
      profile_div.style.display = "block";
      let title_1 = document.querySelector(".main-profile-content-title-1");
      title_1.innerHTML = "個人檔案";
      let title_2 = document.querySelector(".main-profile-content-title-2");
      title_2.innerHTML = "修改資訊";
      //隱藏 更改姓名&取消訂閱 div
      let account_div = document.querySelector(".main-profile-content-myaccount");
      account_div.style.display = "none";
      let subscription_div = document.querySelector(".main-profile-content-mysubscription");
      subscription_div.style.display = "none";
    });
    // 點擊 帳戶
    let edit_account_btn = document.querySelector("#edit-account");
    edit_account_btn.addEventListener("click",()=>{
      //隱藏 更改姓名&取消訂閱 div
      let profile_div = document.querySelector(".main-profile-content-myprofile");
      profile_div.style.display = "none";
      let subscription_div = document.querySelector(".main-profile-content-mysubscription");
      subscription_div.style.display = "none";
      //顯示 更改密碼  div
      let account_div = document.querySelector(".main-profile-content-myaccount");
      account_div.style.display = "block";
      let title_1 = document.querySelector(".main-profile-content-title-1");
      title_1.innerHTML = "帳戶";
      let title_2 = document.querySelector(".main-profile-content-title-2");
      title_2.innerHTML = "帳戶及更改密碼" +"<br>"+"(Google登入，無法更改密碼)";

      let email = document.querySelector(".main-profile-content-myaccount-email-display");
      email.innerHTML = user_object.user_email;
    });

    // 點擊 訂閱
    let edit_subcription_btn = document.querySelector("#edit-subcription");
    edit_subcription_btn.addEventListener("click",()=>{
      //顯示訂閱狀態
      let status = document.querySelector(".main-profile-content-mysubscription-status");
      if(user_object.user_sub === 1){ //已訂閱
        status.innerHTML = "已訂閱";
        status.style.color = "blue";
      }else{
        status.innerHTML = "未訂閱";
        status.style.color = "red";
      }

      //隱藏 更改姓名＆更改密碼 div
      let profile_div = document.querySelector(".main-profile-content-myprofile");
      profile_div.style.display = "none";
      let account_div = document.querySelector(".main-profile-content-myaccount");
      account_div.style.display = "none";

      //顯示訂閱 div
      let subcription_div = document.querySelector(".main-profile-content-mysubscription");
      subcription_div.style.display = "block";
      let title_1 = document.querySelector(".main-profile-content-title-1");
      title_1.innerHTML = "訂閱";
      let title_2 = document.querySelector(".main-profile-content-title-2");
      title_2.innerHTML = "提醒信件四天一次";

      let email = document.querySelector(".main-profile-content-myaccount-email-display");
      email.innerHTML = user_object.user_email;
    });
  },
};

module.exports = myprofile;
