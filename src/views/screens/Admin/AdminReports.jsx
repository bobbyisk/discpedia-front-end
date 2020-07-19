import React from 'react';
import Axios from 'axios';
import ButtonUI from '../../components/Button/Button';
import { Table } from "reactstrap";

import { API_URL } from "../../../constants/API";

import { connect } from "react-redux";
import { fillCart } from "../../../redux/actions";
import { Bar } from "react-chartjs-2"

class AdminReports extends React.Component {
    state = {
        barData: {
            labels: [],
            datasets: [
                {
                    data: []
                }
            ]
        },
        // options: {
        //     scales: {
        //         xAxes: [{ barPercentage: 0.5 }]
        //     }
        // },
        listProduct: [],
        listGenre: [],
        soldCount: 0,
        searchProductData: "",
        searchArtist: "All",
        minPrice: 0,
        maxPrice: 0,
        soldInput: 0,
        genreChosen: 0
    }

    getProductList = () => {
        Axios.get(`${API_URL}/product/all`)
        .then(res => {
            console.log(res.data);
            this.setState({ listProduct: res.data.content });
            this.state.listProduct.map((val, idx) => {
                this.setState({
                    barData: {
                        labels: [...this.state.barData.labels, val.title],
                        datasets: [
                            {
                                label: 'Sold',
                                backgroundColor: `rgba(0, 0, 0)`,
                                borderColor: 'rgba(0, 0, 0)',
                                borderWidth: 1,
                                data: [...this.state.barData.datasets[0].data, val.sold]
                            }
                        ]
                    }
                })
            })
            console.log(this.state.listProduct[0].sold);
            this.getSoldCount()
        })
        .catch(err => {
            console.log(err);
        })
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

    getSoldCount = () => {
        let count = 0

        this.state.listProduct.map(val => {
            count += val.sold;
        })
        this.setState({ soldCount: count })
        console.log(count)
    }

    inputData = (e, form) => {
        this.setState({
          [form]: e
        })
        console.log(e)
    }

    componentDidMount() {
        this.getProductList();
        this.getGenreList();
        this.props.fillCart(this.props.user.id);
    }

    renderChart = () => {
        return (
            <Bar
                data={this.state.barData}
                options={{
                    title: {
                        display: true,
                        text: 'Chart',
                        fontSize: 20,
                    },
                    legend: {
                        display: true,
                        position: 'right'
                    },
                    // animation: {
                    //     duration: false
                    // }
                }}
            />
        )
    }

    renderReport = () => {
        let count = 0

        return this.state.listProduct.map((val, idx) => {
            const { id, artist, deskripsi, img, price, stock, title, sold, genre } = val

            if(!this.state.maxPrice){
                this.setState({ maxPrice: 99999999999 });
            }
            
            if
                (
                    (val.title.toLowerCase().includes(this.state.searchProductData.toLowerCase())) && 
                    (val.artist.startsWith(this.state.searchArtist) || this.state.searchArtist == "All") && 
                    (price >= this.state.minPrice && price <= this.state.maxPrice) && 
                    (sold == this.state.soldInput || !this.state.soldInput) &&
                    (genre.some(val => val.id === this.state.genreChosen) || !this.state.genreChosen)
                )
            {
                console.log(this.state.soldInput);
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
                            <td>{((sold / this.state.soldCount) * 100).toFixed(2) + "%"}</td>
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
                        <input 
                            className="form-control my-2 ml-2" 
                            type="number" 
                            placeholder="Sold" 
                            style={{ width: "200px" }} 
                            onChange={(e) => this.setState({ soldInput: e.target.value })}
                        />
                        <select 
                            className="form-control my-2 ml-2" 
                            style={{ width: "100px" }} 
                            onChange={(e) => this.inputData(e.target.value, "genreChosen")}
                            value={this.state.genreChosen}
                        >
                            <option selected value="">Select Genre</option>
                            {this.state.listGenre.map((val, idx) => {
                                return (
                                    <option value={val.id} onClick={() => this.setState({ genreChosen: val.id })}>{val.genreName}</option>
                                )
                            })}
                        </select>
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
                <center>
                    <div className="w-75">
                        {this.renderChart()}
                    </div>
                </center>
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

export default connect(mapStateToProps, mapDispatchToProps)(AdminReports);