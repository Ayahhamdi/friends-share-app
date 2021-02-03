import { CommentsAccess } from '../dataLayer/commentsAccess'

import { CommentItem } from '../models/CommentItem'

import { CreateCommentRequest } from '../requests/CreateCommentRequest'

const commentsAccess = new CommentsAccess()

export async function createComment(creatorId: string, commentId: string, postId: string, newCommentRequest: CreateCommentRequest): Promise<CommentItem> {

    const createdAt = new Date().toISOString();

    const newItem : CommentItem = {
        postId: postId,
        creatorId: creatorId,
        commentId: commentId,
        createdAt: createdAt,
        commentText: newCommentRequest.commentText
    }
    return commentsAccess.createNewComment(newItem)
}

export async function deleteComment(postId : string, commentId:string){
    return commentsAccess.deleteComment(postId, commentId)
}

export async function getCommentsPerPost(postId: string){
    return commentsAccess.getCommentsPerPost(postId)
}
