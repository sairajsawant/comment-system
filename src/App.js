import React,{ Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import RegisterUser from './components/register-user.component';
import Home from './components/home-component';
import AuthUser from './components/auth-user-component';

class App extends Component{

  render(){
  return (
    <Router>
    <div className="container">
      <br/>
      <Route path="/" exact component={Home}/>
      <Route path="/register" component={RegisterUser}/>
      <Route path="/login" component={AuthUser}/>
    </div>
   </Router>
  );
  }
}

export default App;
