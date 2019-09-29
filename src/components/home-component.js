import React, { Component } from 'react';
import ListComments from './list-comments.component';
import AddComment from './add-comment.component';

export default class Home extends Component {

  constructor(props){
    super(props);
    const sock = new WebSocket('ws://localhost:8080');
    sock.onopen = function() {
        console.log('open');
    };

    const self = this;
    sock.onmessage = function(e) {
        console.log(e.data);
        self.setState({ comment: e.data });

    };

    this.state = {
      actions : sock,
      comment : {}
    }
  }

  render() {
    return (
      <div className="container">
        <br/>
        < AddComment { ... this.state  }/>
        < ListComments comment={ this.state.comment }  />
      </div>
    );
  }
}