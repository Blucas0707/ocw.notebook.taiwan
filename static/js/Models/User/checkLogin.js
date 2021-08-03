export default function checkLogin(){
  let isLogin = null;
  let user_name = null;
  return fetch("/api/user",{
    method:"GET"
  }).then((response)=>{
    return response.json();
  }).then((result)=>{
    if(result != null){
      isLogin = true;
      user_name = JSON.parse(result).data.name;
    }
    else{
      isLogin = false;
    }
    return [isLogin,user_name];
  });
};
