import React, { Component } from "react"
import axios from "axios"

export default class AuthUser  extends Component {

    constructor(props){
        super(props);
       
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);

        this.onSubmit = this.onSubmit.bind(this);
    
        this.state = {
            username: '',
            password: ''
        }
      }
      onChangeUsername(e){
          this.setState({
              username : e.target.value
          });
      }

      onChangePassword(e){
        this.setState({
            password : e.target.value
        });
      }
    onSubmit(e){
        e.preventDefault();
        const authData = {
            username : this.state.username,
            password : this.state.password
        }
        console.log(authData);
        axios.post('http://localhost:5000/api/users/login', authData)
            .then(res => {
              console.log(res.headers['auth-header']);
              sessionStorage.setItem("jwt-token",res.headers['auth-header']);
              window.location = '/';
            })
            .catch(err => console.log(err));
        
      }
      render() {
        return (
          <div className="container">
          <h3>Login</h3>
          <form onSubmit={this.onSubmit} >
              <div className="form-group">
                <input type="text"
                    required
                    value={this.state.username}
                    onChange={this.onChangeUsername}
                    placeholder="Username"
                    className="form-control"
                    >    
                </input>
              </div>
              <div className="form-group">
                <input type="password"
                    required
                    value={this.state.password}
                    onChange={this.onChangePassword}
                    minLength = "8"
                    placeholder="Password"
                    className="form-control"
                    >    
                </input>
              </div>
              <div className="form-group" align="right">
                <input type="submit"
                    className="btn btn-dark"
                    value="Login">
                </input>
              </div>
          </form>
          </div>
        );
      }

}