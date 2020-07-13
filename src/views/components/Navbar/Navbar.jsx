import React from "react";
import { Link } from "react-router-dom";

import { connect } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons/";
import {
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
} from "reactstrap";

import { faUser } from "@fortawesome/free-regular-svg-icons";

import "./Navbar.css";
import ButtonUI from "../Button/Button";
import { logoutHandler, searchProductData } from "../../../redux/actions";

const CircleBg = ({ children }) => {
  return <div className="circle-bg">{children}</div>;
};

class Navbar extends React.Component {
  state = {
    searchBarIsFocused: false,
    searchBarInput: "",
    dropdownOpen: false,
    nama: "",
    role: "admin"
  };

  onFocus = () => {
    this.setState({ searchBarIsFocused: true });
  };

  onBlur = () => {
    this.setState({ searchBarIsFocused: false });
  };

  logoutBtnHandler = () => {
    this.props.onLogout();
    // this.forceUpdate();
  };

  toggleDropdown = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  };

  render() {
    return (
      <div className="d-flex flex-row justify-content-between align-items-center py-2 navbar-container">
        <div className="logo-text">
          <Link style={{ textDecoration: "none", color: "inherit" }} to="/">
            Discpedia
          </Link>
        </div>
        <div
          style={{ flex: 1 }}
          className="px-5 d-flex flex-row justify-content-start"
        >
          <input
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            className={`search-bar ${
              this.state.searchBarIsFocused ? "active" : null
              }`}
            type="text"
            placeholder="Search"
            onChange={(e) => this.props.onSearchBookData(e.target.value)}
          />
        </div>
        <div className="d-flex flex-row align-items-center">
          {this.props.user.id ? (
            <>
              <Dropdown
                toggle={this.toggleDropdown}
                isOpen={this.state.dropdownOpen}
              >
                <DropdownToggle tag="div" className="d-flex mt-2">
                    <FontAwesomeIcon icon={faUser} style={{ fontSize: 24 }} />
                    <p className="small ml-3 mr-4" style={{ cursor: "pointer" }}>{this.props.user.username}</p>
                </DropdownToggle>
                <DropdownMenu className="mt-2">
                  {this.props.user.role === "admin" ? (
                    <>
                      <DropdownItem>
                        <Link
                          style={{ color: "inherit", textDecoration: "none" }}
                          to="/admin/product"
                        >
                          Products
                      </Link>
                      </DropdownItem>
                      <DropdownItem>
                        <Link
                          style={{ color: "inherit", textDecoration: "none" }}
                          to="/admin/dashboard"
                        >
                          Dashboard
                      </Link>
                      </DropdownItem>
                      <DropdownItem>
                        <Link
                          style={{ color: "inherit", textDecoration: "none" }}
                          to="/admin/members"
                        >
                          Members
                      </Link>
                      </DropdownItem>
                      <DropdownItem>
                        <Link
                          style={{ color: "inherit", textDecoration: "none" }}
                          to="/admin/payments"
                        >
                          Payments
                      </Link>
                      </DropdownItem>
                      <DropdownItem>
                        <Link
                          style={{ color: "inherit", textDecoration: "none" }}
                          to="/admin/reports"
                        >
                          Reports
                      </Link>
                      </DropdownItem>
                    </>
                  ) : (
                      <>
                        <DropdownItem>
                          <Link
                            style={{ color: "inherit", textDecoration: "none" }}
                            to="/profile"
                          >
                            Profile
                          </Link>
                        </DropdownItem>
                        <DropdownItem>
                          <Link
                            style={{ color: "inherit", textDecoration: "none" }}
                            to="/history"
                          >
                            History
                          </Link>
                        </DropdownItem>
                      </>
                    )}
                </DropdownMenu>
              </Dropdown>
              <Link
                className="d-flex flex-row"
                to="/cart"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <FontAwesomeIcon
                  className="mr-2"
                  icon={faShoppingCart}
                  style={{ fontSize: 24 }}
                />
                <CircleBg>
                  <small style={{ color: "inherit", fontWeight: "bold" }}>
                    {this.props.user.cartItems}
                  </small>
                </CircleBg>
              </Link>

              <ButtonUI
                onClick={this.logoutBtnHandler}
                className="ml-3"
                type="textual"
              >
                <Link
                  to="/auth"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  Logout
                </Link>
              </ButtonUI>
            </>
          ) : (
              <>
                <ButtonUI type="contained">
                  <Link
                    style={{ textDecoration: "none", color: "inherit" }}
                    to="/auth"
                  >
                    Login / Register
                </Link>
                </ButtonUI>
              </>
            )}
        </div>
      </div>
    );
  }
}
// const mapStateToProps = (state) => {
//   return {
//     user: state.user,
//     qtycart: state.qtycart
//   };
// };
// const mapDispatchToProps = {
//   onLogout: logoutHandler,
//   onSearchProductData: searchProductData
// };

const mapStateToProps = (state) => {
  return {
    user: state.user,
    qtycart: state.qtycart
  }
}

const mapDispatchToProps = {
  onLogout: logoutHandler,
  onSearchBookData: searchProductData
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);