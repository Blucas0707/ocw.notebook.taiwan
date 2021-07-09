let SQL = require("./SQL_user");

const database = "User";
// let statement = 'select * from lectures limit 1;'

let api_user = {
  //註冊 POST
  Register:function(data){
    return new Promise((resolve, reject)=>{
      let name = data.name.toString();
      let email = data.email.toString();
      let password = data.password.toString();
      //name, email or password = empty
      if(name == "" || email == "" || password == ""){
        let data = {
              "error": true,
              "message": "輸入為空，請重新輸入"
          };
          resolve(JSON.stringify(data));
      }else{
        // save in sql
        SQL.User.register(name,email,password).then((result)=>{
          // console.log("result: " + JSON.stringify(result));
          resolve(JSON.stringify(result));
        })
      }
    });
  },
  //登入 PATCH
  Login:function(data){
    return new Promise((resolve, reject)=>{
      let email = data.email.toString();
      let password = data.password.toString();
      //email or password = empty
      if(email == "" || password == ""){
        let data = {
              "error": true,
              "message": "輸入為空，請重新輸入"
          };
          resolve(JSON.stringify(data));
      }else{
        // save in sql
        SQL.User.login(email,password).then((result)=>{
          // console.log("result: " + JSON.stringify(result));
          resolve(JSON.stringify(result));
        })
      }
    });
  },
  //登入Google PATCH
  GoogleLogin:function(data){
    return new Promise((resolve, reject)=>{
      let name = data.name.toString();
      let email = data.email.toString();
      let password = data.sub.toString();
      // save in sql
      SQL.User.GoogleLogin(name,email,password).then((result)=>{
        // console.log("result: " + JSON.stringify(result));
        resolve(JSON.stringify(result));
      })

    });
  },
  //取得 GET
  checkLogin:function(data){
    return new Promise((resolve, reject)=>{
      let email = data.email.toString();
      let password = data.password.toString();
      //email or password = empty
      if(email == "" || password == ""){
        let data = null;
        resolve(JSON.stringify(data));
      }else{
        // check user exist in SQL
        SQL.User.checkLogin(email,password).then((result)=>{
          // console.log("result: " + JSON.stringify(result));
          resolve(JSON.stringify(result));
        })
      }
    });
  },
  // //登出 DELETE
  // Logout:function(){
  //
  // },
};
// api_user.Get();
module.exports = api_user;
