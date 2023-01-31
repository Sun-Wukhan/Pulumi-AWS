"use strict";
const pulumi = require("@pulumi/pulumi");
const aws = require("@pulumi/aws");
const awsx = require("@pulumi/awsx");
const { getStack } = require("@pulumi/pulumi");

// Create an AWS resource (S3 Bucket)
const bucket = new aws.s3.Bucket("my-bucket"); // This is a Unique identier and unique name 

// Create a bucket with a custom name 
const bucketTwo = new aws.s3.Bucket("second-bucket", {
bucket: "navid-khan-bucket"
});

const bucketThree = new aws.s3.Bucket("third-bucket", {
    bucket: `navid-khan-bucket-${getStack()}`
    });

// Create a role for the firehose 
const firehoseRole = new aws.iam.Role("firehoseRole", {assumeRolePolicy: `{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Action": "sts:AssumeRole",
        "Principal": {
          "Service": "firehose.amazonaws.com"
        },
        "Effect": "Allow",
        "Sid": ""
      }
    ]
  }
  `});

const firehose = new aws.kinesis.FirehoseDeliveryStream("firehose", {
    destination: "s3", 
    s3Configuration: {
        bucketArn: bucket.arn,
        roleArn: firehoseRole.arn
    }, 
    dependsOn: [bucket], 
})

// Export the name of the bucket
exports.bucketName = bucket.id;
exports.bucketNameTwo = bucketTwo.id; 
exports.bucketNameThree = bucketThree.id; 
exports.firehoseName = firehose.id;
