const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

AWS.config.update({
     accessKeyId: 'AKIAJR2HRLH2RUMGOFXA',
     secretAccessKey: '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',
     region: 'us-east-1'
});

//AWS.config.update({
//   accessKeyId: process.env.AWS_ACCESSKEYID,
//   secretAccessKey: Process.env.SECRET_ACCESS_KEY,
//   region: Process.env.AWS_REGION
//});


const s0 = new AWS.S3({});
const upload = multer({
    storage: multerS3({
         s3: s0,
         bucket: 'mychatapplication',
         acl: 'public-read',
         metadata: function (req, file, cb){
             cb(null, {fieldName: file.fieldname});
             },
             
             key: function (req, file, cb){
                cb(null, file.originalname);
             }
             
         }),
             
             rename: function (fieldname, filename){
                 return filename.replace(/\W+/g, '-').toLowerCase();
             }
    })

exports.Upload = upload;