import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Divider,
  Dropdown,
  Grid,
  Header,
  Input,
  Image,
  Loader,
  ItemGroup,
  Item,
  ItemContent
} from 'semantic-ui-react'

import { getPosts} from '../api/posts-api'
import Auth from '../auth/Auth'
import { Post } from '../types/Post'

interface PostsProps {
  auth: Auth
  history: History
}

interface PostsState {
  posts: Post[]
  newPostName: string
  loadingPosts: boolean
}

export class Posts extends React.PureComponent<PostsProps, PostsState> {
  state: PostsState = {
    posts: [],
    newPostName: '',
    loadingPosts: true
  }

  onPostComments = async (postId: string) => {
    this.props.history.push(`/posts/${postId}/comments`)
  }

  async componentDidMount() {
    try {
      const posts = await getPosts(this.props.auth.getIdToken())
      this.setState({
        posts,
        loadingPosts: false
      })
    } catch (e) {
      alert(`Failed to fetch posts: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Welcome in Friends share ..</Header>

        {this.renderPosts()}
      </div>
    )
  }

  renderPosts() {
    if (this.state.loadingPosts) {
      return this.renderLoading()
    }
    return this.renderPostsCards()
  }

  renderLoading() {
    return (
      <ItemGroup>
        <Loader indeterminate active inline="centered">
          Loading POSTs
        </Loader>
      </ItemGroup>
    )
  }

  renderPostsCards() {
    return (
      <ItemGroup>
        {this.state.posts.map((post, pos) => {
          return (
            <Item key={post.postId}>
              {post.attachmentUrl && (
                <Image src={post.attachmentUrl} size="large" wrapped ui={false}/>
              )}

              <Item.Content>
                <Item.Header as='a'>{post.postText}</Item.Header>
                <Item.Meta>{post.userId}</Item.Meta>
                <Item.Description>
                  {post.createdAt}
                </Item.Description>
              </Item.Content>
              <Dropdown>
                <Dropdown.Menu>
                  <Dropdown.Item text='View Comments' onClick={() => this.onPostComments(post.postId)} />
                </Dropdown.Menu>
              </Dropdown>
            </Item>
          )
        })}
      </ItemGroup>
    )
  }
}
