import React from 'react';
import { connect } from 'react-redux';
import Axios from 'axios';
import { API_URL } from "../../../constants/API";
import { Table, Alert } from "reactstrap";
import swal from "sweetalert";
import ButtonUI from '../../components/Button/Button';
import { Link } from "react-router-dom";
import { addCartQuantity } from "../../../redux/actions/qtycart";
import { fillCart } from "../../../redux/actions";
import { priceFormatter } from "../../../supports/helpers/formatter";

class Cart extends React.Component {
    state = {
        cartData: [],
        totalPrice: 0,
        shipping: "economy",
        checkoutItems: [],
        isCheckout: false
    }

    getCartData = () => {
        let total = 0;
        Axios.get(`${API_URL}/cart/user/${this.props.user.id}`)
        .then(res => {
            console.log(res.data);
            res.data.map(val => {
                return total += val.quantity * val.product.price;
            })
            this.setState({ cartData: res.data, totalPrice: total });
        })
        .catch(err => {
            console.log(err);
        })
    }

    checkboxHandler = (e, idx) => {
        const { checked } = e.target;
    
        if (checked) {
            this.setState({ checkoutItems: [...this.state.checkoutItems, idx] })
        } else {
            this.setState({
                checkoutItems: [
                ...this.state.checkoutItems.filter((val) => val !== idx)
                ]
            })
        }
    }

    renderCartData = () => {
        return this.state.cartData.map((val, idx) => {
            const { quantity, product, id } = val;
            const { title, img, price } = product;
            return (
                <tr>
                    <td>{idx + 1}</td>
                    <td>{title}</td>
                    <td>
                    {
                        new Intl.NumberFormat(
                        "id-ID",
                        { style: "currency", currency: "IDR" }).format(price)
                    }
                    </td>
                    <td>{quantity}</td>
                    <td>
                    {" "}
                    <img
                        src={img}
                        alt=""
                        style={{ width: "100px", height: "200px", objectFit: "contain" }}
                    />{" "}
                    </td>
                    <td>
                    <ButtonUI
                        type="outlined"
                        onClick={() => this.deleteCartHandler(id)}
                    >
                        Delete Item
                    </ButtonUI>
                    </td>
                </tr>
            )
        })
    }

    renderCheckout = () => {
        let total = 0;
        return this.state.cartData.map((val, idx) => {
            const { quantity, product, id } = val;
            const { title, img, price } = product;
            total = quantity * price

            return (
                <tr>
                    <td>{idx + 1}</td>
                    <td>{title}</td>
                    <td>
                    {
                        new Intl.NumberFormat(
                        "id-ID",
                        { style: "currency", currency: "IDR" }).format(price)
                    }
                    </td>
                    <td>{quantity}</td>
                    <td>
                    {
                        new Intl.NumberFormat(
                        "id-ID",
                        { style: "currency", currency: "IDR" }).format(total)
                    }
                    </td>
                </tr>
            );
        });
    }

    renderShippingPrice = () => {
        switch(this.state.shipping) {
            case "instant": 
                return priceFormatter(50000);
            case "sameDay": 
                return priceFormatter(20000);
            case "express": 
                return priceFormatter(10000);
            default:
                return "Free";
        }
    }

    deleteCartHandler = (id) => {
        alert(id);
        Axios.delete(`${API_URL}/cart/delete/${id}`)
        .then(res => {
            console.log(res.data);
            swal('Delete item', 'Your item has been deleted from your cart', 'success');
            this.getCartData();
            this.props.fillCart(this.props.user.id);
        })
        .catch(err => {
            alert("Gagal");
            console.log(err);
        })
    }

    renderTotalPrice = () => {
        let totalPrice = 0;

        this.state.cartData.map(val => {
            const { quantity, product } = val;
            const { price } = product;

            totalPrice += quantity * price;
        });

        let shippingPrice = 0;

        switch(this.state.shipping) {
            case "instant": 
                shippingPrice = 50000;
                break;
            case "sameDay": 
                shippingPrice = 20000;
                break;
            case "express": 
                shippingPrice = 10000;
                break;
            default:
                shippingPrice = 0;
                break;
        }

        return totalPrice + shippingPrice;
    }

    confirmHandler = () => {
        Axios.post(`${API_URL}/transactions`, {
            userId: this.props.user.id,
            totalPrice: this.renderTotalPrice(),
            status: "pending",
            buyDate: new Date().toLocaleDateString(),
            buyEndDate: "-",
        })
        .then((res) => {
            console.log(res);
            this.state.cartData.map((val) => {
                Axios.post(`${API_URL}/transaction_details`, {
                    transactionId: res.data.id,
                    productId: val.product.id,
                    price: val.product.price,
                    quantity: val.quantity,
                    totalPrice: val.product.price * val.quantity
                })
                .then((res) => {
                  console.log(res);
                })
                .catch((err) => {
                  console.log(err);
                })
            })
            swal("Finished", "Thank you.", "success");
            this.state.cartData.map((val) => {
                return this.deleteCartHandler(val.id)
            });
            this.props.fillCart(this.props.user.id);
        })
        .catch((err) => {
            console.log(err);
        })
    }

    componentDidMount() {
        this.getCartData();
        this.props.fillCart(this.props.user.id);
    }

    render() {
        return (
            <div className="container py-4">
                {this.state.cartData.length > 0 ? (
                    <>
                        <Table>
                            <thead>
                                <tr>
                                <th>No.</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>img</th>
                                <th>Action</th>
                                <th></th>
                                </tr>
                            </thead>
                            <tbody>{this.renderCartData()}</tbody>
                        </Table>
                        <ButtonUI type="contained" onClick={() => this.setState({ isCheckout: true })}>Checkout</ButtonUI>
                        <br />
                        {this.state.isCheckout ? (
                            <>
                                <Table>
                                    <thead>
                                    <tr>
                                        <th>No.</th>
                                        <th>Name</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Total</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.renderCheckout()}
                                    </tbody>
                                </Table>
                                <Table>
                                    <thead>
                                    <tr>
                                        <th>Subtotal</th>
                                        <th>Shipping Price</th>
                                        <th>Total Price</th>
                                        <th>Payment Method</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>
                                        {
                                            new Intl.NumberFormat("id-ID",
                                            { style: "currency", currency: "IDR" }).format(this.state.totalPrice)
                                        }
                                        </td>
                                        <td>{this.renderShippingPrice()}</td>
                                        <td>
                                        <select
                                            className="custom-text-input"
                                            onChange={(e) => this.setState({ shipping: e.target.value })}
                                        >
                                            <option value="economy">Economy</option>
                                            <option value="express">Express</option>
                                            <option value="sameDay">Same Day</option>
                                            <option value="instant">Instant</option>
                                        </select>
                                        </td>
                                        <td>{ priceFormatter(this.renderTotalPrice())}</td>
                                    </tr>
                                    </tbody>
                                </Table>
                                <div class="custom-file mb-3">
                                    <input type="file" class="custom-file-input" id="customFile" name="filename" />
                                    <label class="custom-file-label" for="customFile">Upload bukti pembayaran</label>
                                </div>
                                <ButtonUI type="contained" onClick={() => this.confirmHandler()}>Confirm</ButtonUI>
                            </> 
                        ) : null
                        }
                    </>
                ) : (
                    <Alert>
                        Your cart is empty! <Link to="/">Go shopping</Link>
                    </Alert>
                )}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
      user: state.user,
    };
  };
  
  const mapDispatchToProps = {
    onCart: addCartQuantity,
    fillCart
  }

export default connect(mapStateToProps, mapDispatchToProps)(Cart)