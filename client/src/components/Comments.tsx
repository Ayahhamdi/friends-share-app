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
  Loader
} from 'semantic-ui-react'

import { createPost, deletePost, notifyPost, getPosts} from '../api/posts-api'
import {getPostComments, createComment, deleteComment} from '../api/comments-api'
import Auth from '../auth/Auth'
import { Comment } from '../types/Comment'

interface CommentsProps {
  match: {
    params: {
      postId: string
    }
  }
  auth: Auth
}


interface CommentsState {
  comments: Comment[]
  newCommentName: string
  loadingComments: boolean
}

export class Comments extends React.PureComponent<CommentsProps, CommentsState> {
  state: CommentsState = {
    comments: [],
    newCommentName: '',
    loadingComments: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newCommentName: event.target.value })
  }

  /*onEditButtonClick = (postId: string) => {
    this.props.history.push(`/posts/${postId}/edit`)
  }
*/
  onCommentCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const newComment = await createComment(this.props.auth.getIdToken(), this.props.match.params.postId, {
        commentText: this.state.newCommentName
      })
      this.setState({
        comments: [...this.state.comments, newComment],
        newCommentName: ''
      })
    } catch {
      alert('Comment creation failed')
    }
  }

  onCommentDelete = async (postId: string, commentId: string) => {
    try {
      await deleteComment(this.props.auth.getIdToken(), postId, commentId)
    } catch {
      alert('Comment deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const comments = await getPostComments(this.props.auth.getIdToken(), this.props.match.params.postId)
      this.setState({
        comments,
        loadingComments: false
      })
    } catch (e) {
      alert(`Failed to fetch posts: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">COMMENTs {this.props.match.params.postId}</Header>

        {this.renderCreateCommentInput()}

        {this.renderComments()}
      </div>
    )
  }

  renderCreateCommentInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New Comment',
              onClick: this.onCommentCreate
            }}
            fluid
            actionPosition="left"
            placeholder="Write your comment..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderComments() {
    if (this.state.loadingComments) {
      return this.renderLoading()
    }

    return this.renderCommentsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading COMMENTs
        </Loader>
      </Grid.Row>
    )
  }

  renderCommentsList() {
    return (
      <Grid padded>
        {this.state.comments.map((comment, pos) => {
          return (
            <Grid.Row key={comment.commentId}>
              <Grid.Column width={10} floated="left">
                {comment.commentText}
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {comment.createdAt}
              </Grid.Column>
              <Grid.Column width={10}>
                {comment.commentId}
              </Grid.Column>
              <Dropdown>
                <Dropdown.Menu>
                  <Dropdown.Item text='delete' onClick={() => this.onCommentDelete(comment.postId, comment.commentId)} />
                </Dropdown.Menu>
              </Dropdown>
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }
}
