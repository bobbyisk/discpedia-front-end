import React from 'react';
// import { API_URL } from "../../../constants/API";
import Axios from "axios";
import ButtonUI from '../../components/Button/Button';
import swal from 'sweetalert';
import { connect } from 'react-redux';
import { fillCart } from "../../../redux/actions";
import { API_URL } from '../../../constants/API';

class ProductDetails extends React.Component {
    state = {
        bookProduct: [],
        cartData: [],
        stock: 0,
        stockAddToCart: 1
    }

    getBookById = () => {
        Axios.get(`${API_URL}/product/${this.props.match.params.productId}`)
        .then(res => {
            console.log(res.data);
            this.setState({ bookProduct: res.data});
            this.setState({ stock: res.data.stock});
            console.log("stock: " + this.state.stock);
        })
        .catch(err => {
            console.log(err);
        });
    }

    addToCartHandler = () => {
        if(this.props.user.id > 0){
            this.setState({ stockAddToCart: this.state.stockAddToCart + 1 });
            console.log("stockAddToCart: " + this.state.stockAddToCart);
            if(this.state.stockAddToCart > this.state.stock){
                swal(
                    "Sorry",
                    "Stock habis.",
                    "warning"
                )
            } else {
                Axios.get(`${API_URL}/cart/user/${this.props.user.id}`)
                .then(res => {
                    console.log("dibawah cart data");
                    console.log(res.data);
                    this.setState({ cartData: res.data })
    
                    let itemIndex = this.state.cartData.findIndex(val => {
                        return val.product.id == this.state.bookProduct.id
                    })
    
                    if(itemIndex >= 0) {
                        Axios.put(`${API_URL}/cart/add/${this.state.cartData[itemIndex].id}`)
                        .then(res => {
                            console.log(res.data);
                            swal(
                                "Add to cart",
                                "Item added to cart",
                                "success"
                            )
                            this.props.fillCart(this.props.user.id);
                        })
                        .catch(err => {
                            console.log(err);
                        })
                    } else {
                        Axios.post(`${API_URL}/cart/add/${this.props.user.id}/${this.state.bookProduct.id}`, {
                            qty: 1
                        })
                        .then(res => {
                            console.log(res.data);
                            swal(
                                "Add to cart",
                                "Item added to cart",
                                "success"
                            )
                            this.props.fillCart(this.props.user.id);
                        })
                        .catch(err => {
                            console.log(err);
                        })
                    }
                })
                .catch(err => {
                    alert("Error");
                    console.log(err);
                })
            }
        } else {
            swal(
                "Failed!",
                "Sign in, please.",
                "warning"
            )
        }
    }

    componentDidMount() {
        this.getBookById();
        this.props.fillCart(this.props.user.id);
    }

    render() {
        const { title, img, artist, qty, id, price, deskripsi } = this.state.bookProduct;

        return (
            <div className="container">
                <div className="row py-4">
                    <div className="col-6 text-center">
                        <img
                        style={{ width: "100%", objectFit: "contain", height: "550px" }}
                        src={img}
                        alt=""
                        />
                    </div>
                    <div className="col-6 d-flex flex-column justify-content-center">
                        <h3><b>{title}</b></h3>
                        <h5>{artist}</h5>
                        <p></p>
                        <h4>
                        {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                        }).format(price)}
                        </h4>
                        {/* <p className="mt-4">Genre: <i>{genre}</i></p> */}
                        <p className="mt-2">{deskripsi}</p>
                        {/* <TextField type="number" placeholder="Quantity" className="mt-3" /> */}
                        <div className="d-flex flex-row mt-4">
                        <ButtonUI onClick={this.addToCartHandler}>Add To Cart</ButtonUI>
                        </div>
                    </div>
                </div>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetails);