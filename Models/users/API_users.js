let SQL = require("./SQL_user");

const argon2 = require('argon2');
const database = "User";

//加密
function hashPassword2(password){
  return new Promise((resolve,reject)=>{
    const hashkey = argon2.hash(password);
    resolve(hashkey);
  });
};
//驗證
// let hashVerify = async function(hashkey,password){
//   const verification = await argon2.verify(hashkey, "padsfsdsfsdfsfdsdfsdfdsfssword");
//   console.log("verification:" + verification);
// };

function hashVerify(hashkey,password){
  return new Promise((resolve,reject)=>{
    const verification = argon2.verify(hashkey, password);
    resolve(verification);
  });
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
      console.log("password:" + password);
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
            console.log("hashPassword:" + hashPassword.error);
            if(hashPassword.error){ //SQL error
              let data = {
                "error": true,
                "message": "登入失敗，帳號或密碼錯誤或其他原因"
              };
              resolve(data);
            }else{
              hashVerify(hashPassword,password).then((verification)=>{
                if(verification){
                  let data = {
                    "ok": true
                  };
                  resolve(data);
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
      }
    });
  },
  //登入Google PATCH
  GoogleLogin:function(data){
    return new Promise((resolve, reject)=>{
      let name = data.name.toString();
      let email = data.email.toString();
      let password = data.sub.toString();

      //argon2加密
      hashPassword2(password).then((hashPassword)=>{
        // save in sql
        SQL.User.GoogleLogin(name,email,password,hashPassword).then((result)=>{
          console.log(result);
          resolve(JSON.stringify(result));
        })
      });

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
          let hashPassword = result.data.password;
          hashVerify(hashPassword,password).then((verify)=>{
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
          });
        })
      }
    });
  },
};
module.exports = api_user;
