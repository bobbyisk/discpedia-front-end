import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Cookies from "universal-cookie";
import swal from "sweetalert";

import { Link } from "react-router-dom";
import ButtonUI from "../../components/Button/Button";
import "./Auth.css";

// actions
import { registerHandler, loginHandler } from "../../../redux/actions";
import Axios from "axios";
import { API_URL } from "../../../constants/API";

class Auth extends React.Component {
    state = {
        activePage: "login",
        loginForm: {
            username: "",
            password: "",
            showPassword: false,
        },
        registerForm: {
            username: "",
            email: "",
            password: "",
            alamat: "",
            telp: "",
            showPassword: false,
        },
        forgotForm: {
            email: ""
        }
    }

    componentDidUpdate() {
        if (this.props.user.id) {
            swal("Success!", "Logged in.", "success");
            const cookie = new Cookies();
            cookie.set("authData", JSON.stringify(this.props.user), { path: "/" });
        }
    }

    inputHandler = (e, field, form) => {
        const { value } = e.target;
        this.setState({
            [form]: {
                ...this.state[form],
                [field]: value,
            },
        });

        console.log(e.target);
    }

    loginBtnHandler = () => {
        console.log("halo");
        const { username, password } = this.state.loginForm;
        let newUser = {
            username,
            password,
        };
        this.props.onLogin(newUser);
    };

    registerBtnHandler = () => {
        const { username, email, password, alamat, telp } = this.state.registerForm;
        let newUser = {
            username,
            email,
            password,
            alamat,
            telp
        }

        this.props.onRegister(newUser);
    }

    forgotBtnHandler = () => {
        Axios.post(`${API_URL}/user/forgot`, this.state.forgotForm)
        .then(res => {
            console.log(res.data);
            swal("Success","Link to reset password has been sent to your email.","success");
        })
        .catch(err => {
            console.log(err);
            swal("Failed","Email not found or not registered","error");
        })
    }

    renderComponent = () => {
        const { activePage } = this.state;
        if(activePage == "login"){
            return (
                <div>
                    <center>
                        <div className="card my-5" style={{width: "500px"}}>
                            <div className="card-header"><b>Login</b></div>
                            <div className="card-body">
                                <input 
                                    type="text" 
                                    className="form-control my-3" 
                                    placeholder="Username" 
                                    value={this.state.loginForm.username}
                                    onChange={(e) => this.inputHandler(e, "username", "loginForm")} 
                                />
                                <input 
                                    type="password" 
                                    className="form-control my-3" 
                                    placeholder="Password"  
                                    value={this.state.loginForm.password}
                                    onChange={(e) => this.inputHandler(e, "password", "loginForm")} 
                                />
                                <ButtonUI type="contained" onClick={this.loginBtnHandler}>
                                    <Link
                                        style={{ textDecoration: "none", color: "inherit" }}
                                        to="/auth"
                                    > Login
                                    </Link>
                                </ButtonUI>
                                {/* <p>Or <a href="">Register!</a></p> */}
                                Or register
                                <Link style={{ textDecoration: "none" }} onClick={() => this.setState({ activePage: "register"})}>
                                    &nbsp;here!
                                </Link>
                                <br />
                                <Link style={{ textDecoration: "none" }} onClick={() => this.setState({ activePage: "forgot"})}>
                                    Forgot your password?
                                </Link>
                            </div>
                        </div>
                    </center>
                </div>
            )
        } else if(activePage == "register") {
            return (
                <div>
                    <center>
                        <div className="card my-5" style={{width: "500px"}}>
                            <div className="card-header"><b>Register</b></div>
                            <div className="card-body">
                                <input 
                                    required
                                    type="text" 
                                    className="form-control my-3" 
                                    placeholder="Username" 
                                    value={this.state.registerForm.username}
                                    onChange={(e) => this.inputHandler(e, "username", "registerForm")} 
                                    
                                />
                                <input 
                                    required
                                    type="text" 
                                    className="form-control my-3" 
                                    placeholder="Email" 
                                    value={this.state.registerForm.email}
                                    onChange={(e) => this.inputHandler(e, "email", "registerForm")} 
                                />
                                <input 
                                    required
                                    type="password" 
                                    className="form-control my-3" 
                                    placeholder="Password"  
                                    value={this.state.registerForm.password}
                                    onChange={(e) => this.inputHandler(e, "password", "registerForm")} 
                                />
                                <ButtonUI type="contained" onClick={this.registerBtnHandler}>
                                    <Link
                                        style={{ textDecoration: "none", color: "inherit" }}
                                        to="/auth"
                                    > Register
                                    </Link>
                                </ButtonUI>
                                {/* <p>Or <a href="">Register!</a></p> */}
                                Or login
                                <Link style={{ textDecoration: "none" }} onClick={() => this.setState({ activePage: "login"})}>
                                    &nbsp;here!
                                </Link>
                            </div>
                        </div>
                    </center>
                </div>
            )
        } else if(activePage == "forgot"){
            return (
                <div>
                    <center>
                        <div className="card my-5" style={{width: "500px"}}>
                            <div className="card-header"><b>Forgot password</b></div>
                            <div className="card-body">
                                <input 
                                    required
                                    type="text" 
                                    className="form-control my-3" 
                                    placeholder="Email" 
                                    value={this.state.forgotForm.email}
                                    onChange={(e) => this.inputHandler(e, "email", "forgotForm")} 
                                />
                                <ButtonUI type="contained" onClick={this.forgotBtnHandler}>
                                    <Link
                                        style={{ textDecoration: "none", color: "inherit" }}
                                        to="/auth"
                                    > Send
                                    </Link>
                                </ButtonUI>
                            </div>
                        </div>
                    </center>
                </div>
            )
        }
    }

    render() {
        if(this.props.user.id > 0){
            return <Redirect to="/" />;
        }

        return (
            <>
                {this.renderComponent()}
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
      user: state.user,
    };
  };
  
  const mapDispatchToProps = {
    onRegister: registerHandler,
    onLogin: loginHandler,
  };

export default connect(mapStateToProps, mapDispatchToProps)(Auth);