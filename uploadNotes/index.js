const auth = require('../auth');
// const path = require('path');
// const fs = require('fs');
const streamifier = require('streamifier');
// const multipart = require('parse-multipart');
// const Parse = require('./formDataParser');


const folderId = '17GOVMH8OXJOVh3kbz2oYcEYVrHk5Yvhr';

const uploadFile = async (fileStream, auth, drive, filename = "zenTest.jpg")=>{
    return new Promise(async resolve=>{
        const res = await drive.files.create({
            auth,
            resource:{
              'name':filename,
              parents: [folderId]
            },
            media:{
              mimeType:'image/jpg',
              body: fileStream
            }
          });

        if(res.status==200){
            resolve({
                status: 200,
                body: {
                    message:"File Uploaded",
                    success:true,
                }
            });
        }else{
            resolve({
                status: 200,
                body: {
                    message:"File Upload failed",
                    success: false,
                }
            });
        }  
    })
  }

// module.exports = async (context, req)=>{
//     try{
//         const {oAuth2Client, drive} = auth();
//         // await getRawBody(req).then(res=>{
//         //     console.log(res);
//         // })
//         var bodyBuffer = new Buffer.from(req.rawBody)
//         var boundary = multipart.getBoundary(req.headers['content-type'])
//         if(boundary){
//             // console.log(boundary)
//             // boundary = "----WebKitFormBoundaryDtbT5UpPj83kllfw";
//             console.log(bodyBuffer);
//             var parts = Parse(bodyBuffer, boundary)
//             var fileData = parts[0].data
//             var name = parts[0].filename
//             // var fileData = bodyBuffer
//             // var name="chalna.jpg"
//             var stream = streamifier.createReadStream(new Buffer(fileData))
//             await uploadFile(stream, oAuth2Client, drive, name).then(res=>{
//                         context.res=res;
//                     });
//         }
//         else{
//             //To implement fileStream Object
//                 context.res = {
//                     status: 200,
//                     body: {
//                         message:"Image not found in multipart-form",
//                         success: false
//                     }
//                 }
//         }
//     }catch(e){
//         context.log(e);
//         // context.log(e)
//         context.res={
//             status:200,
//             body:{
//                 message:"Request Completed with an Error!!",
//                 error:e,
//                 success:false,
//             }
//         }
//     }
// }

module.exports = async (context, req)=>{
    try{
        context.log(req.body);
        // console.log(req.body.encodeImage)
        if(req.body && req.body.encodeImage && req.body.nameWithExt){
            const {oAuth2Client, drive} = auth();
            const buffer = Buffer.from(req.body.encodeImage, "base64");
            const stream = streamifier.createReadStream(buffer);
            const name = req.body.nameWithExt;
            await uploadFile(stream, oAuth2Client, drive, name).then(res=>{
                    context.res=res;
            });
        }else{
            context.res={
                status:200,
                body:{
                    message:"body or key missing",
                    success: false
                }
            }
        }
    }catch(e){
        context.res ={
            status:500,
            body:{
                message:"Request Completed with an Error!!",
                success: false
            }
        }
    }
}