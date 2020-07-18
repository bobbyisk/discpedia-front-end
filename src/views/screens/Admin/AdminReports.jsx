import React from 'react';
import Axios from 'axios';
import ButtonUI from '../../components/Button/Button';
import { Table } from "reactstrap";

import { API_URL } from "../../../constants/API";

class AdminReports extends React.Component {
    state = {
        listProduct: [],
        soldCount: 0,
        searchProductData: "",
        searchArtist: "All",
        minPrice: 0,
        maxPrice: 0
    }

    getProductList = () => {
        Axios.get(`${API_URL}/product/all`)
        .then(res => {
            console.log(res.data);
            this.setState({ listProduct: res.data.content });
            console.log(this.state.listProduct[0].sold);
            this.getSoldCount()
        })
        .catch(err => {
            console.log(err);
        })
    }

    getSoldCount = () => {
        let count = 0

        this.state.listProduct.map(val => {
            count += val.sold;
        })
        this.setState({ soldCount: count })
        console.log(count)
    }

    componentDidMount() {
        this.getProductList();
    }

    renderReport = () => {
        let count = 0

        return this.state.listProduct.map((val, idx) => {
            const { id, artist, deskripsi, img, price, stock, title, sold } = val

            if(!this.state.maxPrice){
                this.setState({ maxPrice: 99999999999 });
            }
            
            if
                (
                    (val.title.toLowerCase().includes(this.state.searchProductData.toLowerCase())) && 
                    (val.artist.startsWith(this.state.searchArtist) || this.state.searchArtist == "All") && 
                    (price >= this.state.minPrice && price <= this.state.maxPrice)
                )
            {
                return (
                    <>
                        <tr>
                            <td>{idx + 1}</td>
                            <td>{title}</td>
                            <td>{artist}</td>
                            <td>
                                {
                                    new Intl.NumberFormat(
                                    "id-ID",
                                    { style: "currency", currency: "IDR" }).format(price)
                                }
                            </td>
                            <td>{sold}</td>
                            <td>{(sold / this.state.soldCount) * 100 + "%"}</td>
                        </tr>
                    </>
                )
            }
        })
    }

    render() {
        return (
            <>
                <div className="container my-5">
                    <h5><b>Report</b></h5>
                    <input className="form-control my-2" type="text" placeholder="Search" onChange={(e) => this.setState({ searchProductData: e.target.value })} />
                    <div className="row m-1">
                        <select className="form-control my-2" style={{ width: "200px" }}>
                            <option selected value="All" onClick={() => { this.setState({ searchArtist: "All" }) }}>All</option>
                            <option value="Oasis" onClick={() => { this.setState({ searchArtist: "Oasis" })}}>Oasis</option>
                            <option value="The Beatles" onClick={() => { this.setState({ searchArtist: "The Beatles" })}}>The Beatles</option>
                        </select> 
                        <input 
                            className="form-control my-2 ml-2" 
                            type="number" 
                            placeholder="Min" 
                            style={{ width: "200px" }} 
                            onChange={(e) => this.setState({ minPrice: e.target.value })}
                        />
                        <input 
                            className="form-control my-2 ml-2" 
                            type="number" 
                            placeholder="Max" 
                            style={{ width: "200px" }} 
                            onChange={(e) => this.setState({ maxPrice: e.target.value })}
                        />
                    </div>

                    <Table>
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Album</th>
                                <th>Artist</th>
                                <th>Price</th>
                                <th>Sold</th>
                                <th>Sold Percentage</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderReport()}
                        </tbody>
                    </Table>
                </div>
            </>
        )
    }
}

export default AdminReports;