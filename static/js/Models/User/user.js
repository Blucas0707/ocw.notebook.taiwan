let user = {
  login:function(object){
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
        object.loginSuccess = true;
      }else{
        object.loginSuccess = false;
      }
      return object;
    });
  },
  logout:function(object){
    return fetch("/api/user",{
      method:"DELETE"
    }).then((response)=>{
      return response.json();
    }).then((result)=>{
      if(result.ok){
        object.isLogin = false;
        return object;
      }else{
        object.isLogin = true;
        return object;
      }
    });
  },
  register:function(object){
    let formElement = document.querySelector("#register-form");
    let name = formElement.name.value;
    let email = formElement.email.value;
    let password = formElement.password.value;
    let data = {
        name:name.toString(),
        email:email.toString(),
        password:password.toString()
      };
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
        object.registerSuccess = true;
      }else{
        object.registerSuccess = false;
      }
      return object;
    });
  },
  googlelogin(object,id_token){
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
          object.loginSuccess = true;
          object.isGoogleLogin = true;
        }else{
          object.loginSuccess = false;
          object.isGoogleLogin = false;
        }
        resolve(object);
      });
    });
  },
  checkLogin:function(object){
    return fetch("/api/user",{
      method:"GET"
    }).then((response)=>{
      return response.json();
    }).then((result)=>{
      if(result != null){
        object.isLogin = true;
        object.user_id = JSON.parse(result).data.id;
        object.user_name = JSON.parse(result).data.name;
        object.user_sub = JSON.parse(result).data.sub;
        object.user_email = JSON.parse(result).data.email;
      }
      else{
        object.isLogin = false;
      }
      return object;
    });
  },
}

module.exports = user;
