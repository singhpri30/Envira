import React, { Component } from 'react'
import "./style.css";
import { Auth } from "aws-amplify";
import Axios from 'axios';
import FormErrors from "../FormErrors";
import Validate from "../../util/FormValidation";

export default class Register extends Component {

  state = {
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    role: "select",
    isLoading: false,
    confirmationCode: "",
    newUser: null,
    ErrorMessage: "",
    errors: {
      cognito: null,
      blankfield: false,
      passwordmatch: false,
    }
  }

  clearErrorState = () => {
    this.setState({
      errors: {
        cognito: null,
        blankfield: false,
        passwordmatch: false
      }
    });
  }

  emailErrorMessage(message) {
    this.setState({
      ErrorMessage: message
    });
    setTimeout(() => {
      this.setState({
        ErrorMessage: ''
      });
    }, 4000)
  }

  handleInputChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    this.setState({
      [name]: value
    })
    document.getElementById(e.target.id).classList.remove("is-invalid");
  }

  handleFormSubmit = (event) => {
    event.preventDefault();

    // Form validation
    this.clearErrorState();
    const error = Validate(event, this.state);
    if (error) {
      this.setState({
        errors: { ...this.state.errors, ...error }
      });
    }
    else {
      this.postNewUser();
    }
  };

  userSignup = async () => {
    this.setState({ isLoading: true });
    const { username, email, password } = this.state;
    try {
      const newUser = await Auth.signUp({
        username,
        password,
        attributes: {
          email: email
        }
      });
      this.setState({ newUser })
    } catch (error) {
      let err = null;
      !error.message ? err = { "message": error } : err = error;
      console.log(err);
      this.setState({
        errors: {
          ...this.state.errors,
          cognito: err
        }
      });
    }
  }

  postNewUser = () => {
    Axios.post("/api/auth/signup", {
      username: this.state.username,
      role: this.state.role,
      email: this.state.email
    })
      .then((res) => {
        this.userSignup();
      })
      .catch((err) => {
        this.emailErrorMessage('Email address or user name already in use');

      })
  }

  handleConfirmationSubmit = async event => {
    event.preventDefault();
    this.setState({ isLoading: true });
    try {
      await Auth.confirmSignUp(this.state.username, this.state.confirmationCode);
      await Auth.signIn(this.state.username, this.state.password);
      window.location = "/"
    } catch (e) {
      alert(e.message);
      this.setState({ isLoading: false });
    }
  };

  renderConfirmationForm() {
    return (
      <>
        <div className="container mt-5 ">
          <div className="row justify-content-center align-items-center">
            <div className="col-md-6 border mt-2 shadow-lg p-3 mb-5 bg-white rounded">
              <h6 className="text-center">Please check your email for the confirmation code.</h6>
              <div className="col-md-12 mt-3">
                <form onSubmit={this.handleConfirmationSubmit}>
                  <div className="form-group input-group justify-content-center mt-2">
                    <label htmlFor="confirmationCode" className="mr-1">Confirmation Code:</label>
                    <input id="confirmationcode" name="confirmationCode" type="tel" value={this.state.confirmationCode} onChange={this.handleInputChange} required />
                  </div>
                  <div className="form-group mx-auto text-center">
                    <button type="submit" className="btn btn-primary btn-md">Submit</button>
                  </div>
                </form>
              </div>

            </div>
          </div>
        </div>
      </>
    );
  }

  renderForm() {
    return <>
      <div className="container form-size register border-style-signup">
        <div className="row text-center justify-content-center">
          <div className="col-md-10">
            <div className="card cardStyle bg-light">
              <div className="card-body">
                <h4 className="card-title mt-3 text-center">Registration</h4>
                <FormErrors formerrors={this.state.errors} />
                <div className="text-danger">{this.state.ErrorMessage}</div>
                <form onSubmit={this.handleFormSubmit}>
                  <div className="form-group input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text"> <i className="fa fa-user"></i> </span>
                    </div>
                    <input id="username" name="username" value={this.state.username} onChange={this.handleInputChange} className="form-control" placeholder="User name" type="text" />
                  </div>

                  <div className="form-group input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text"> <i className="fa fa-envelope"></i> </span>
                    </div>
                    <input id="email" name="email" value={this.state.email} onChange={this.handleInputChange} className="form-control" placeholder="Email address" type="email" />
                  </div>

                  <div className="form-group input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text"> <i className="fa fa-building"></i> </span>
                    </div>
                    <select id="role" name="role" value={this.state.role} onChange={this.handleInputChange} className="form-control">
                      <option value="select">Select a registration type</option>
                      <option value="1">Individual</option>
                      <option value="2">Company</option>
                      <option value="3">Non-Profit</option>
                    </select>
                  </div>

                  <div className="form-group input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text"> <i className="fa fa-lock"></i> </span>
                    </div>
                    <input id="password" name="password" value={this.state.password} onChange={this.handleInputChange} className="form-control" placeholder="Create password" type="password" />
                  </div>

                  <div className="form-group input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text"> <i className="fa fa-lock"></i> </span>
                    </div>
                    <input id="confirmpassword" name="confirmPassword" value={this.state.confirmPassword} onChange={this.handleInputChange} className="form-control" placeholder="Confirm password" type="password" />
                  </div>
                  <div className="form-group mx-auto text-center">
                    <button type="submit" className="btn border-0 btn-primary btn-lg create-btn text-dark"> Create Account  </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  }

  render() {
    return (
      <div className="Signup">{this.state.newUser === null ? this.renderForm() : this.renderConfirmationForm()}</div>
    );
  }
}
