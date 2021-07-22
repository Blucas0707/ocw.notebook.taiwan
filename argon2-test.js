const argon2 = require('argon2');

function hashPassword2(password){
  return new Promise((resolve,reject)=>{
    const hashkey = argon2.hash(password);
    console.log(hashkey);
    resolve(hashkey);
  });
};

function hashVerify2(hashkey,password){
  return new Promise((resolve,reject)=>{
    const verification = argon2.verify(hashkey, password);
    // console.log(hashkey);
    resolve(verification);
  });
};
let password = "qqqqqqq";
hashPassword2(password).then((result)=>{
  console.log("argon2 result:" + result);
  console.log(result,password);
  hashVerify2(result,password).then((verify)=>{
    console.log("verify: " + verify);
  });
});
