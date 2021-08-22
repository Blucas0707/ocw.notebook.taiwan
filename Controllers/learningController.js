const api_learnings = require("../Models/learnings/API_learnings");

let learningController = {
  updateLecture_status:function(req, res){
    api_learnings.updateLecture_status(req.body).then((result)=>{
      let update_status = JSON.parse(result);
      res.json(result);
    })
  },
  getOneLecture_status:function(req, res){
    let course_id = req.params.course_id;
    let lecture_id = req.params.lecture_id;
    let user_id = req.session.user_id;

    if(user_id){
      api_learnings.getOneLecture_status(user_id,course_id,lecture_id).then((result)=>{
        let update_status = JSON.parse(result);
        res.json(result);
      })
    }
  },
  getAllLecture_status:function(req, res){
    let course_id = req.params.course_id;
    let user_id = req.session.user_id;

    if(user_id){
      api_learnings.getAllLecture_status(user_id,course_id).then((result)=>{
        let update_status = JSON.parse(result);
        res.send(200,result);
      })
    }
  },

};

module.exports = learningController;
