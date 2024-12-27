# [AWS S3 API Starter](https://observablehq.com/@observablehq/aws-s3-api-starter)

Get started using the Amazon Web Services SDK for S3 securely in the browser.

## Setup 
1. Create an IAM user and get [access keys](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html)
2. Add [CORS config](https://us-east-2.console.aws.amazon.com/s3/buckets/aws-test-duckdb?region=us-east-2&bucketType=general&tab=permissions) to your S3 bucket:
```json
[{
  "AllowedHeaders": [
    "Authorization",
    "amz-sdk-invocation-id",
    "amz-sdk-request",
    "x-amz-content-sha256", 
    "x-amz-date",
    "x-amz-user-agent"
  ],
  "AllowedMethods": ["GET"],
  "AllowedOrigins": ["*"],
  "MaxAgeSeconds": 3000
}]
```

## Code
```js
// Import AWS SDK using ESM.sh
const AWS = await import("https://esm.sh/@aws-sdk/client-s3")

// Set configuration
const AWS_ACCESS_KEY_ID = 'AKIAZQ3DOI2KDEX6Q5BL'
const AWS_SECRET_ACCESS_KEY = '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' 
const region = "us-east-2"
const bucket = "aws-test-duckdb"

// Initialize client
const client = new AWS.S3Client({
  region,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
  }
})

// Get bucket contents
const response = await client.send(
  new AWS.ListObjectsCommand({
    Bucket: bucket,
    MaxKeys: 100
  })
)

// Display table 
Inputs.table(response.Contents, {
  columns: ["Key", "LastModified", "Owner", "Size"],
  format: {
    Owner: d => d.DisplayName,
    Key: d => html`<a href="https://${bucket}.s3.amazonaws.com/${d.Key}">${d.Key}</a>`,
    LastModified: d => new Date(d).toLocaleString(),
    Size: d => d.toString()
  }
})
```

## References
- [AWS SDK for JavaScript v3 Documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/index.html)
- [AWS HTTP Status Dashboard](https://observablehq.com/@observablehq/aws-http-status-dashboard)
