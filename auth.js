const {google} = require('googleapis');
const { drive } = require('googleapis/build/src/apis/drive');

const credentials = {
    "codes":{
        "refresh_token":"1//044cOtqwt9bqTCgYIARAAGAQSNwF-L9IrJm3HbYW5xUNafuMHV9oWybbO0mtMOOPX8BwlPB7klc0NgEJAHqKtbGQdAS9PJ1s-d5Q",
        "client_secret":"p9cALL0cciQrRmOmW1AGyLGt",
        "client_id":"297499831023-er4kntq6mop9h97im8nk2apq87c6ttv4.apps.googleusercontent.com",
        "redirect_uri":"https://developers.google.com/oauthplayground"
    }
};

const auth = () => {
    const {client_secret, client_id, redirect_uri, refresh_token} = credentials.codes;
    // console.log(client_secret, client_id, redirect_uri, refresh_token)
    oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uri);
    oAuth2Client.setCredentials({refresh_token});
    var drive = google.drive({version: 'v3', oAuth2Client});
    return {oAuth2Client, drive};
}

module.exports = auth
