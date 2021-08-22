const api_user = require("../Models/users/API_users");

let userController = {
  checkLogin:function(req, res){
    //取得Session
    let email = req.session.email;
    let password = req.session.password;
    let data = {
      "email":email,
      "password":password
    };
    if(email && password){ //session 存在
      api_user.checkLogin(data).then((result)=>{
        req.session.user_id = JSON.parse(result).data.id;
        res.json(result);
      });
    }
    else{
      res.json(null);
    }
  },
  logout:function(req, res){
    //移除Session
    req.session.email = null;
    req.session.password = null;
    req.session.user_id = null;
    let data = {
          "ok": true
      };
    res.json(data);

  },
  Register:function(req, res){
    api_user.Register(req.body).then((result)=>{
      res.json(result);
    })
  },
  Login:function(req, res){
    api_user.Login(req.body).then((result)=>{
      let login_result = result;
      if(login_result.ok){
        //登入成功後，存到Session
        req.session.email = req.body.email.toString();
        req.session.password = req.body.password.toString();
      }
      res.send(200,result);
    })
  },

};

module.exports = userController;
