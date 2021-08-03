
let myprofile = {
    updateSubscription:function(subscription,user_object){
      return new Promise((resolve, reject)=>{
        let data = {
          "user_id":user_object.user_id,
          "user_sub":subscription
        };
        // console.log(email,password);
        return fetch("/api/myprofile/subscription",{
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
    updateUsername:function(new_username,user_object){
      return new Promise((resolve, reject)=>{
        let data = {
          "user_id":user_object.user_id,
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
    updateUserpassword:function(now_password,new_password,user_object){
      return new Promise((resolve, reject)=>{
        // let now_password = document.querySelector(".login-email").value;
        // let new_password = document.querySelector(".login-password").value;
        let data = {
          "user_id":user_object.user_id,
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
};

module.exports = myprofile;
