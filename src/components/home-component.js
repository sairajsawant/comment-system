import React, { Component } from 'react';
import ListComments from './list-comments.component';
import AddComment from './add-comment.component';

export default class Home extends Component {

  render() {
    return (
      <div className="container">
        <br/>
        < AddComment />
        < ListComments />
      </div>
    );
  }
}