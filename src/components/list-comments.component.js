import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class Comment extends Component {

    constructor(props){
      super(props);
      this.upvotes = React.createRef();
      this.downvotes = React.createRef();
      this.handleUpvote = this.handleUpvote.bind(this);
      this.handleDownvote = this.handleDownvote.bind(this);

      this.state = {
        upvoted : false,
        downvoted : false
      }

    }

    handleUpvote(){
      console.log(this.props);
      const json = { type: 'upvote' };
      json.data = this.props;
      json.data.comment.upvotes++;
      console.log(json);
      this.props.socket.send(JSON.stringify(json));
      
    }

    handleDownvote(){
      this.downvotes.current.innerHTML++;
      console.log(this.downvotes.current.innerHTML);
      
    }
    render() {
      return (
      <div>
        <div className="p-1"><h5>{this.props.comment.user.firstName} {this.props.comment.user.lastName}</h5></div>
        <div>
        <h6>{this.props.comment.content }</h6>
        <div align="right">  
       <div><span ref={this.upvotes}>{this.props.comment.upvotes}</span> <button onClick={this.handleUpvote}>Upvote</button></div>
        <div><span ref={this.downvotes}>{this.props.comment.downvotes}</span>  <button onClick={this.handleDownvote}>Downvote</button></div>
        </div>
        </div>
       
      </div>
    )

    }
   
}

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
    
    const data = JSON.parse(nextProps.comment);
    console.log(data.data);
    if(data.type === "upvote"){
      let cloneComments = [...this.state.comments]
      const foundIndex = cloneComments.findIndex(x => x._id == data.data.comment._id );
      console.log(foundIndex)
      cloneComments[foundIndex] = data.data.comment
       
      this.setState({ comments : cloneComments });
    }
    else if(data.type === "comment"){
      this.setState({ comments : [data.data, ...this.state.comments] })
    }
  } 

  commentList() {  
    return this.state.comments.map(currentcomment => {
      return <Comment comment={currentcomment} socket={this.props.actions} key={currentcomment._id}/>;
    })
  }
  render() {
    return (
      <div className="d-flex flex-column">
      <h3>Comments</h3>
        { this.commentList() }
     </div>
    );
  }
}