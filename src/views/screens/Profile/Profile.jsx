import React from 'react';
import { connect } from "react-redux";
import "./Profile.css";
import ButtonUI from "../../components/Button/Button";
import Axios from "axios";
import { fillCart } from "../../../redux/actions";
import swal from "sweetalert";
import { Table, Modal, ModalHeader, ModalBody } from "reactstrap";

const API_URL = `http://localhost:8000`;

class Profile extends React.Component {
    state = {
        userData: {
            id: 0,
            username: "",
            fullName: "",
            email: "",
            password: "",
            role: "",
            alamat: "",
            telp: "",
            isVerified: false,
            verifyToken: ""
        },
        editPassword: {
            oldPassword: "",
            newPassword: "",
            confirmNewPassword: ""
        },
        modalOpen: false
    }

    editPasswordBtnHandler = () => {
        this.setState ({ modalOpen: true })
    }

    getUserData = () => {
        Axios.get(`${API_URL}/user/${this.props.user.id}`)
        .then(res => {
            console.log(res.data);
            this.setState({ userData: res.data });
            console.log("userData dibawah");
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

    toggleModal = () => {
        this.setState({ modalOpen: !this.state.modalOpen });
    };

    editPasswordHandler = () => {
        const { oldPassword, newPassword, confirmNewPassword } = this.state.editPassword;
        if(newPassword == confirmNewPassword) {
            Axios.put(`${API_URL}/user/editPassword`, this.state.userData, {
                params: {
                    oldPassword,
                    newPassword
                }
            })
            .then(res => {
                console.log(res.data);
                swal("Success", "Password changed.", "success");
                this.setState({
                    editPassword: {
                        oldPassword: "",
                        newPassword: "",
                        confirmNewPassword: ""
                    },
                    modalOpen: false
                })
            })
            .catch(err => {
                console.log(err);
                swal("Error!", "Wrong old password.", "error");
            })

        } else {
            swal("Error!", "New password & confirm new password are not same.", "error");
        }
    }

    editBtnHandler = (id) => {
        Axios.put(`${API_URL}/user/${id}`, this.state.userData)
        .then(res => {
            console.log(res.data);
            swal("Success!", "Edited.", "success");
            this.getUserData();
        })
        .catch(err => {
            swal("Error!", "Failed.", "error");
            console.log(err);
        })
    }

    getUserTest = () => {
        if(this.props.user.verified){
            alert(JSON.stringify(this.props.user));
        } else {
            alert("Anda harus verifikasi email untuk dapat edit.");
        }
    }

    componentDidMount() {
        this.getUserData();
        this.props.fillCart(this.props.user.id);
    }

    render() {
        return (
            <>
                <div className="container py-4">
                    <div className="dashboard">
                        <caption className="p-3">
                            <h2>PROFILE</h2>
                        </caption>
                        <table className="dashboard-table">
                            <tbody>
                                <tr>
                                    <td><b>Username</b></td>
                                    <td>{this.props.user.username}</td>
                                </tr>
                                <tr>
                                    <td><b>Email</b></td>
                                    <td>{this.props.user.email}</td>
                                </tr>
                                <tr>
                                    <td><b>Alamat</b></td>
                                    <td>{this.props.user.alamat}</td>
                                </tr>
                                <tr>
                                    <td><b>No. Telp</b></td>
                                    <td>{this.props.user.telp}</td>
                                </tr>
                                <tr>
                                    <td><b>Verified?</b></td>
                                    <td>{this.props.user.verified.toString()}</td>
                                </tr>
                            </tbody>
                        </table>
                        <Modal
                    toggle={this.toggleModal}
                    isOpen={this.state.modalOpen}
                    className="edit-modal"
                >
                    <ModalHeader toggle={this.toggleModal}>
                        <caption>
                            <h3>Edit Book</h3>
                        </caption>
                    </ModalHeader>
                    <ModalBody>
                        <div className="row">
                            <div className="col-12">
                                <center>
                                    <input
                                        className="m-2"
                                        placeholder="Old Password"
                                        onChange={(e) => this.inputHandler(e, "oldPassword", "editPassword")}
                                        value={this.state.editPassword.oldPassword}
                                    />
                                </center>
                            </div>
                            <div className="col-12">
                                <center>
                                    <input
                                        className="m-2"
                                        placeholder="New Password"
                                        onChange={(e) => this.inputHandler(e, "newPassword", "editPassword")}
                                        value={this.state.editPassword.newPassword}
                                    />
                                </center>
                            </div>
                            <div className="col-12">
                                <center>
                                    <input
                                        className="m-2"
                                        placeholder="Confirm New Password"
                                        onChange={(e) => this.inputHandler(e, "confirmNewPassword", "editPassword")}
                                        value={this.state.editPassword.confirmNewPassword}
                                    />
                                </center>
                            </div>
                            <div className="col-5 mt-3 offset-1">
                                <ButtonUI
                                    className="w-100"
                                    onClick={this.toggleModal}
                                    type="outlined"
                                >
                                    Cancel
                                </ButtonUI>
                            </div>
                            <div className="col-5 mt-3">
                                <ButtonUI
                                    className="w-100"
                                    type="contained"
                                    onClick={this.editPasswordHandler}
                                >
                                    Save
                                </ButtonUI>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                    </div>
                    <br />
                    <div>
                        <ButtonUI className='d-inline' onClick={this.getUserTest}>Edit</ButtonUI>
                        <ButtonUI className='d-inline ml-2' onClick={this.editPasswordBtnHandler}>Edit Password</ButtonUI>
                    </div>
                </div>

                <div className="container py-4">
                    <div className="dashboard">
                        <caption className="p-3">
                            <h2>EDIT PROFILE</h2>
                        </caption>
                        <div className="m-3">
                            <b>Username</b>
                            <input type="text" className="form-control" value={this.props.user.username} placeholder="Username" disabled/>
                            <b>Email</b>
                            {this.props.user.verified ? (
                                <input type="email" className="form-control" value={this.state.userData.email} placeholder="Email" onChange={(e) => this.inputHandler(e, "email", "userData")}/>
                            ) : (
                                <input type="email" className="form-control" value={this.state.userData.email} placeholder="Email" disabled/>
                            ) }
                            
                            <b>Alamat</b>
                            <input type="text" className="form-control" value={this.state.userData.alamat} placeholder="Alamat" onChange={(e) => this.inputHandler(e, "alamat", "userData")}/>
                            <b>No. Telp.</b>
                            {this.props.user.verified ? (
                                <input type="text" className="form-control" value={this.state.userData.telp} placeholder="No. Telp." onChange={(e) => this.inputHandler(e, "telp", "userData")} />
                            ) : (
                                <input type="text" className="form-control" value={this.state.userData.telp} placeholder="No. Telp." disabled />
                            ) }
                        </div>
                        <ButtonUI className='d-inline ml-3' onClick={() => this.editBtnHandler(this.props.user.id)}>Edit</ButtonUI>
                    </div>
                </div>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
      user: state.user
    }
  }
  
const mapDispatchToProps = {
    fillCart
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
