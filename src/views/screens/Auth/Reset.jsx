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

class Reset extends React.Component {
    state = {
        userData: {},
        resetForm: {
            newPassword: "",
            confirmNewPassword: "",
        }
    }

    getUser = () => {
        Axios.get(`${API_URL}/user/reset/${this.props.match.params.user_id}/${this.props.match.params.userVerif}`)
        .then(res => {
            console.log(res.data);
            this.setState({ userData: res.data });
            console.log(this.state.userData);
        })
        .catch(err => {
            console.log(err);
        })
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

    updatePassword = () => {
        if(this.state.resetForm.newPassword == this.state.resetForm.confirmNewPassword){
            let password = this.state.resetForm.newPassword;
            let userDataNew = { ...this.state.userData, password };
            Axios.put(`${API_URL}/user/reset`, userDataNew)
            .then(res => {
                swal("Success", "Password changed.", "success");
                this.setState({ 
                    resetForm: {
                        newPassword: "",
                        confirmNewPassword: "",
                    }
                })
            })
            .catch(err => {
                console.log(err)
            })
        } else {
            swal("Error!", "New password & confirm new password are not same.", "error");
        }
    }

    componentDidMount() {
        this.getUser();
    }

    render() {
        return (
            <div>
                    <center>
                        <div className="card my-5" style={{width: "500px"}}>
                            <div className="card-header"><b>Reset Password</b></div>
                            <div className="card-body">
                                <input 
                                    type="password" 
                                    className="form-control my-3" 
                                    placeholder="New Password"  
                                    value={this.state.resetForm.newPassword}
                                    onChange={(e) => this.inputHandler(e, "newPassword", "resetForm")} 
                                />
                                <input 
                                    type="password" 
                                    className="form-control my-3" 
                                    placeholder="Confirm New Password"  
                                    value={this.state.resetForm.confirmNewPassword}
                                    onChange={(e) => this.inputHandler(e, "confirmNewPassword", "resetForm")} 
                                />
                                <ButtonUI type="contained" onClick={this.updatePassword}>
                                    <Link
                                        style={{ textDecoration: "none", color: "inherit" }}
                                    > Submit
                                    </Link>
                                </ButtonUI>
                            </div>
                        </div>
                    </center>
                </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
};

export default connect(mapStateToProps)(Reset);
