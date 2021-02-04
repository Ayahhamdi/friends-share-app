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
  Button, Comment, Form, Placeholder
} from 'semantic-ui-react'

import {getPostComments, createComment, deleteComment} from '../api/comments-api'
import Auth from '../auth/Auth'
import { CommentType } from '../types/CommentType'

interface CommentsProps {
  match: {
    params: {
      postId: string
    }
  }
  auth: Auth
}


interface CommentsState {
  comments: CommentType[]
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
    console.log("Change Name: "+ this.state.newCommentName)
    this.setState({ newCommentName: event.target.value })
  }

  onCommentCreate = async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      console.log("Adding Comment : "+ this.state.newCommentName)
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
      alert(`Failed to fetch comments: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h3">Comments of postNo: {this.props.match.params.postId}</Header>
        {this.renderComments()}
      </div>
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
      <Comment.Group>
        {this.state.comments.map((commentType, pos) => {
          return (
            <Comment key={commentType.commentId}>
            <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/joe.jpg' />
            <Comment.Content>
              <Comment.Author as='a'>{commentType.creatorId}</Comment.Author>
              <Comment.Metadata>
                <div>{commentType.createdAt}</div>
              </Comment.Metadata>
              <Comment.Text>{commentType.commentText}</Comment.Text>
            </Comment.Content>
          </Comment>
          )
        })}
        <Form reply>
          <Form.Input placeholder= "write a reply" value = {this.state.newCommentName} onChange={this.handleNameChange}/>
          <Button content='Add Comment' labelPosition='left' icon='edit' onClick = {this.onCommentCreate} primary />
        </Form>
      </Comment.Group>
    )
  }

}
