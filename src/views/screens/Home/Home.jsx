import React, { Component } from "react";
import ButtonUI from "../../components/Button/Button";
import Card from "../../components/Card/Card";
import { Link } from "react-router-dom";
import Axios from 'axios';
// import { API_URL } from "../../../constants/API";
import { connect } from "react-redux";
import { fillCart } from "../../../redux/actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStepBackward, faFastBackward, faStepForward, faFastForward } from "@fortawesome/free-solid-svg-icons/";
import { Button } from "reactstrap";
import { Table } from "reactstrap";

const API_URL = `http://localhost:8000`;

class Home extends React.Component {
  state = {
    cdProducts: [],
    listGenre: [],
    currentPage: 1,
    cdPerPage: 3,
    totalPages: 0,
    totalElements: 0,
    minPrice: 0,
    maxPrice: 99999999,
    orderBy: "title",
    sort: "ASC",
    titleSearch: "",
    genreStart: "All"
  };

  componentDidMount() {
      this.getCdData(this.state.genreStart, this.state.currentPage);
      this.getGenreList();
      this.props.fillCart(this.props.user.id);
  }

  getCdData = (genre, currentPage) => {
      currentPage -= 1;
      
      if(genre == "All"){
        Axios.get(`${API_URL}/product/${this.state.minPrice}/${this.state.maxPrice}/${this.state.orderBy}/${this.state.sort}/?title=${this.state.titleSearch}&page=${currentPage}&size=${this.state.cdPerPage}`)
        .then(res => {
          console.log(res.data);
          this.setState({ 
            cdProducts: res.data.content,
            totalPages: res.data.totalPages,
            totalElements: res.data.totalElements,
            currentPage: res.data.number + 1 
          })
          console.log(this.state.cdProducts)
        })
        .catch(err => {
          console.log(err);
        })
      } else {
        console.log(genre)
        console.log(this.state.titleSearch)
        Axios.get(`${API_URL}/product/withGenre/${this.state.minPrice}/${this.state.maxPrice}/${this.state.orderBy}/${this.state.sort}/?title=${this.state.titleSearch}&genre=${genre}&page=${currentPage}&size=${this.state.cdPerPage}`)
        .then(res => {
          console.log(res.data);
          this.setState({ 
            cdProducts: res.data.content,
            totalPages: res.data.totalPages,
            totalElements: res.data.totalElements,
            currentPage: res.data.number + 1 
          })
        })
        .catch(err => {
          console.log(err);
        })
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

  renderCards = () => {
    return this.state.cdProducts.map((val) => {
      if(val.title.toLowerCase().includes(this.props.search.searchProduct.toLowerCase())){
        if(val.stock > 0){
          return (
            <Link style={{ textDecoration: "none", color: "inherit" }} to={`/product/${val.id}`}>
              <Card data={val} />
            </Link>
          ) 
        }
      }
    });
  };

  getGenre = (genre) => {
    this.getCdData(genre);
  }

  prevPage = () => {
    // alert(this.state.currentPage)
    if(this.state.currentPage > 1) {
      // alert(this.state.currentPage);
      // this.setState({ currentPage: this.state.currentPage - 1 });
      // alert("prev");
      this.getCdData(this.state.genreStart, this.state.currentPage - 1);
      // this.renderCards();
    }
  }

  nextPage = () => {
    if(this.state.currentPage < Math.ceil(this.state.totalElements / this.state.cdPerPage)) {
      // alert(this.stat.currentPage);
      // this.setState({ currentPage: this.state.currentPage + 1 });
      // alert("next");
      this.getCdData(this.state.genreStart, this.state.currentPage + 1);
      // this.renderCards();
    }
  }

  render() {
    return (  
      <>
        <div className="mt-2 mx-5">
          <Table>
            <thead>
                <tr>
                    <th>Category</th>
                    <th>Sort By</th>
                    <th>Search</th>
                    <th>Min. Price</th>
                    <th>Max Price</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                  <td>
                  <select 
                    className="form-control" 
                    style={{ width: "100px" }} 
                    onChange={(e) => this.setState({ genreStart: e.target.value })}
                    onClick={() =>  this.getCdData(this.state.genreStart, this.state.currentPage) }
                    value={this.state.genreStart}
                  >
                    <option selected value="All" onClick={() => this.setState({ genreStart: "All" })}>All</option>
                    {this.state.listGenre.map((val, idx) => {
                        return (
                            <option value={val.genreName}>{val.genreName}</option>
                        )
                    })}
                  </select>
                  </td>
                  <td>
                  <select 
                    className="form-control" 
                    style={{ width: "100px", display: "inline-block" }} 
                    onChange={(e) => this.setState({ orderBy: e.target.value })}
                    onClick={() =>  this.getCdData(this.state.genreStart, this.state.currentPage) }
                  >
                    <option value="title">Reset</option>
                    <option value="price">Price</option>
                  </select>
                  <select 
                    className="form-control" 
                    style={{ width: "100px", display: "inline-block" }} 
                    onChange={(e) => this.setState({ sort: e.target.value })}
                    onClick={() =>  this.getCdData(this.state.genreStart, this.state.currentPage) }
                  >
                    <option value="ASC">Ascending</option>
                    <option value="DESC">Descending</option>
                  </select>
                  </td>
                  <td>
                    <input 
                      className="form-control" 
                      type="text" 
                      style={{ width: "50%" }}
                      placeholder="Nama Product"
                      onChange={(e) => this.setState({ titleSearch: e.target.value })}
                      onKeyUp={() => this.getCdData(this.state.genreStart, this.state.currentPage)}
                    />
                  </td>
                  <td>
                    <input 
                      className="form-control" 
                      type="number" 
                      style={{ width: "50%" }}
                      placeholder="Min Price"
                      onChange={(e) => this.setState({ minPrice: e.target.value })}
                      onKeyUp={() => this.getCdData(this.state.genreStart, this.state.currentPage)} 
                    />
                  </td>
                  <td>
                    <input 
                      className="form-control" 
                      type="number" 
                      style={{ width: "50%" }}
                      placeholder="Max Price"
                      onChange={(e) => this.setState({ maxPrice: e.target.value })}
                      onKeyUp={() => this.getCdData(this.state.genreStart, this.state.currentPage)} 
                    />
                  </td>
                </tr>
            </tbody>
          </Table>
        </div>
        <div className="row mt-3 mx-5 d-flex justify-content-center">
          {this.renderCards()}
        </div>
        <div className="row mt-3 mx-5 d-flex justify-content-center">
          <ButtonUI type="contained" onClick={this.prevPage}>Prev</ButtonUI>
          <ButtonUI type="contained" className="ml-2" onClick={this.nextPage}>Next</ButtonUI>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    search: state.search
  }
}

const mapDispatchToProps = {
  fillCart
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
