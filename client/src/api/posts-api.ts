import { apiEndpoint } from '../config'
import { Post } from '../types/Post';
import Axios from 'axios'

export async function getPosts(idToken: string): Promise<Post[]> {
  console.log('Fetching posts')

  const response = await Axios.get(`${apiEndpoint}/posts`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Posts:', response.data)
  return response.data.items
}