const {OAuth2Client} = require('google-auth-library');


var verifyToken = (req, res, next) => {
  const client = new OAuth2Client(req.body.client_id);
  /* jshint ignore:start */
  async function verify() {
    const ticket = await client.verifyIdToken({
        idToken: req.body.token,
        audience: req.body.client_id,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload.sub;
    // If request specified a G Suite domain:
    const domain = payload.hd;
  }
  verify().catch(console.error);
  /* jshint ignore:end */
};

module.exports = { verifyToken };