import 'source-map-support/register'

import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createPost } from '../../businessLogic/post'

import { CreatePostRequest } from '../../requests/CreatePostRequest'
import { createLogger } from '../../utils/logger'

import * as uuid from 'uuid'

import { getUserId } from '../utils'

const logger = createLogger('auth')


export const handler : APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  // Implement creating a new POST item
  try{
  logger.info('Creating a new Post item')
  const newPostRequest: CreatePostRequest = JSON.parse(event.body)
  const userId = getUserId(event)
  const postId = uuid.v4()
  const newItem = await createPost(userId, postId, newPostRequest)

  return {
    statusCode: 201,
    headers:{
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      item :{
        ...newItem,
      }
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
