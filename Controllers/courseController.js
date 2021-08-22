const api_courses = require("../Models/courses/API_courses");

let courseController = {
  course:function(req, res){
    let page = (req.query.page) ? (req.query.page):("0");
    let category = (req.query.category) ? (req.query.category):("%");
    let university = (req.query.university) ? (req.query.university):("%");
    api_courses.getAllCourse(page,category,university).then((result)=>{
      res.send(200,result);
    });
  }
};

module.exports = courseController;
