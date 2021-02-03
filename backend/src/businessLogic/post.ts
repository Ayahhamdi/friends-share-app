import { PostsAccess } from '../dataLayer/postsAccess'
import { PostsBucketAccess } from '../s3/postsBucketAccess'

import { PostItem } from '../models/PostItem'
import { PostUpdate } from '../models/PostUpdate'

import { CreatePostRequest } from '../requests/CreatePostRequest'
import { EditPostRequest } from '../requests/EditPostRequest'

const postsAccess = new PostsAccess()
const postsBucketAccess = new PostsBucketAccess()

export async function createPost(userId: string, postId: string, newPostRequest: CreatePostRequest): Promise<PostItem> {

    const createdAt = new Date().toISOString();
    const newItem : PostItem = {
        userId: userId,
        postId: postId,
        createdAt: createdAt,
        postText: newPostRequest.postText,
        updatedAt: createdAt
    }
    return postsAccess.createNewPost(newItem)
}

export async function deletePost(userId: string, postId: string){
    return postsAccess.deletePost(userId, postId)
}

export async function generateUploadURL (userId: string, postId: string){
    const uploadedURL = await postsBucketAccess.getUploadUrl(postId)
    const attachmentUrl = await postsBucketAccess.getAttachmentURL(postId)
    const result = await postsAccess.addPostAttachmentURL(userId, postId, attachmentUrl)
    return [result, uploadedURL]
}

export async function getPostsPerUser(userId: string){
    return postsAccess.getPostsPerUser(userId)
}

export async function getAllPosts(){
    return postsAccess.getAllPosts()
}

export async function editPost (userId: string, postId: string, editPostRequest: EditPostRequest){
    
    const updatedAt = new Date().toISOString();

    const postUpdate : PostUpdate = {
        postText: editPostRequest.postText,
        updatedAt: updatedAt
    }
    return postsAccess.editPost(userId, postId, postUpdate)
}