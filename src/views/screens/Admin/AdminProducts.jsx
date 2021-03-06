import React from 'react';
import ButtonUI from "../../components/Button/Button";
import { Table, Modal, ModalHeader, ModalBody } from "reactstrap";
import Axios from 'axios';
// import { API_URL } from "../../../constants/API";
import swal from "sweetalert";
import { connect } from "react-redux";
import { fillCart } from "../../../redux/actions";

const API_URL = `http://localhost:8000`;

class AdminProducts extends React.Component {
    state = {
        bookList: [],
        createForm: {
            title: "",
            img: "",
            artist: ""
        },
        editForm: {
            id: 0,
            title: "",
            img: "",
            artist: ""
        },
        modalOpen: false,
        selectedFile: null,
        stockLama: 0,
        stockGudangClicked: 0
    }

    getBookList = () => {
        Axios.get(`${API_URL}/product/all`)
        .then(res => {
            console.log(res.data);
            this.setState({ bookList: res.data.content});
        })
        .catch(err => {
            console.log(err);
        })
    }

    editBtnHandler = (idx) => {
        let stockSementara = this.state.bookList[idx].stock
        let stockGudangSementara = this.state.bookList[idx].stock_gudang
        // alert(stockSementara)
        // alert(stockGudangSementara)
        this.setState({ stockLama: stockSementara })
        this.setState({ stockGudangClicked: stockGudangSementara })
        this.setState({
            editForm: {
                ...this.state.bookList[idx]
            },
            modalOpen: true
        });
    }

    editBookHandler = () => {
        // alert(this.state.editForm.stock)
        // alert(this.state.stockLama + this.state.stockGudangClicked)
        
        if(
            this.state.editForm.stock_gudang < 0 ||
            this.state.editForm.stock < 0 ||
            this.state.editForm.stock > (this.state.stockLama + this.state.stockGudangClicked)
        ){
            swal("Error!", "Invalid input / overstock", "error");
        } else {
            let formData = new FormData();
    
            formData.append(
                "file",
                this.state.selectedFile,
                this.state.selectedFile.name
            );
            formData.append("productData", JSON.stringify(this.state.editForm));
    
            Axios.put(
                `${API_URL}/product/${this.state.editForm.id}/stockGudang/${this.state.editForm.stock}/${this.state.stockLama}`,
                formData
            )
                .then((res) => {
                    console.log(res.data);
                    swal("Success!", "Your item has been edited", "success");
                    this.setState({ modalOpen: false });
                    this.getBookList();
                })
                .catch((err) => {
                    swal("Error!", "Your item could not be edited", "error");
                    console.log(err);
                });
        }
    }

