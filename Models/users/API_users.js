let SQL = require("./SQL_user");

const argon2 = require('argon2');
const database = "User";
// let statement = 'select * from lectures limit 1;'
//加密
function hashPassword2(password){
  return new Promise((resolve,reject)=>{
    const hashkey = argon2.hash("password");
    console.log(hashkey);
    resolve(hashkey);
  });
};
//驗證
function hashVerify(hashPassword,password){
  // return new Promise((resolve,reject)=>{
    const verification = argon2.verify(hashPassword, password);
    return(verification);
  // });
};

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
        // argon2 加密密碼
        hashPassword2(password).then((hashPassword)=>{
          // save in sql
          SQL.User.register(name,email,hashPassword).then((result)=>{
            resolve(JSON.stringify(result));
          })
        });
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
        // argon2 加密密碼
          // save in sql
          SQL.User.login(email).then((hashPassword)=>{
            // console.log(hashPassword);
            // console.log("result: " + JSON.stringify(result));
            let verify = hashVerify(hashPassword,password);
            // console.log("verify" + verify);
            if(verify){
              let data = {
                "ok": true
              };
              resolve(JSON.stringify(data));
            }else{
              let data = {
                "error": true,
                "message": "登入失敗，帳號或密碼錯誤或其他原因"
              };
              resolve(data);
            }

          });
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
        SQL.User.checkLogin(email).then((result)=>{
          // console.log("result: " + JSON.stringify(result));
          // console.log(result);
          let hashPassword = result.data.password;
          // console.log(hashPassword,password);
          let verify = hashVerify(hashPassword,password);
          // console.log("verify: " + verify);
          // console.log(result);
          if(verify){
            let data = {
              "data":{
                "id": result.data.id,
                "name": result.data.name,
                "email": result.data.email,
              }
            };
            resolve(JSON.stringify(data));
          }else{
            let data = null;
            resolve(JSON.stringify(data));
          }
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
