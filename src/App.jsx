import React from 'react';
import logo from './logo.svg';
import './App.css';
import "bootstrap/dist/css/bootstrap.css";

import { Route, Switch, withRouter } from "react-router-dom";
import Cookie from "universal-cookie";

import Home from "./views/screens/Home/Home";
import NotFound from "./views/screens/NotFound/NotFound";
import Navbar from "./views/components/Navbar/Navbar";
import Auth from './views/screens/Auth/Auth';

import { userKeepLogin, cookieChecker } from "./redux/actions";
import { connect } from "react-redux";
import Profile from './views/screens/Profile/Profile';
import AdminProducts from './views/screens/Admin/AdminProducts';
import AdminGenres from './views/screens/Admin/AdminGenres';
import ProductDetails from './views/screens/ProductDetails/ProductDetails';
import Cart from './views/screens/Cart/Cart';
import Reset from './views/screens/Auth/Reset';
import Status from './views/screens/Status/Status';


const cookieObj = new Cookie();

class App extends React.Component {
  componentDidMount() {
    setTimeout(() => {
      let cookieResult = cookieObj.get("authData", { path: "/" });
      if (cookieResult) {
        this.props.keepLogin(cookieResult);
      } else {
        this.props.cookieChecker();
      }
    }, 2000);
  }

  renderAdminRoutes = () => {
    if(this.props.user.role === "admin") {
      return (
        <>
          <Route exact path="/admin/product" component={AdminProducts} />
          <Route exact path="/admin/genre" component={AdminGenres} />
        </>
      )
    }
  }

  render() {
    if(this.props.user.cookieChecked){
      return (
        <>
          <Navbar />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/auth" component={Auth} />
            <Route exact path="/product/:productId" component={ProductDetails} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/cart" component={Cart} />
            <Route exact path="/status/:user_id" component={Status} />
            <Route exact path="/reset/:user_id/:userVerif" component={Reset} />
            {this.renderAdminRoutes()}
            <Route path="*" component={NotFound} />
          </Switch>
        </>
      );
    } else {
      return <div>Loading ...</div>;
    }
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = {
  keepLogin: userKeepLogin,
  cookieChecker,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
