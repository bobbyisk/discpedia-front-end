import React, { Component } from "react";
import ButtonUI from "../../components/Button/Button";
import { Table } from "reactstrap";
import { Link } from "react-router-dom";
import Axios from 'axios';
// import { API_URL } from "../../../constants/API";
import { connect } from "react-redux";
import swal from 'sweetalert';
import { fillCart } from "../../../redux/actions";
import { API_URL } from "../../../constants/API";

class Status extends React.Component {
    state = {
        activePage: "pending",
        uploadBuktiPage: false,
        idUploadBukti: 0,
        transaction: [],
        transactionDetails: [],
        buktiPict: null
    }

    getTransaction = () => {
        Axios.get(`${API_URL}/transaction/${this.props.user.id}`)
        .then(res => {
            console.log(res.data);
            this.setState({ transaction: res.data });
        })
        .catch(err => {
            console.log(err);
        })
    }
    
    getTransactionDetails = (id) => {
        Axios.get(`${API_URL}/transactionDetails/${id}`)
        .then(res => {
            console.log(res.data);
            this.setState({ transactionDetails: res.data })
        })
        .catch(err => {
            console.log(err);
        })
    }

    uploadBuktiPembayaran = (transactionId) => {
        let formData = new FormData();
        if(this.state.buktiPict) {
            formData.append(
                "file",
                this.state.buktiPict,
                this.state.buktiPict.name
              );
        }

        Axios.put(`${API_URL}/transaction/buktiPembayaran/${transactionId}`, formData)
        .then(res => {
            console.log(res.data);
            swal("Success!", "Bukti pembayaran is uploaded.", "success");
            this.getTransaction();
        })
        .catch(err => {
            console.log(err);
        })
    }

    renderTransactionDetails = () => {
        return this.state.transactionDetails.map((val, idx) => {
            const { id, price, qty, totalPrice, product } = val
            const { title, artist } = product

            return (
                <tr>
                    <td>{title}</td>
                    <td>{artist}</td>
                    <td>
                        {
                            new Intl.NumberFormat(
                            "id-ID",
                            { style: "currency", currency: "IDR" }).format(price)
                        }
                    </td>
                    <td>{qty}</td>
                    <td>
                        {
                            new Intl.NumberFormat(
                            "id-ID",
                            { style: "currency", currency: "IDR" }).format(totalPrice)
                        }
                    </td>
                </tr>
            )
        })
    }

    renderTransaction = () => {
        return this.state.transaction.map((val, idx) => {
            const { id, totalPrice, status, buyDate, buyAccDate, buktiTrf } = val;
            
            if(this.state.activePage == "pending"){
                if(val.status == "pending"){
                    return (
                        <>
                            <tr>
                                <td>{idx + 1}</td>
                                <td>
                                    {
                                    new Intl.NumberFormat(
                                    "id-ID",
                                    { style: "currency", currency: "IDR" }).format(totalPrice)
                                    }
                                </td>
                                <td>{status}</td>
                                <td>{buyDate}</td>
                                <td>{buyAccDate}</td>
                                {
                                    buktiTrf == "" ? (<td>-</td>) : (<td>Uploaded</td>)
                                }
                                <td>
                                    <ButtonUI type="contained" className='d-inline' onClick={() => this.getTransactionDetails(id)}>Details</ButtonUI>
                                    <ButtonUI 
                                        type="contained" 
                                        className='d-inline ml-2' 
                                        onClick={() => this.setState({ uploadBuktiPage: !this.state.uploadBuktiPage, idUploadBukti: id})}
                                    >
                                        Upload Bukti
                                    </ButtonUI>
                                </td>
                            </tr>
                        </>
                    )
                }
            }
        })
    }

    componentDidMount() {
        this.getTransaction();
    }

    render() {
        return (
            <>
                <div className="row m-2 d-flex justify-content-center">
                <ButtonUI type="contained" onClick={() => this.setState({ activePage: "pending" })}>Pending</ButtonUI>
                <ButtonUI type="contained" onClick={() => this.setState({ activePage: "success" })} className="ml-2">Success</ButtonUI>
                </div>
                <div className="container">
                    <h5><b>Transaction</b></h5>
                    <Table>
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Total Price</th>
                                <th>Status</th>
                                <th>Date Bought</th>
                                <th>Date Accepted</th>
                                <th>Bukti Pembayaran</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderTransaction()}
                        </tbody>
                    </Table>
                </div>
                <div className="container">
                    <h5><b>Transaction Details</b></h5>
                    <Table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Artist</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderTransactionDetails()}
                        </tbody>
                    </Table>
                </div>
                {
                    this.state.uploadBuktiPage ? (
                        <div className="container">
                            <Table>
                                <thead>
                                    <tr>
                                        <th>No.</th>
                                        <th>Upload Bukti</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{this.state.idUploadBukti}</td>
                                        <td><input type="file" onChange={(e) => this.setState({ buktiPict: e.target.files[0] })}/></td>
                                        <td><ButtonUI type="contained" onClick={() => this.uploadBuktiPembayaran(this.state.idUploadBukti)}>Submit</ButtonUI></td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                    ) : null
                }
                <div>

                </div>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
    };
};

export default connect(mapStateToProps)(Status);