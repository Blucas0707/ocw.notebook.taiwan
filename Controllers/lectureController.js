const api_lectures = require("../Models/lectures/API_lectures");

let lectureController = {
  lecture:function(req, res){
    let course_id = req.params.course_id;
    api_lectures.getAllLectures(course_id).then((result)=>{
      res.json(result);
    });
  }
};

module.exports = lectureController;
