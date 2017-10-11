const AWS = require('aws-sdk');
const uuidv4 = require('uuid/v4');

const s3 = new AWS.S3();

//this must be used after multer or else the req will not have a file attached
const upload2AWS = (myBucket, folder) => {
  if (!folder) folder = '';
  return (req, res, next) => {
    req.file.filename = uuidv4() + '.webm';
    s3.createBucket({ Bucket: myBucket }, (err, data) => {
      if (err) next(err);
      else {
        const filename = `${folder}${req.file.filename}`
        const params = { Bucket: myBucket, Key: filename, Body: req.file.buffer, ACL:'public-read' };
        s3.putObject(params, (err, data) => {
          if (err) next(err);
          else next();
        });
      }
    });
  };
};

module.exports = upload2AWS;
