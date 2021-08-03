export default function logout(){
  let isLogin;
  return fetch("/api/user",{
    method:"DELETE"
  }).then((response)=>{
    return response.json();
  }).then((result)=>{
    if(result.ok){
      isLogin = false;
      return isLogin;
    }else{
      return true;
    }
  });
};
