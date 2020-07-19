import React from 'react';
// import { API_URL } from "../../../constants/API";
import Axios from "axios";
import ButtonUI from '../../components/Button/Button';
import swal from 'sweetalert';
import { connect } from 'react-redux';
import { fillCart } from "../../../redux/actions";
import { API_URL } from '../../../constants/API';
import { Table } from "reactstrap";

class AdminGenres extends React.Component {
    state = {
        listGenre: [],
        listProduct: [],
        genreChosen: 0,
        productChosen: 0,
        genreInput: {
            genreName: ""
        }
    }

    getGenreList = () => {
        Axios.get(`${API_URL}/genre`)
        .then(res => {
            console.log(res.data);
            this.setState({ listGenre: res.data })
            console.log(this.state.listGenre)
        })
        .catch(err => {
            console.log(err);
        })
    }

    getProductList = () => {
        Axios.get(`${API_URL}/product/all`)
        .then(res => {
            console.log(res.data);
            this.setState({ listProduct: res.data.content })
            console.log(this.state.listProduct)
        })
        .catch(err => {
            console.log(err);
        })
    }

    addGenre = () => {
        Axios.post(`${API_URL}/genre`, this.state.genreInput)
        .then(res => {
            console.log(res);
            swal("Success","New genre added.","success");
            this.getGenreList(); 
            this.setState({ genreInput: {
                genreName: ""
            } })
        })
        .catch(err => {
            console.log(err);
        })
    }

    deleteGenre = (id) => {
        Axios.delete(`${API_URL}/genre/${id}`)
        .then(res => {
            console.log(res);
            swal("Success","Genre deleted.","success");
            this.getGenreList();
        })
        .catch(err => {
            console.log(err);
        })
    }

    addCategoryToProduct = () => {
        Axios.get(`${API_URL}/product`)
        .then(res => {
            console.log(res.data);
            Axios.post(`${API_URL}/product/${this.state.productChosen}/genre/${this.state.genreChosen}`)
            .then(res => {
                console.log(res.data);
                swal("Success!", "Category has been added to Products", "success");
                this.getProductList();
            })
            .catch(err => {
                console.log(err);
            })
        })
        .catch(err => {
            console.log(err);
        })
        
    }

    inputData = (e, form) => {
        this.setState({
          [form]: e
        })
        console.log(e)
    }

    inputHandler = (e, field, form) => {
        let { value } = e.target;
        this.setState({
            [form]: {
                ...this.state[form],
                [field]: value,
            },
        });
        console.log(e.target);
    };

    renderGenre = () => {
        return this.state.listGenre.map((val, idx) => {
            const { id, genreName } = val
            return (
                <>
                    <tr>
                        <td>{idx + 1}</td>
                        <td>{genreName}</td>
                        <td>{id}</td>
                        <td>
                            <ButtonUI className='d-inline ml-2' onClick={() => this.deleteGenre(id)}>Delete</ButtonUI>
                        </td>
                    </tr>
                </>
            )
        })
    }

    componentDidMount() {
        this.getGenreList();
        this.getProductList();
    }

    render() {
        return (
            <>
                <div className="container py-4">
                    <h5><b>List of Genre</b></h5>
                    <Table>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Genre</th>
                                <th>ID</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderGenre()}
                        </tbody>
                    </Table>
                    <h5 className="py-4"><b>Add Genre</b></h5>
                    <Table>
                        <thead>
                            <tr>
                                <th>Input</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <input
                                        type="text"
                                        className="m-2"
                                        value={this.state.genreInput.genreName}
                                        placeholder="Add genre"
                                        onChange={(e) => this.inputHandler(e, "genreName", "genreInput")}
                                    />
                                </td>
                                <td>
                                    <ButtonUI className='d-inline' onClick={() => this.addGenre()}>Input</ButtonUI>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                    <h5 className="py-4"><b>Add Genre to Product</b></h5>
                    <Table>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Genre</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                <select 
                                    className="form-control mt-3" 
                                    style={{ width: "100px" }} 
                                    onChange={(e) => this.inputData(e.target.value, "productChosen")}
                                    value={this.state.productChosen}
                                >
                                    <option selected value="">Select CD</option>
                                    {this.state.listProduct.map((val, idx) => {
                                        return (
                                            <option value={val.id}>{val.title}</option>
                                        )
                                    })}
                                </select>
                                </td>
                                <td>
                                <select 
                                    className="form-control mt-3" 
                                    style={{ width: "100px" }} 
                                    onChange={(e) => this.inputData(e.target.value, "genreChosen")}
                                    value={this.state.genreChosen}
                                >
                                    <option selected value="">Select Genre</option>
                                    {this.state.listGenre.map((val, idx) => {
                                        return (
                                            <option value={val.id}>{val.genreName}</option>
                                        )
                                    })}
                                </select>
                                </td>
                                <td><ButtonUI className='d-inline' onClick={this.addCategoryToProduct}>Add</ButtonUI></td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
            </>
        )
    }
}

export default AdminGenres;
