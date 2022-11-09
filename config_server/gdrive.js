const { google } = require("googleapis");
exports.OAUTH = () => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.OAUTH_CLIENTID,
    process.env.OAUTH_CLIENT_SECRET,
    process.env.OAUTH_REDIRECT_URI
  );
  oauth2Client.setCredentials({
    refresh_token: process.env.OAUTH_REFRESH_TOKEN_DRIVE,
  });
  return oauth2Client;
};
