import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from './components/navbar.component';
import ListComments from './components/list-comments.component';
import AddComment from './components/add-comment.component';

function App() {
  return (
    <Router>
    <div className="container">
      <Navbar/>
      <Route path='/' exact component={ListComments} />
      <Route path='/add' component={AddComment} />
    </div>
   </Router>
  );
}

export default App;
