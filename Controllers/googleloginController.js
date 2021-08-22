const {OAuth2Client} = require('google-auth-library');
const api_user = require("../Models/users/API_users");

let googleloginController = {
  login:function(req, res){
    let token = req.params.id_token;
    let CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    console.log("CLIENT_ID: ",CLIENT_ID);
    const client = new OAuth2Client(CLIENT_ID);
    async function verify() {
      const ticket = await client.verifyIdToken({
          idToken: token,
          audience: CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const userid = payload['sub'];
      return payload;
    }
    verify().then((data,token)=>{
      api_user.GoogleLogin(data).then((result)=>{
        let login_result = JSON.parse(result);
        if(login_result.ok){
          //登入成功後，存到Session
          req.session.email = data.email.toString();
          req.session.password = data.sub.toString();
        }
        res.json(result);
      })
    }).catch(console.error);
  },

};

module.exports = googleloginController;
