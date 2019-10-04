import React, { Component } from "react"
import axios from "axios"
import cogoToast from 'cogo-toast';

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
              cogoToast.success('Logged in successfully!', { hideAfter : 5 })
                  .then(() => window.location = '/')
            })
            .catch(err => {
              if(err.response.data.registered === false){
                const {hide} = cogoToast.error('You have not registered, click here to register!', {
                  onClick: () => {
                    hide();
                    window.location = '/register';
                  },
                })
              }
              else
                cogoToast.error('Login failed, please check your credentials & try again!', { hideAfter : 5 })
                .then(() => this.setState({username : '', password : ''}))
            });
        
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