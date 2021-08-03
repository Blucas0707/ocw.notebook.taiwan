export default function login(){
  let loginSuccess = null;
  let email = document.querySelector(".login-email").value;
  let password = document.querySelector(".login-password").value;
  let data = {
    "email":email,
    "password":password
  };
  return fetch("/api/user",{
    method:'PATCH',
    headers: {
      "Content-type":"application/json",
    },
    body: JSON.stringify(data),
  }).then((response)=>{
    return response.json();
  }).then((result)=>{
    if(result.ok){
      loginSuccess = true;
    }else{
      loginSuccess = false;
    }
    return loginSuccess;
  });
};
