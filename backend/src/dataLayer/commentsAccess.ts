import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)

import {CommentItem} from '../models/CommentItem' 

export class CommentsAccess {

    constructor(
     private readonly docClient: DocumentClient = createDynamoDBClient(), 
     private readonly commentsTable  = process.env.COMMENTS_TABLE) {
     }

    // Create a new Comment function
    async createNewComment(newItem: CommentItem) : Promise<CommentItem> {
        
        await this.docClient
            .put({
            TableName: this.commentsTable,
            Item: newItem
            })
            .promise()
        
        return newItem as CommentItem
    }

    // Delete a Comment function
    async deleteComment(postId: string, commentId: string){

        const result = await this.docClient.query({
          TableName: this.commentsTable,
          KeyConditionExpression: 'postId = :postId and commentId = :commentId',
          ExpressionAttributeValues: {
            ':postId': postId,
            ':commentId': commentId
          },
          ProjectionExpression: 'postId, commentId'
        }).promise()
        
        if (result.$response.data && result.$response.data.Items) {
          const key = {
              postId: result.$response.data.Items[0]['postId'],
              commentId: result.$response.data.Items[0]['commentId']
          }
          await this.docClient.delete({
              TableName: this.commentsTable,
              Key: key
          }).promise()
        }
        return result
    }

    // Get All Comments per post
    async getCommentsPerPost(postId: string): Promise<CommentItem[]>{
    const result = await this.docClient.query({
        TableName: this.commentsTable,
        KeyConditionExpression: 'postId = :postId',
        ExpressionAttributeValues: {
        ':postId': postId
        },
        ScanIndexForward: false
    }).promise()
    
    const items = result.Items

    return items as CommentItem[]
    }


}

function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
      console.log('Creating a local DynamoDB instance')
      return new XAWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      })
    }
  
    return new XAWS.DynamoDB.DocumentClient()
  }
