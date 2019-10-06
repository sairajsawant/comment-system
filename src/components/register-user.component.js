import React, { Component } from "react"
import axios from "axios"
import cogoToast from 'cogo-toast';


export default class RegisterUser extends Component {

    constructor(props){
        super(props);
       
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangeFirstName = this.onChangeFirstName.bind(this);
        this.onChangeLastName = this.onChangeLastName.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);

        this.onSubmit = this.onSubmit.bind(this);
    
        this.state = {
            username: '',
            firstName: '',
            lastName: '',
            password: ''
        }
      }
      onChangeUsername(e){
          this.setState({
              username : e.target.value
          });
      }

      onChangeFirstName(e){
        this.setState({
            firstName : e.target.value
        });
      }
    
      onChangeLastName(e){
        this.setState({
            lastName : e.target.value
        });
      }
      
      onChangePassword(e){
        this.setState({
            password : e.target.value
        });
      }
    onSubmit(e){
        e.preventDefault();
        const user = {
            username : this.state.username, 
            firstName : this.state.firstName,
            lastName : this.state.lastName,
            hash : this.state.password
        }
        axios.post('http://localhost:5000/api/users/register', user)
            .then(res => {
              const authData = {
                username : this.state.username,
                password : this.state.password
            }
              axios.post('http://localhost:5000/api/users/login', authData)
              .then(res => {
                console.log(res.headers['auth-header']);
                sessionStorage.setItem("jwt-token",res.headers['auth-header']);
                cogoToast.success('Logged in successfully!', { hideAfter : 3 })
                    .then(() => window.location = '/')
              })
              .catch(err => {

              });
              cogoToast.success('Welcome to the family!', { hideAfter : 3 })
                .then(() => window.location = '/')
              })
            .catch(err => console.log(err));
        
  
    }

      render() {
        return (
          <div className="container">
          <h3>Register</h3>
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
              <div className="form-group form-inline">
                <input type="text"
                    required
                    value={this.state.firstName}
                    onChange={this.onChangeFirstName}
                    placeholder="First Name"
                    className="form-control"
                    >    
                </input>
                <input type="text"
                    required
                    value={this.state.lastName}
                    onChange={this.onChangeLastName}
                    placeholder="Last Name"
                    className="form-control"
                    >    
                </input>
              </div>
              <div className="form-group">
                <input type="text"
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
                    value="Register">
                </input>
              </div>
          </form>
          </div>
        );
      }

}