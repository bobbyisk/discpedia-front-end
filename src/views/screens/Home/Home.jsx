import React, { Component } from "react";
import ButtonUI from "../../components/Button/Button";
import Card from "../../components/Card/Card";
import { Link } from "react-router-dom";
import Axios from 'axios';
// import { API_URL } from "../../../constants/API";
import { connect } from "react-redux";
import { fillCart } from "../../../redux/actions";

const API_URL = `http://localhost:8000`;

class Home extends React.Component {
  state = {
    cdProducts: []
  };

  componentDidMount() {
      this.getCdData();
      this.props.fillCart(this.props.user.id);
  }

  getCdData = (genre = 'All') => {
      let cdProductsFilter = [];
      
      Axios.get(`${API_URL}/product`)
      .then(res => {
          console.log(res.data);
          
          if(genre == 'All'){
            this.setState({ cdProducts: res.data })
          } else {
            res.data.map(val => {
              if(val.genre == genre){
                cdProductsFilter = [...cdProductsFilter, val]
              }
            })
            this.setState({cdProducts: [...cdProductsFilter]});
          }
      })
      .catch(err => {
          console.log(err);
      })
  }

  renderCards = () => {
    return this.state.cdProducts.map((val) => {
      if(val.title.toLowerCase().includes(this.props.search.searchProduct.toLowerCase())){
        return (
          <Link style={{ textDecoration: "none", color: "inherit" }} to={`/product/${val.id}`}>
            <Card data={val} />
          </Link>
        ) 
      }
    });
  };

  getGenre = (genre) => {
    this.getCdData(genre);
  }

  render() {
    return (  
      <>
        <center>
          <select className="form-control mt-3" style={{ width: "100px" }}>
            <option selected value="All" onClick={() => { this.getGenre("All") }}>All</option>
            <option value="Motivation" onClick={() => { this.getGenre("Rock n Roll") }}>Rock n Roll</option>
            <option value="Science" onClick={() => { this.getGenre("Blues") }}>Blues</option>
            <option value="Philosophy" onClick={() => { this.getGenre("Pop Punk") }}>Pop Punk</option>
            <option value="Fiction" onClick={() => { this.getGenre("Metal") }}>Metal</option>
          </select>
        </center>
        <div className="row mt-3 mx-5 d-flex justify-content-center">
          {this.renderCards()}
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
