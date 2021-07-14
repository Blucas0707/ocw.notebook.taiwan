const argon2 = require('argon2');
let password = "password";
let hashPassword = async (password)=>{
  const hashkey = await argon2.hash("password");
  console.log(hashkey);
  return hashkey;
};
function hashPassword2(password){
  return new Promise((resolve,reject)=>{
    const hashkey = argon2.hash(password);
    console.log(hashkey);
    resolve(hashkey);
  });
};
hashPassword2(password).then((result)=>{
  console.log(result);
  hashVerify(result);
});
// console.log(hashkey);
function hashVerify(hashPassword,password){
  return new Promise((resolve,reject)=>{
    const verification = argon2.verify(hashPassword, password);
    resolve(verification);
  });
};
let hashVerify = async (hashkey) =>{
  const verification = await argon2.verify(hashkey, "password");
  console.log(verification);
};
