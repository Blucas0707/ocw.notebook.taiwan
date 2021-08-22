const api_searches = require("../Models/searches/API_searches");

let keywordsearchController = {
  keywordsearch:function(req, res){
    let keyword = req.query.keyword;
    api_searches.searchKeyword(keyword).then((result)=>{
      res.send(200,result);
    });
  }
};

module.exports = keywordsearchController;
