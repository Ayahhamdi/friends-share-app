import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)

import {PostItem} from '../models/PostItem' 
import {PostUpdate} from '../models/PostUpdate'   

export class PostsAccess {

    constructor(
     private readonly docClient: DocumentClient = createDynamoDBClient(), 
     private readonly postsTable  = process.env.POSTS_TABLE,
     private readonly postIdIndex = process.env.POST_ID_INDEX) {
     }

    // Create a new Post function
    async createNewPost(newItem: PostItem) : Promise<PostItem> {
        
        await this.docClient
            .put({
            TableName: this.postsTable,
            Item: newItem
            })
            .promise()
        
        return newItem as PostItem
    }

    // Delete a post function
    async deletePost(userId: string, postId: string){

        const result = await this.docClient.query({
          TableName: this.postsTable,
          IndexName: this.postIdIndex,
          KeyConditionExpression: 'userId = :userId and postId = :postId',
          ExpressionAttributeValues: {
            ':userId': userId,
            ':postId': postId
          },
          ProjectionExpression: 'userId, createdAt'
        }).promise()
        
        if (result.$response.data && result.$response.data.Items) {
          const key = {
              userId: result.$response.data.Items[0]['userId'],
              createdAt: result.$response.data.Items[0]['createdAt']
          }
          await this.docClient.delete({
              TableName: this.postsTable,
              Key: key
          }).promise()
        }
        return result
    }

    // Generate Uploaded URL functions  
    async addPostAttachmentURL(userId: string, postId: string, attachmentUrl: string){
    
    const result = await this.docClient.query({
        TableName: this.postsTable,
        IndexName: this.postIdIndex,
        KeyConditionExpression: 'userId = :userId and postId = :postId',
        ExpressionAttributeValues: {
        ':userId': userId,
        ':postId': postId
        },
        ProjectionExpression: 'userId, createdAt'
    }).promise()
    
    if (result.$response.data && result.$response.data.Items) {
        const key = {
            userId: result.$response.data.Items[0]['userId'],
            createdAt: result.$response.data.Items[0]['createdAt']
        }
        await this.docClient.update({
            TableName: this.postsTable,
            Key: key,
            UpdateExpression: "set attachmentUrl = :attachmentUrl",
            ExpressionAttributeValues:{
            ":attachmentUrl":attachmentUrl
        },
        ReturnValues:"UPDATED_NEW"
        }).promise()
    }
    return result
    }

    // Get All Posts per user
    async getPostsPerUser(userId: string): Promise<PostItem[]>{
    const result = await this.docClient.query({
        TableName: this.postsTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
        ':userId': userId
        },
        ScanIndexForward: false
    }).promise()
    
    const items = result.Items

    return items as PostItem[]
    }

    // Get All Posts
    async getAllPosts(): Promise<PostItem[]>{
        const result = await this.docClient.scan({
            TableName: this.postsTable
        }).promise()
        
        const items = result.Items
    
        return items as PostItem[]
        }

    // Edit PostItem
    async editPost(userId: string, postId: string, postUpdate: PostUpdate){

    const result = await this.docClient.query({
        TableName: this.postsTable,
        IndexName: this.postIdIndex,
        KeyConditionExpression: 'userId = :userId and postId = :postId',
        ExpressionAttributeValues: {
        ':userId': userId,
        ':postId': postId
        },
        ProjectionExpression: 'userId, createdAt'
    }).promise()
    
    if (result.$response.data && result.$response.data.Items) {
        const key = {
            userId: result.$response.data.Items[0]['userId'],
            createdAt: result.$response.data.Items[0]['createdAt']
        }
        await this.docClient.update({
            TableName: this.postsTable,
            Key: key,
            UpdateExpression: "set postText=:postText, updatedAt=:updatedAt",
            ExpressionAttributeValues:{
            ":postText":postUpdate.postText,
            ":updatedAt":postUpdate.updatedAt,
        },
        ReturnValues:"UPDATED_NEW"
        }).promise()
    }
    return result
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
