let SQL = require("./SQL_myprofiles");

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
function hashVerify(hashPassword,password){
  return new Promise((resolve,reject)=>{
    const verification = argon2.verify(hashPassword, password);
    resolve(verification);
  });
};

let api_myprofiles = {
  //修改訂閱
  modifySubscription:function(data){
    return new Promise((resolve, reject)=>{
      let user_id = data.user_id.toString();
      let subcription = data.user_sub.toString();
      // save in sql
      SQL.myProfile.modifySubscription(user_id,subcription).then((result)=>{
        resolve(JSON.stringify(result));
      })
    });
  },
  //修改姓名
  modifyUsername:function(data){
    return new Promise((resolve, reject)=>{
      let user_id = data.user_id.toString();
      let new_user_name = data.user_name.toString();
      //name, email or password = empty
      if(new_user_name == ""){
        let data = {
              "error": true,
              "message": "輸入為空，請重新輸入"
          };
          resolve(JSON.stringify(data));
      }else{
        // save in sql
        SQL.myProfile.modifyUsername(user_id,new_user_name).then((result)=>{
          resolve(JSON.stringify(result));
        })
      }
    });
  },
  //修改密碼
  modifyUserpassword:function(data){
    return new Promise((resolve, reject)=>{
      let user_id = data.user_id.toString();
      let now_password = data.now_password.toString();
      let new_password = data.new_password.toString();
      //name, email or password = empty
      if(now_password === "" || new_password === ""){
        let data = {
              "error": true,
              "message": "輸入為空，請重新輸入"
          };
          resolve(JSON.stringify(data));
      }else{
        // save in sql
        //加密新密碼
        //argon2加密
        hashPassword2(new_password).then((hashPassword)=>{
          // save in sql
          SQL.myProfile.modifyUsepassword(user_id,now_password,hashPassword).then((result)=>{
            resolve(JSON.stringify(result));
          })
        });
      }
    });
  },
};
module.exports = api_myprofiles;
