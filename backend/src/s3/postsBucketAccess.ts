import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'


const XAWS = AWSXRay.captureAWS(AWS)


export class PostsBucketAccess {

  constructor(
    private readonly s3 = createS3Object(),
    private readonly bucketName = process.env.POSTS_S3_BUCKET,
    private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION){

    }

   // Generate Uploaded URL functions
   async getUploadUrl(postId: string) {
    return this.s3.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: postId,
      Expires: this.urlExpiration
    })
  }

  async getAttachmentURL(postId: string){
    const attachmentUrl: string = 'https://' + this.bucketName + '.s3.amazonaws.com/' + postId 
    return attachmentUrl
  }
  
}

function createS3Object() {
  return new XAWS.S3({
    signatureVersion: 'v4'
  })
} 
  