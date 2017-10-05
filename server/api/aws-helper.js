const AWS = require('aws-sdk');

const s3 = new AWS.S3();

//this must be used after multer or else the req will not have a file attached
const upload2AWS = (myBucket) => {
  return (req, res, next) => {
    req.file.filename = uuidv4() + '.webm';
    s3.createBucket({ Bucket: myBucket }, (err, data) => {
      if (err) next(err);
      else {
        const params = { Bucket: myBucket, Key: req.file.filename, Body: req.file.buffer };
        s3.putObject(params, (err, data) => {
          if (err) next(err);
          else next();
        });
      }
    });
  };
};

module.exports = upload2AWS;
