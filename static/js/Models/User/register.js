export default function register(){
  let registerSuccess = null;
  let formElement = document.querySelector("#register-form");
  let name = formElement.name.value;
  let email = formElement.email.value;
  let password = formElement.password.value;
  let data = {
      name:name.toString(),
      email:email.toString(),
      password:password.toString()
    };
  console.log(data);
  return fetch("/api/user",{
    method:"POST",
    headers: {
      "Content-type":"application/json",
    },
    body: JSON.stringify(data)
  }).then((response)=>{
    return response.json();
  }).then((result)=>{
    result = JSON.parse(result);
    if(result.ok){
      registerSuccess = true;
    }else{
      registerSuccess = false;
    }
    console.log(result);
    return registerSuccess;
  });
};
