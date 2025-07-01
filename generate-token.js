const { google } = require("googleapis");

const CLIENT_ID = "940574927037-6dg87foso8f05div3hrqnbqq2u5k25co.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const SCOPES = [
  "https://mail.google.com/",
  "https://www.googleapis.com/auth/gmail.send",
];

const url = oAuth2Client.generateAuthUrl({
  access_type: "offline",
  scope: SCOPES,
});

console.log("Authorize this app by visiting this URL:\n", url);
