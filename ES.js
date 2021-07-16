const argon2 = require('argon2');

// let hashPassword = async (password)=>{
//   const hashkey = await argon2.hash("password");
//   console.log(hashkey);
//   return hashkey;
// };
function hashPassword2(password){
  return new Promise((resolve,reject)=>{
    const hashkey = argon2.hash(password);
    console.log(hashkey);
    resolve(hashkey);
  });
};

// console.log(hashkey);
// function hashVerify(hashPassword,password){
//   return new Promise((resolve,reject)=>{
//     const verification = argon2.verify(hashPassword, password);
//     console.log(verification);
//     resolve(verification);
//   });
// };
// let hashVerify = async function(hashkey,password){
//   const verification = await argon2.verify(hashkey, "padsfsdsfsdfsfdsdfsdfdsfssword");
//   console.log(verification);
// };
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
