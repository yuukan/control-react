import React, { Component } from 'react';
import { HashRouter as Router, Route } from "react-router-dom";
// Custom Components
import Landing from './components/Landing';
import Header from './components/Header';
import Home from './components/Home';
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

    this.state = {
      logged: false,
      clientes: null,
      productos: null,
      fletes: null,
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
    axios.post(url + "api/get-products")
      .then(function (response) {
        t.setState({ productos: response.data });
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

          <Route path="/home"
            render={(props) =>
              <Home {...props}
                url={url}
                logged={this.state.logged}
                changeLogged={this.changeLogged}
                setUserInfo={this.setUserInfo}
                clientes={this.state.clientes}
                productos={this.state.productos}
                fletes={this.state.fletes}
              />} />

        </div>
      </Router>
    );
  }
}

export default App;
