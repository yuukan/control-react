import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import swal from 'sweetalert';
import axios from 'axios';

class ChangePass extends Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.changePass = this.changePass.bind(this);
        this.state = {
            pass: "",
            confirm: "",
            currentpass: ""
        };
    }

    handleChange(event) {
        if (event.target.name === "password") {
            this.setState({ pass: event.target.value });
        }
        if (event.target.name === "confirm") {
            this.setState({ confirm: event.target.value });
        }
        if (event.target.name === "currentpass") {
            this.setState({ currentpass: event.target.value });
        }
    };

    changePass() {
        let t = this;
        if (this.state.currentpass === "" ||this.state.pass === "" || this.state.confirm === "") {
            swal("Error", "¡Debes de ingresar todos los campos!", "error");
        } else if (this.state.pass !== this.state.confirm) {
            swal("Error", "¡Las contraseñas deben coincidir!", "error");
        } else {
            axios.post(this.props.url + "api/change-pass", {
                currentpass: this.state.currentpass,
                pass: this.state.pass,
                user: window.localStorage.getItem('tp_uid')
            })
                .then(function (response) {
                    swal("Éxito", "Contraseña cambiada correctamente.", "success");
                    t.setState({ pass: "", confirm: "" });
                })
                .catch(function (error) {
                    swal("Error", "Consulte con el administrador.", "error");
                });
        }
    }


    render() {
        return (
            <div className="main-container">
                <Typography variant="h3" component="h1" gutterBottom>
                    Cambiar Contraseña
                </Typography>
                <Card className="pass">
                    <CardContent>
                        <TextField
                            name="currentpass"
                            id="currentpass"
                            label="Contraseña Actual"
                            type="password"
                            fullWidth
                            onChange={this.handleChange}
                            value={this.state.currentpass}
                        />
                        <TextField
                            name="password"
                            id="password"
                            label="Contraseña"
                            type="password"
                            fullWidth
                            onChange={this.handleChange}
                            value={this.state.pass}
                        />
                        <TextField
                            name="confirm"
                            id="confirm"
                            label="Confirma Contraseña"
                            type="password"
                            fullWidth
                            onChange={this.handleChange}
                            value={this.state.confirm}
                        />
                        <div className="save-pass-button">
                            <Button variant="contained" color="primary" onClick={this.changePass}>
                                Guardar
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }
}
export default ChangePass;