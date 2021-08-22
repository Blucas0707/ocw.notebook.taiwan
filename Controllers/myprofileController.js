const api_myprofiles = require("../Models/myprofiles/API_myprofiles");

let myprofileController = {
  modifyUsername:function(req, res){
    api_myprofiles.modifyUsername(req.body).then((result)=>{
      console.log(result);
      res.send(200,result);
    })
  },
  modifyUserpassword:function(req, res){
    api_myprofiles.modifyUserpassword(req.body).then((result)=>{
      console.log(result);
      res.send(200,result);
    })
  },
  modifySubscription:function(req, res){
    api_myprofiles.modifySubscription(req.body).then((result)=>{
      console.log(result);
      res.send(200,result);
    })
  },

};

module.exports = myprofileController;
