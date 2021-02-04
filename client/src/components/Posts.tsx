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

import { createPost, deletePost, notifyPost, getPosts, getPostsPerUser, patchPost } from '../api/posts-api'
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

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newPostName: event.target.value })
  }

  onEditButtonClick = (postId: string) => {
    this.props.history.push(`/posts/${postId}/edit`)
  }

  onPostCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const newPost = await createPost(this.props.auth.getIdToken(), {
        postText: this.state.newPostName
      })
      this.setState({
        posts: [...this.state.posts, newPost],
        newPostName: ''
      })
      
    } catch {
      alert('Post creation failed')
    }
  }

  onPostDelete = async (postId: string) => {
    try {
      await deletePost(this.props.auth.getIdToken(), postId)
    } catch {
      alert('Post deletion failed')
    }
  }

  onPostNotify = async (postId: string) => {
    try {
      await notifyPost(this.props.auth.getIdToken(), postId)
    } catch {
      alert('Post notification failed')
    }
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

        {this.renderCreatePostInput()}

        {this.renderPosts()}
      </div>
    )
  }

  renderCreatePostInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New Post',
              onClick: this.onPostCreate
            }}
            fluid
            actionPosition="left"
            placeholder="What is in your mind..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
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
                  <Dropdown.Item text='Add Photo' onClick={() => this.onEditButtonClick(post.postId)}/>
                  <Dropdown.Item text='delete' onClick={() => this.onPostDelete(post.postId)} />
                  <Dropdown.Item text='Share' onClick={() => this.onPostNotify(post.postId)} />
                  <Dropdown.Item text='Comments' onClick={() => this.onPostComments(post.postId)} />
                </Dropdown.Menu>
              </Dropdown>
            </Item>
          )
        })}
      </ItemGroup>
    )
  }
}
