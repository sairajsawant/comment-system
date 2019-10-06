import React, { Component } from 'react';
import cogoToast from 'cogo-toast';
import moment from 'moment';
import axios from 'axios';

class Comment extends Component {

    constructor(props){
      super(props);
      this.upvotes = React.createRef();
      this.downvotes = React.createRef();
      this.handleUpvoteDownvote = this.handleUpvoteDownvote.bind(this);
      this.state = {
        upvoted : false,
        downvoted : false,
        publisher : ''
      }

    }
    componentDidMount(){
      //query redis to determine user comments upvote downvote status to set state - could be optimized
      const jwt = sessionStorage.getItem("jwt-token");
      if(jwt === null){
        console.log('not logged in');
      }
      else{
        const headers = { headers: {
          "Accept": "application/json",
          "Content-type": "application/json",
          "auth-header": jwt,
          }
        }
        axios.post('http://localhost:5000/api/cache/updownstate', {'commentid' : this.props.comment._id }, headers)
          .then(resp =>{ this.setState(resp.data)})
          .catch(err => console.log(err));  
        }
    
    }

    handleUpvoteDownvote(e){
      console.log(e.target.name);
      console.log(this.props);
      const json = { type: e.target.name };
      json.data = this.props;
      console.log(json);
      const jwt = sessionStorage.getItem("jwt-token");
      if(jwt === null){
       const { hide } = cogoToast.warn('Click to login & upvote/downvote.', {
        onClick: () => {
          hide();
          window.location = '/login';
        },
      });
      }
      else {
        console.log(this.state.publisher);
        
        if(this.state.publisher == json.data.comment.user._id){
          cogoToast.error(`You cant ${e.target.name} your own comment!`, { hideAfter : 5 })
        }
        else {
        if(e.target.name === "upvote"){
          if(this.state.downvoted){
            json.data.comment.downvotes--;
            this.setState({downvoted : false});
          }
          json.data.comment.upvotes++;
          this.setState({upvoted : true});  
        }
        else {
          if(this.state.upvoted){
            json.data.comment.upvotes--;
            this.setState({upvoted : false});
          }
          json.data.comment.downvotes++;
          this.setState({downvoted : true});     
        }
        this.props.socket.send(JSON.stringify(json));
        const headers = { headers: {
          "Accept": "application/json",
          "Content-type": "application/json",
          "auth-header": jwt,
          }
        }
        // sync with mongo
        axios.put('http://localhost:5000/api/comments/update', json.data.comment, headers)
          .then(res => { 
            console.log(res);
            //sync wtih redis
            axios.put('http://localhost:5000/api/cache/updownstate', {'commentid' : json.data.comment._id, upvoted : (this.state.upvoted ? 1 : 0) }, headers)
            .then(resp => this.setState(resp.data))
            .catch(err => console.log(err));  
            
          })
          .catch(err => console.log(err));
        }
      }
    }

    render() {
      let likeimgurl = this.state.upvoted ? process.env.PUBLIC_URL + '/logos/liked.png' : process.env.PUBLIC_URL + '/logos/like.png';
      let dislikeimgurl = this.state.downvoted ? process.env.PUBLIC_URL + '/logos/disliked.png' : process.env.PUBLIC_URL + '/logos/dislike.png';
      
      return (
        <div className="card">
          <div className="row">
            <div className="col-md-10 px-3">
              <div className="card-block px-3">
                <h5 className="card-title text-dark" style={{marginTop: '10px', 'fontWeight':'bolder'}}>{this.props.comment.user.firstName} {this.props.comment.user.lastName}</h5>
                <p className="card-text" style={{fontSize: '16px'}}>{this.props.comment.content }</p>
                <p className="text-muted" style={{fontSize: '13px'}}><img src={process.env.PUBLIC_URL + '/logos/clock.png'} style={{width: '13px', height: '13px'}} />&nbsp;&nbsp;{moment(Date.parse(this.props.comment.createdAt)).fromNow()}</p>
              </div>
            </div>
            <div className="col-md-2 px-3">
              <div>
                <br/>
                <div> <input type="image" disabled={this.state.upvoted} onClick={this.handleUpvoteDownvote} name="upvote" src={likeimgurl}  alt="upvote" width="30" height="30" /><span ref={this.upvotes} style={{fontSize: '16px', 'fontWeight': 'bolder', 'verticalAlign':'6px'}}>&nbsp;&nbsp;&nbsp;{this.props.comment.upvotes}</span> </div>
                <div> <input type="image" disabled={this.state.downvoted} onClick={this.handleUpvoteDownvote} name="downvote" src={dislikeimgurl}  alt="downvote" width="30" height="30" /><span ref={this.downvotes} style={{fontSize: '16px', 'fontWeight': 'bolder', 'verticalAlign':'6px'}}>&nbsp;&nbsp;&nbsp;{this.props.comment.downvotes}</span><br/></div>   
              </div>
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
    if(data.type === "upvote" || data.type === "downvote"){
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