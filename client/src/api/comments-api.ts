import { apiEndpoint } from '../config'
import { Comment } from '../types/Comment';
import { CreateCommentRequest } from '../types/CreateCommentRequest';
import Axios from 'axios'

export async function getPostComments(idToken: string, postId: string): Promise<Comment[]> {
  console.log('Fetching comments per post')

  const response = await Axios.get(`${apiEndpoint}/posts/${postId}/comments`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Comments:', response.data)
  return response.data.items
}

export async function createComment(
  idToken: string,
  postId: string,
  newComment: CreateCommentRequest
): Promise<Comment> {
  const response = await Axios.post(`${apiEndpoint}/posts/${postId}/comments`,  JSON.stringify(newComment), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function deleteComment(
  idToken: string,
  postId: string,
  commentId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/posts/${postId}/comments/${commentId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}
