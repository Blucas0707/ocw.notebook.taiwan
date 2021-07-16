require('dotenv').config({path:__dirname+'/../../.env'});

const argon2 = require('argon2');
const mysql = require('mysql2');
//驗證
function hashVerify(hashPassword,password){
  return new Promise((resolve,reject)=>{
    const verification = argon2.verify(hashPassword, password);
    resolve(verification);
  });
};
//建立SQL物件
let SQL = {
  host: process.env.RDS_SQL_HOST,
  sql_execute_statement:null,
  pool:mysql.createPool({
    host: process.env.RDS_SQL_HOST,
    port: process.env.RDS_SQL_PORT,
    user: process.env.RDS_SQL_USER,
    password: process.env.RDS_SQL_PASSWORD,
    database: "User", //default: User
    waitForConnections: true,
    connectionLimit: 3,
    queueLimit: 0
  }),
  myProfile:{
    modifyUsername:function(user_id,new_user_name){
      let sql_statement = "update users set user_name = ? where user_id = ?";
      let para = [new_user_name,user_id];
      let promisePool = SQL.pool.promise();
      return new Promise((resolve, reject)=>{
        promisePool.query(sql_statement,para).then(([rows, fields])=>{
          let data = {
            "ok": true,
          };
          resolve(data);
        }).catch(()=>{
          let data = {
            "error": true,
            "message": "伺服器內部錯誤"
          };
          resolve(data);
        })
      });
    },
    modifyUsepassword:function(user_id,now_password,new_password){
      let sql_statement = "select user_password from users where user_id = ?";
      let para = [user_id];
      let promisePool = SQL.pool.promise();
      return new Promise((resolve, reject)=>{
        promisePool.query(sql_statement,para).then(([rows, fields])=>{
          //先驗證現有密碼是否正確
          let password_SQL = rows[0]["user_password"];
          console.log("password_SQL:" + password_SQL);
          console.log("now_password:" + now_password);
          hashVerify(password_SQL,now_password).then((verify)=>{
            if(verify){ //密碼正確
              //update user password
              sql_statement = "update users set user_password = ? where user_id = ?";
              para = [new_password,user_id];
              promisePool.query(sql_statement, para).then(([rows, fields])=>{
                let data = { //更新成功
                  "ok": true
                };
                resolve(data);
              }).catch((err)=>{ //更新失敗
                // console.log("GR: "+err);
                let data = {
                  "error": true,
                  "message": "伺服器內部錯誤,更改密碼失敗"
                };
                resolve(data);
              });
            }else{ //密碼錯誤
              let data = {
                "error": true,
                "message": "密碼錯誤"
              };
              resolve(data);
            }
          });
        }).catch(()=>{
          let data = {
            "error": true,
            "message": "伺服器內部錯誤"
          };
          resolve(data);
        })
      });
    },
  },
};
module.exports = SQL;
