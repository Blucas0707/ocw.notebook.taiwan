const api_mylearnings = require("../Models/mylearnings/API_mylearnings");

let mylearningController = {
  getMyLearnings:function(req, res){
    let user_id = req.session.user_id;
    let page = (req.query.page) ? (req.query.page):("0");
    let learning_status = (req.query.status) ? (req.query.status):("0");
    let learning_category = (req.query.category) ? (req.query.category):("%");

    api_mylearnings.getMyLearnings(user_id,page,learning_status,learning_category).then((result)=>{
      res.send(200,result);
    });

  },
};

module.exports = mylearningController;
