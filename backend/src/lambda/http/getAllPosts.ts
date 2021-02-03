import 'source-map-support/register'

import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { getAllPosts } from '../../businessLogic/post'

export const handler: APIGatewayProxyHandler = async (): Promise<APIGatewayProxyResult> => {
  
  try{
    // Get all Post items
    const posts = await getAllPosts()
    
    return {
      statusCode: 200,
      headers:{
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: posts
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

