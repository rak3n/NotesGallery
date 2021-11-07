const  auth = require('../auth');

async function listFiles(context, oAuth2Client, drive) {
    return new Promise((resolve) => {drive.files.list({
      auth: oAuth2Client,
      q: "'17GOVMH8OXJOVh3kbz2oYcEYVrHk5Yvhr' in parents and trashed = false",
      pageSize: 10,
      fields: 'nextPageToken, files(id, name, webContentLink)',
    }, (err, res2) => {
      if (err){
        //   context.log('The API returned an error: ' + err);
          resolve({
            status:500,
            body: {
              message: "An Error Occured",
              status: false
            }
        });
    }
      var results = res2.data.files.map(itm=>{
        itm.previewUrl = "https://drive.google.com/uc?export=view&id="+itm.id;
        return itm;
      })

      resolve(context.res = {
          status:200,
          body: results
      });
    })
    });
  }

module.exports = async function (context, req) {
    try{
        const {oAuth2Client, drive} = auth()
        // context.log("App hit"+(oAuth2Client, drive))
        await listFiles(context, oAuth2Client, drive).then(res=>{
            context.res = res;
        })
    }catch(err){
        context.res = {
            status: 500,
            body: {
              message:"Request Completed with an Error",
              error: err
            }
        }
    }
}