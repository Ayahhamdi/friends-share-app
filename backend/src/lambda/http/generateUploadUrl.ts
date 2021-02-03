import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { generateUploadURL } from '../../businessLogic/post'

import { getUserId } from '../utils'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  // Return a presigned URL to upload a file for a Post item with the provided post id
  try{
    const postId = event.pathParameters.postId
    const userId = getUserId(event)
    let [result, uploadedUrl] = await generateUploadURL(userId, postId)


    return {
      statusCode: 201,
      headers:{
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        uploadUrl: uploadedUrl,
        items: result
      })
    }
} catch(e){
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({e})
    }
  }
}