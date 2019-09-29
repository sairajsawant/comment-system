import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Comment = props => (

  <tr>
    <td>{props.comment.user.firstName} {props.comment.user.lastName}</td>
    <td>{props.comment.content }</td>
    <td>{props.comment.upvotes}  <button>Upvote</button> </td>
    <td>{props.comment.downvotes}  <button>Downvote</button> </td>
  </tr>
  
)

export default class ListComments extends Component {

  constructor(props){
    super(props);

    this.state = { comments: [] }
  }

  componentDidMount(){
    axios.get('http://localhost:5000/api/comments/')
      .then(resp => this.setState({ comments : resp.data }))
      .catch(err => console.log(err));
  }

  componentWillReceiveProps(nextProps){
    this.setState({ comments : [JSON.parse(nextProps.comment), ...this.state.comments] })
  }

  commentList() {
    return this.state.comments.map(currentcomment => {
      return <Comment comment={currentcomment} key={currentcomment._id}/>;
    })
  }
  render() {
    return (
      <div>
      <h3>Comments</h3>
      <table className="table">
          <thead className="thead-light">
            <tr>
              <th>Username</th>
              <th>Content</th>
              <th>Upvotes</th>
              <th>Downvotes</th>
            </tr>
          </thead>
          <tbody>
            { this.commentList() }
          </tbody>
        </table>
      </div>
    );
  }
}