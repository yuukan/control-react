import React, { Component } from 'react';
import { HashRouter as Router, Route } from "react-router-dom";
// Custom Components
import Landing from './components/Landing';
import Header from './components/Header';
import Home from './components/Home';
import Asignar from './components/Asignar';
import Creditos from './components/Creditos';
import List from './components/List';
import CancelList from './components/CancelList';
import ScheduleList from './components/ScheduleList';
import CreditList from './components/CreditList';
import SapReady from './components/SapReady';
import axios from 'axios';
// We import the css
import './css/App.css';

// Fontawesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars, faPrint, faEnvelope, faTrash, faSignIn } from '@fortawesome/pro-solid-svg-icons';
library.add(faBars, faPrint, faEnvelope, faTrash, faSignIn);

let url = "http://192.168.0.7:81/control/public/";

class App extends Component {
  constructor(props) {
    super(props);
    this.changeLogged = this.changeLogged.bind(this);
    this.load_orders = this.load_orders.bind(this);
    this.load_products = this.load_products.bind(this);

    this.state = {
      logged: true,
      config: null,
      clientes: [],
      productos: [],
      fletes: [],
      orders: [],
      plants: []
    };
  }

  //Function to change the logged state
  changeLogged(logged) {
    this.setState({ logged });
  }

  componentDidMount() {
    let t = this;
    axios.post(url + "api/get-clients")
      .then(function (response) {
        t.setState({ clientes: response.data });
      })
      .catch(function (error) {
        console.log(error);
      });
    // ################################################
    axios.post(url + "api/get-fletes")
      .then(function (response) {
        t.setState({ fletes: response.data });
      })
      .catch(function (error) {
        console.log(error);
      });
    // ################################################
    axios.post(url + "api/get-plants")
      .then(function (response) {
        t.setState({ plants: response.data });
      })
      .catch(function (error) {
        console.log(error);
      });
    // ################################################
    axios.post(url + "api/get-config")
      .then(function (response) {
        t.setState({ config: response.data[0] });
      })
      .catch(function (error) {
        console.log(error);
      });
    this.load_orders();
  }

  load_orders() {
    let t = this;
    // ################################################
    axios.post(url + "api/get-orders")
      .then(function (response) {
        t.setState({ orders: response.data });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  load_products(plant) {
    let t = this;
    // ################################################
    axios.post(url + "api/get-products", {
      plant
    })
      .then(function (response) {
        t.setState({ productos: response.data });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    return (
      <Router>
        <div id="main">
          <Header isLoggedIn={this.state.logged} />
          <Route exact path="/"
            render={(props) =>
              <Landing {...props}
                url={url}
                logged={this.state.logged}
                changeLogged={this.changeLogged}
                setUserInfo={this.setUserInfo}
                clientes={this.state.clientes}
                productos={this.state.productos}
                fletes={this.state.fletes}
              />} />

          <Route path="/nueva-orden"
            render={(props) =>
              <Home {...props}
                url={url}
                logged={this.state.logged}
                changeLogged={this.changeLogged}
                setUserInfo={this.setUserInfo}
                clientes={this.state.clientes}
                productos={this.state.productos}
                fletes={this.state.fletes}
                plants={this.state.plants}
                load_orders={this.load_orders}
                load_products={this.load_products}
                config={this.state.config}
              />} />

          <Route path="/order-list"
            render={(props) =>
              <List {...props}
                orders={this.state.orders}
                url={url}
                load_orders={this.load_orders}
              />} />

          <Route path="/credit-list"
            render={(props) =>
              <CreditList {...props}
                orders={this.state.orders}
                url={url}
                load_orders={this.load_orders}
              />} />

          <Route path="/new-list"
            render={(props) =>
              <ScheduleList {...props}
                orders={this.state.orders}
                url={url}
                load_orders={this.load_orders}
              />} />

          <Route path="/sap-list"
            render={(props) =>
              <SapReady {...props}
                orders={this.state.orders}
                url={url}
                load_orders={this.load_orders}
              />} />

          <Route path="/cancelled-list"
            render={(props) =>
              <CancelList {...props}
                orders={this.state.orders}
                url={url}
                load_orders={this.load_orders}
              />} />

          <Route path="/asignar/:id"
            render={(props) =>
              <Asignar {...props}
                url={url}
                fletes={this.state.fletes}
                orders={this.state.orders}
                plants={this.state.plants}
                load_orders={this.load_orders}
              />} />

          <Route path="/creditos/:id"
            render={(props) =>
              <Creditos {...props}
                url={url}
                fletes={this.state.fletes}
                orders={this.state.orders}
                plants={this.state.plants}
                load_orders={this.load_orders}
              />} />

        </div>
      </Router>
    );
  }
}

export default App;
