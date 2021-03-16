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
import Programar from './components/Programar';
import ProcessedList from './components/ProcessedList';
import ReporteVendedores from './components/ReporteVendedores';
import axios from 'axios';
// We import the css
import './css/App.css';

// Fontawesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars, faPrint, faEnvelope, faTrash, faSignIn } from '@fortawesome/pro-solid-svg-icons';
library.add(faBars, faPrint, faEnvelope, faTrash, faSignIn);

// let url = "http://192.168.0.7:81/control/public/";
// Live
let url = window._url;
// let url = "http://2f341138.ngrok.io/control/public/";

class App extends Component {
  constructor(props) {
    super(props);
    this.changeLogged = this.changeLogged.bind(this);
    this.load_orders = this.load_orders.bind(this);
    this.load_products = this.load_products.bind(this);
    this.setUserPermissions = this.setUserPermissions.bind(this);

    this.state = {
      logged: false,
      config: null,
      clientes: [],
      productos: [],
      fletes: [],
      orders: [],
      plants: [],
      user_permissions: [],
      prices_flag: 0,
      tipo_pago: null,
      ordersProgramar:null,
      ordersSAP:null,
      vendedores: null
    };
  }

  //Function to change the logged state
  changeLogged(logged) {
    this.setState({ logged });
  }

  setUserPermissions(user_permissions) {
    this.setState({ user_permissions });
  }

  componentDidMount() {
    this.load_orders();
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
        // t.load_orders();
      })
      .catch(function (error) {
        console.log(error);
      });
    // ################################################
    axios.post(url + "api/get-tipo-pago")
      .then(function (response) {
        t.setState({ tipo_pago: response.data });
      })
      .catch(function (error) {
        console.log(error);
      });
    // ################################################
    axios.post(url + "api/get-prices-flag")
      .then(function (response) {
        if (response.data)
          t.setState({ prices_flag: response.data[0].ban === "1" });
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
    // ################################################
    axios.post(url + "api/get-vendedores")
      .then(function (response) {
        t.setState({ vendedores: response.data });
      })
      .catch(function (error) {
        console.log(error);
      });

    // We set the logged in
    let id = localStorage.getItem("tp_uid");
    let permissions = localStorage.getItem("tp_uid_per");
    if (id) {
      this.setUserPermissions(permissions.split(","));
      this.setState({ logged: true });
    }
  }

  load_orders() {
    let t = this;
    t.setState({ orders: null });
    // ################################################
    axios.post(url + "api/get-orders")
      .then(function (response) {
        t.setState({ orders: response.data });
        t.load_orders_programar();
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  load_orders_programar() {
    let t = this;
    t.setState({ ordersProgramar: null });
    // ################################################
    axios.post(url + "api/get-orders-programar")
      .then(function (response) {
        t.setState({ ordersProgramar: response.data });
        t.load_orders_subirSAP();
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  load_orders_subirSAP() {
    let t = this;
    t.setState({ ordersSAP: null });
    // ################################################
    axios.post(url + "api/get-orders-procesadas")
      .then(function (response) {
        t.setState({ ordersSAP: response.data });
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
          <Header
            isLoggedIn={this.state.logged}
            changeLogged={this.changeLogged}
            prices_flag={this.state.prices_flag}
            user_permissions={this.state.user_permissions}
          />
          {
            !this.state.logged ?
              (
                <Route path="/"
                  render={(props) =>
                    <Landing {...props}
                      url={url}
                      logged={this.state.logged}
                      changeLogged={this.changeLogged}
                      setUserPermissions={this.setUserPermissions}
                      setUserInfo={this.setUserInfo}
                      clientes={this.state.clientes}
                      productos={this.state.productos}
                      fletes={this.state.fletes}
                    />} />
              ) :
              (
                <React.Fragment>
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
                        tipo_pago={this.state.tipo_pago}
                        vendedores={this.state.vendedores}
                      />} />

                  <Route path="/order-list"
                    render={(props) =>
                      <List {...props}
                        orders={this.state.orders}
                        url={url}
                        load_orders={this.load_orders}
                        prices_flag={this.state.prices_flag}
                        user_permissions={this.state.user_permissions}
                      />} />

                  <Route path="/credit-list"
                    render={(props) =>
                      <CreditList {...props}
                        orders={this.state.orders}
                        url={url}
                        load_orders={this.load_orders}
                        prices_flag={this.state.prices_flag}
                      />} />

                  <Route path="/new-list"
                    render={(props) =>
                      <ScheduleList {...props}
                        orders={this.state.orders}
                        url={url}
                        load_orders={this.load_orders}
                        prices_flag={this.state.prices_flag}
                      />} />

                  <Route path="/to-schedule"
                    render={(props) =>
                      <Programar {...props}
                        orders={this.state.ordersProgramar}
                        url={url}
                        load_orders={this.load_orders}
                        prices_flag={this.state.prices_flag}
                      />} />

                  <Route path="/sap-list"
                    render={(props) =>
                      <SapReady {...props}
                        orders={this.state.ordersSAP}
                        url={url}
                        load_orders={this.load_orders}
                        prices_flag={this.state.prices_flag}
                      />} />

                  <Route path="/processed-list"
                    render={(props) =>
                      <ProcessedList {...props}
                        orders={this.state.orders}
                        url={url}
                        load_orders={this.load_orders}
                        prices_flag={this.state.prices_flag}
                      />} />

                  <Route path="/cancelled-list"
                    render={(props) =>
                      <CancelList {...props}
                        orders={this.state.orders}
                        url={url}
                        load_orders={this.load_orders}
                        prices_flag={this.state.prices_flag}
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
                        credito={1}
                        tipo_pago={this.state.tipo_pago}
                      />} />
                  <Route path="/detail/:id"
                    render={(props) =>
                      <Creditos {...props}
                        url={url}
                        fletes={this.state.fletes}
                        orders={this.state.orders}
                        plants={this.state.plants}
                        load_orders={this.load_orders}
                        detalle={1}
                      />} />
                  <Route path="/reporte-vendedores"
                    render={(props) =>
                      <ReporteVendedores {...props}
                        url={url}
                        plants={this.state.plants}
                        vendedores={this.state.vendedores}
                      />} />
                </React.Fragment>
              )}
        </div>
      </Router>
    );
  }
}

export default App;