    deleteBtnHandler = (id) => {
        Axios.delete(`${API_URL}/product/${id}`)
            .then((res) => {
                console.log(res.data);
                swal("Success!", "Your item has been deleted", "success");
                this.getBookList();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    addBookHandler = () => {
        let formData = new FormData();

        let addData = {
            title: this.state.createForm.title,
            artist: this.state.createForm.artist,
            deskripsi: this.state.createForm.deskripsi,
            stock: this.state.createForm.stock,
            stock_gudang: this.state.createForm.stock,
            price: this.state.createForm.price
        }

        formData.append(
            "file",
            this.state.selectedFile,
            this.state.selectedFile.name
        );
        formData.append("productData", JSON.stringify(addData));

        Axios.post(`${API_URL}/product`, formData)
            .then((res) => {
                console.log(res.data);
                swal("Success!", "Your item has been added to the list", "success");
                this.setState({
                    createForm: {
                        title: "",
                        price: 0,
                        genre: "",
                        image: "",
                        desc: "",
                    },
                });
                this.getBookList();
            })
            .catch((err) => {
                console.log(err);
                swal("Error!", "Your item could not be added to the list", "error");
            });
    }
    
    toggleModal = () => {
        this.setState({ modalOpen: !this.state.modalOpen });
    };

    inputHandler = (e, field, form) => {
        let { value } = e.target;
        this.setState({
            [form]: {
                ...this.state[form],
                [field]: value,
            },
        });
    };

    fileChangeHandler = (e) => {
        this.setState({ selectedFile: e.target.files[0] });
      };

    renderBookList = () => {
        return this.state.bookList.map((val, idx) => {
            const { id, title, img, genre, artist, stock } = val
            return (
                <>
                    <tr>
                        <td>{idx + 1}</td>
                        <td>{title}</td>
                        <td>{id}</td>
                        <td>{stock}</td>
                        <td>
                            <ButtonUI className='d-inline' onClick={() => this.editBtnHandler(idx)}>Edit</ButtonUI>
                            <ButtonUI className='d-inline ml-2' onClick={() => this.deleteBtnHandler(id)}>Delete</ButtonUI>
                        </td>
                    </tr>
                </>
            )
        })
    }

    componentDidMount() {
        this.getBookList();
        this.props.fillCart(this.props.user.id);
    }

    render() {
        return (
            <>
            <div className="container py-4">
                <h5><b>Edit CD</b></h5>
                <Table>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Title</th>
                            <th>ID</th>
                            <th>Stock</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderBookList()}
                    </tbody>
                </Table>
                <Modal
                    toggle={this.toggleModal}
                    isOpen={this.state.modalOpen}
                    className="edit-modal"
                >
                    <ModalHeader toggle={this.toggleModal}>
                        <caption>
                            <h3>Edit CD</h3>
                        </caption>
                    </ModalHeader>
                    <ModalBody>
                        <div className="row">
                            <div className="col-12">
                                Title:
                                <input
                                    className="m-2"
                                    value={this.state.editForm.id}
                                    disabled
                                />
                            </div>
                            <div className="col-12">
                                Title:
                                <input
                                    className="m-2"
                                    value={this.state.editForm.title}
                                    placeholder="Title"
                                    onChange={(e) => this.inputHandler(e, "title", "editForm")}
                                />
                            </div>
                            <div className="col-12">
                                Artist:
                                <input
                                    className="m-2"
                                    value={this.state.editForm.artist}
                                    placeholder="Artist"
                                    onChange={(e) => this.inputHandler(e, "artist", "editForm")}
                                />
                            </div>
                            <div className="col-12">
                                Image:
                                <input type="file" onChange={this.fileChangeHandler} />
                                {/* <input
                                    className="m-2"
                                    value={this.state.editForm.img}
                                    placeholder="Image Source"
                                    onChange={(e) => this.inputHandler(e, "img", "editForm")}
                                /> */}
                            </div>
                            <div className="col-12">
                                Price:
                                <input
                                    type="number"
                                    className="m-2"
                                    value={this.state.editForm.price}
                                    placeholder="Price"
                                    onChange={(e) => this.inputHandler(e, "price", "editForm")}
                                />
                            </div>
                            <div className="col-12">
                                Description:
                                <input
                                    className="m-2"
                                    value={this.state.editForm.deskripsi}
                                    placeholder="Description"
                                    onChange={(e) => this.inputHandler(e, "deskripsi", "editForm")}
                                />
                            </div>
                            <div className="col-12">
                                Stock Buyer:
                                <input
                                    type="number"
                                    className="m-2"
                                    value={this.state.editForm.stock}
                                    placeholder="Stock "
                                    onChange={(e) => this.inputHandler(e, "stock", "editForm")}
                                />
                                <input
                                    type="number"
                                    className="m-2 inline"
                                    value={this.state.editForm.stock_gudang}
                                    placeholder="Stock Gudang"
                                    // onChange={(e) => this.inputHandler(e, "stock_gudang", "editForm")}
                                    disabled
                                />
                            </div>
                            <div className="col-12">
                                Stock Gudang:
                                <input
                                    type="number"
                                    className="m-2 inline"
                                    value={this.state.editForm.stock_gudang}
                                    placeholder="Stock Gudang"
                                    onChange={(e) => this.inputHandler(e, "stock_gudang", "editForm")}
                                    
                                />
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
                                    onClick={this.editBookHandler}
                                >
                                    Save
                                </ButtonUI>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
            <div className="container py-4">
                <h5><b>Input new CD</b></h5>
                <Table>
                    <thead>
                        <th></th>
                        <th>Input</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Title</td>
                            <td>
                                <input
                                    placeholder="Title"
                                    onChange={(e) => this.inputHandler(e, "title", "createForm")}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Artist</td>
                            <td>
                                <input
                                    placeholder="Artist"
                                    onChange={(e) => this.inputHandler(e, "artist", "createForm")}
                                />
                            </td>
                        </tr>
                        {/* <tr>
                            <td>Genre</td>
                            <td>
                                <input
                                    placeholder="Genre"
                                    onChange={(e) => this.inputHandler(e, "genre", "createForm")}
                                />
                            </td>
                        </tr> */}
                        <tr>
                            <td>Image</td>
                            <td>
                                <input type="file" onChange={this.fileChangeHandler} />
                                {/* <input
                                    placeholder="Sampul CD"
                                    onChange={(e) => this.inputHandler(e, "img", "createForm")}
                                /> */}
                            </td>
                        </tr>
                        <tr>
                            <td>Description</td>
                            <td>
                                <input
                                    placeholder="Description"
                                    onChange={(e) => this.inputHandler(e, "deskripsi", "createForm")}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Stock Buyer</td>
                            <td>
                                <input
                                    type="number"
                                    placeholder="Stock"
                                    onChange={(e) => this.inputHandler(e, "stock", "createForm")}
                                />
                            </td>
                        </tr>
                        {/* <tr>
                            <td>Stock Gudang</td>
                            <td>
                                <input
                                    type="number"
                                    placeholder="Stock Gudang"
                                    onChange={(e) => this.inputHandler(e, "stock_gudang", "createForm")}
                                />
                            </td>
                        </tr> */}
                        <tr>
                            <td>Price</td>
                            <td>
                                <input
                                    type="number"
                                    placeholder="Price"
                                    onChange={(e) => this.inputHandler(e, "price", "createForm")}
                                />
                            </td>
                        </tr>
                    </tbody>
                </Table>
                <ButtonUI onClick={this.addBookHandler}>Add</ButtonUI>
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

const mapDispatchToProps = {
    fillCart
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminProducts);