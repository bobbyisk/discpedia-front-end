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

class AdminPayments extends React.Component {
    state = {
        activePage: "pending",
        uploadBuktiPage: false,
        idUploadBukti: 0,
        transaction: [],
        transactionDetails: [],
        buktiPict: null,
        rejectForm: false,
        idReject: 0,
        alasanReject: "",
        transactionDetailsAcc: []
    }

    getTransaction = () => {
        Axios.get(`${API_URL}/transaction`)
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

    acceptBuktiPembayaran = (transactionId) => {
        Axios.patch(`${API_URL}/transaction/${transactionId}/status`, {
            status: "success",
            buyAccDate: new Date().toLocaleDateString(),
            alasan: "-"
        })
        .then(res => {
            console.log(res.data);

            Axios.get(`${API_URL}/transactionDetails/${transactionId}`)
            .then(res => {
                this.getTransaction();
                console.log(res.data);
                this.setState({ transactionDetailsAcc: res.data });

                Axios.get(`${API_URL}/transactionDetails/invoice/${transactionId}`)
                .then(res => {
                    console.log(res.data);
                })
                .catch(err => {
                    console.log(err);
                })

                // this.state.transactionDetailsAcc.map((val, idx) => {
                //     Axios.patch(`${API_URL}/product/edit/${val.product.id}`, {
                //         stock: val.qty,
                //         sold: val.qty
                //     })
                //     .then(res => {
                //         console.log(res.data);
                //     })
                //     .catch(err => {
                //         console.log(err);
                //     })
                // })
            })
            .catch(err => {
                console.log(err);
            })

            swal("Success!", "Changed.", "success");
            this.renderTransaction();
        })
        .catch(err => {
            console.log(err);
        })
    }

    rejectBuktiPembayaran = (transactionId) => {
        Axios.patch(`${API_URL}/transaction/${transactionId}/status`, {
            status: "rejected",
            alasan: this.state.alasanReject
        })
        .then(res => {
            console.log(res.data);
            swal("Success!", "Changed.", "success");
            this.setState({
                rejectForm: false,
                idReject: 0,
                alasanReject: ""
            })
            this.renderTransaction();
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
            
            // if(this.state.activePage == "pending"){
            //     if(val.status == "pending"){
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
                                    
                                        { 
                                            buktiTrf != "" ? (
                                                <ButtonUI 
                                                    type="contained"    
                                                    className='d-inline ml-2' 
                                                >
                                                    <a 
                                                        href={val.buktiTrf} 
                                                        style={{ 
                                                            color: "white",
                                                            backgroundColor: "transparent",
                                                            textDecoration: "none" 
                                                        }} 
                                                        target="_blank">
                                                            Lihat Bukti
                                                    </a>
                                                </ButtonUI>
                                            ) : 
                                            (
                                                <ButtonUI 
                                                    type="contained" 
                                                    className='d-inline ml-2' 
                                                    onClick={() => alert("Bukti belum di upload oleh pembeli.")}
                                                >
                                                    Lihat Bukti
                                                </ButtonUI>
                                            ) 
                                        }
                                </td>
                                <td>
                                    { status == "sukses" ? (null) : 
                                        (
                                            <>
                                                <ButtonUI type="contained" className='d-inline' onClick={() => this.acceptBuktiPembayaran(id)}>Accept</ButtonUI>
                                                <ButtonUI type="contained" className='d-inline ml-2' onClick={() => this.setState({ rejectForm: !this.state.rejectForm, idReject: id })}>Reject</ButtonUI>
                                            </>
                                        )
                                    }
                                </td>
                            </tr>
                        </>
                    )
            //     }
            // }
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
                                <th></th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderTransaction()}
                        </tbody>
                    </Table>
                </div>
                { this.state.rejectForm == true ? (
                <div className="container">
                    <h5><b>Reject</b></h5>
                    <Table>
                        <thead>
                            <tr>
                                <th>Alasan Reject</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><input className="form-control" type="text" placeholder="Alasan" onChange={(e) => this.setState({ alasanReject: e.target.value })} /></td>
                                <td><ButtonUI type="contained" onClick={() => this.rejectBuktiPembayaran(this.state.idReject)}>Submit</ButtonUI></td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
                ) : null}
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
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
    };
};

export default connect(mapStateToProps)(AdminPayments);