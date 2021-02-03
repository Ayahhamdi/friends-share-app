import 'source-map-support/register'

import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createComment } from '../../businessLogic/comment'

import { CreateCommentRequest } from '../../requests/CreateCommentRequest'
import { createLogger } from '../../utils/logger'

import * as uuid from 'uuid'

import { getUserId } from '../utils'

const logger = createLogger('auth')


export const handler : APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  // Implement creating a new Comment item
  try{
  logger.info('Creating a new Comment item')
  
  const newCommentRequest: CreateCommentRequest = JSON.parse(event.body)
  const creatorId = getUserId(event)
  const commentId = uuid.v4()
  const postId = event.pathParameters.postId
  const newItem = await createComment(creatorId, commentId, postId, newCommentRequest)

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
