import 'source-map-support/register'

import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { editPost } from '../../businessLogic/post'

import { EditPostRequest } from '../../requests/EditPostRequest'
import { getUserId } from '../utils'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  // Edit a POST item with the provided post id using values in the "editPostRequest" object
  try{
  const postId = event.pathParameters.postId
  const editPostRequest : EditPostRequest = JSON.parse(event.body)

  const userId = getUserId(event)
  const result = await editPost(userId, postId, editPostRequest)

  return {
    statusCode: 200,
    headers:{
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
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


