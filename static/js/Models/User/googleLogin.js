export default function googlelogin(id_token){
  console.log(id_token);
  let loginSuccess = null;
  let isGoogleLogin = null;
  return new Promise((resolve, reject)=>{
    return fetch('/api/google/login/' + id_token,{
      method:'POST',
      headers: {
        'Content-Type':'application/x-www-form-urlencoded',
      },
    }).then((response)=>{
      return response.json();
    }).then((result)=>{
      result = JSON.parse(result);
      if(result.ok){
        loginSuccess = true;
        isGoogleLogin = true;
        console.log(isGoogleLogin);
      }else{
        loginSuccess = false;
        isGoogleLogin = false;
      }
      console.log([loginSuccess,isGoogleLogin]);
      resolve([loginSuccess,isGoogleLogin]);
    });
  });
};
