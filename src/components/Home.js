import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import esLocale from "date-fns/locale/es";
import DateFnsUtils from '@date-io/date-fns';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import swal from 'sweetalert';
import Select2 from 'react-select';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';


class Home extends Component {

    constructor() {
        super();
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeSelect = this.handleChangeSelect.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.agregarDetalle = this.agregarDetalle.bind(this);
        this.guardarPedido = this.guardarPedido.bind(this);
        this.delete = this.delete.bind(this);
        this.state = {
            cliente: null,
            direccion: null,
            transporte: null,
            producto: null,
            compartimiento: null,
            fechaEntrega: new Date(),
            tipoPago: null,
            fleteAplicado: 0,
            montoPorGalon: 0,
            cantidadCompartimientos: 0,
            cantidad: 0,
            detalle: [],
            exclusivo: 0,
            exclusivoid: 0,
            comentario: ""
        }
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    NoResults() {
        return "Sin Resultados";
    }

    delete(idx) {
        // console.log(idx);
        let detalle = this.state.detalle.slice(0);
        detalle.splice(idx, 1);
        this.setState({ detalle, exclusivo: 0, exclusivoid: 0 });

    }
    //############################################################
    handleChangeSelect(option, b) {
        this.setState({ [b.name]: option });

        if (b.name === "cliente") {
            this.setState({ direccion: null });
        }

        if (b.name === "transporte") {
            this.setState({ detalle: [], exclusivo: 0, exclusivoid: 0 })
        }

        if (b.name === "fleteAplicado") {
            this.setState({ transporte: null, compartimiento: null, detalle: [], exclusivo: 0, exclusivoid: 0 });
        }
    }

    handleDateChange(fechaEntrega) {
        this.setState({ fechaEntrega });
    }

    agregarDetalle() {
        // We check if we have the compartments full
        if (this.state.cantidadCompartimientos <= this.state.detalle.length && typeof this.fleteAplicado !== 'undefined' && this.fleteAplicado.value === 2) {
            swal("Error", "Ya estan ocupados todos los compartimientos del Cisterna!", "error");
            return;
        }
        if (this.state.producto === "") {
            swal("Error", "Debe de seleccionar un producto", "error");
            return;
        }
        if (this.state.cantidad === 0 || this.state.cantidad === "") {
            swal("Error", "Debe agregar la cantidad", "error");
            return;
        }
        if (this.state.compartimiento === 0 && this.state.transporte) {
            swal("Error", "Debe agregar el compartimiento", "error");
            return;
        }
        if (this.state.compartimiento) {
            if (this.state.cantidad > parseInt(this.state.compartimiento.galones)) {
                swal("Error", "El compartimiento no puede recibir más de " + this.state.compartimiento.galones + " galones", "error");
                return;
            }
        }
        let row = [];
        let exclusivo = 0, exclusivoid = 0;
        if (this.state.compartimiento) {
            row = [this.state.producto.value, this.state.cantidad, this.state.compartimiento.value, this.state.producto.label, this.state.producto.color];
        } else {
            row = [this.state.producto.value, this.state.cantidad, 0, this.state.producto.label, this.state.producto.color];
        }
        let detalle = this.state.detalle.splice(0);
        detalle.push(row);

        if (this.state.producto.exclusivo === "si") {
            exclusivo = 1;
            exclusivoid = this.state.producto.value;
        } else {
            exclusivo = 2;
        }
        this.setState({ detalle, producto: "", cantidad: 0, compartimiento: 0, exclusivo, exclusivoid });
    }

    guardarPedido() {
        let t = this.state;
        if (t.detalle.length === 0) {
            swal("Error", "Debe de ingresar el detalle de los productos del pedido!", "error");
            return;
        }
        if (t.cliente !== null && t.tipoPago !== null && t.tipoPago !== null && t.direccion !== null && t.fleteAplicado !== 0) {
            let transporte = 0;
            if (t.transporte !== null) transporte = t.transporte.id;
            axios.post(this.props.url + "api/save-order", {
                cliente: t.cliente.value,
                diaEntrega: ("0" + t.fechaEntrega.getDate()).slice(-2),
                mesEntrega: ("0" + t.fechaEntrega.getMonth()).slice(-2),
                anioEntrega: t.fechaEntrega.getFullYear(),
                hora: t.fechaEntrega.getHours(),
                minutos: t.fechaEntrega.getMinutes(),
                tipoPago: t.tipoPago.value,
                direccion: t.direccion.value,
                fleteAplicado: t.fleteAplicado.value,
                montoPorGalon: t.montoPorGalon,
                transporte: transporte,
                comentario: t.comentario,
                detalle: t.detalle
            })
                .then(function (response) {
                    t.setState({ clientes: response.data });
                })
                .catch(function (error) {
                    console.log(error);
                });
        } else {
            swal("Error", "Debe de llenar todos los campos requeridos!", "error");
        }
    }

    render() {

        let conts = [];

        let detalle = this.state.detalle;
        let trans = this.state.transporte;
        let compartimientos_select = [];
        if (trans) {
            for (let i = 0; i < trans.compartimientos.length; i++) {
                let full = "";
                let filled = 0;
                let product = "";
                let color = "transparent";
                for (let j = 0; j < detalle.length; j++) {
                    if ((i + 1) === detalle[j][2]) {
                        full = "full";
                        filled = detalle[j][1];
                        product = detalle[j][3];
                        color = detalle[j][4];
                        break;
                    }
                }
                let height = parseInt(filled) / parseInt(trans.compartimientos[i].CantidadGalones) * 100;
                let style = {
                    height: `${height}%`,
                    backgroundColor: `#${color}`
                };
                conts.push(
                    <div key={`cont${i}`} className={`cont cont${i + 1}`}>
                        <div className="number">{filled} / {trans.compartimientos[i].CantidadGalones}</div>
                        <div className="product">{product}</div>
                        <div className={`fill ${full}`} style={style}></div>
                    </div>
                );

            }
            for (let i = 0; i < trans.compartimientos.length; i++) {
                let exists = false;
                for (let j = 0; j < detalle.length; j++) {
                    if ((i + 1) === detalle[j][2]) {
                        exists = true;
                    }
                }
                if (!exists) {
                    compartimientos_select.push({ value: i + 1, label: i + 1, galones: trans.compartimientos[i].CantidadGalones });
                }
            }
        }

        // We build the addresses bar
        let addresses = [];
        let c = this.state.cliente;
        if (c) {
            if (c.address !== "") {
                addresses.push({ value: c.address, label: c.address });
            }
            if (c.MailAddres !== "" && c.MailAddres !== c.address) {
                addresses.push({ value: c.MailAddres, label: c.MailAddres });
            }
        }

        let tipos_pago = [
            { value: 1, label: "Contado" },
            { value: 2, label: "Crédito" }
        ];

        let flete_aplicado = [
            { value: 1, label: "Si" },
            { value: 2, label: "No" }
        ];

        // #################################################
        // Product Filters
        // #################################################
        let productos = "";
        if (this.props.productos) productos = this.props.productos.slice(0);

        if (this.state.exclusivo === 1) {
            let p = [];
            for (let i = 0; i < productos.length; i++) {
                if (this.state.exclusivoid === productos[i].value) {
                    p.push(productos[i]);
                }
            }
            productos = p;
        }

        if (this.state.exclusivo === 2) {
            let p = [];
            for (let i = 0; i < productos.length; i++) {
                if (productos[i].exclusivo === "") {
                    p.push(productos[i]);
                }
            }
            productos = p;
        }

        // #################################################
        // Product Filters
        // #################################################

        return (
            <div className="main-container">
                <Typography variant="h3" component="h1" gutterBottom>
                    Solicitud de Pedido
                </Typography>
                <div className="landing-container">
                    <Grid container spacing={2} justify="space-around">
                        <Grid item xs={12} sm={6} md={6} lg={3}>
                            <FormControl variant="outlined" className="form-item margin-fix2">
                                <Select2
                                    value={this.state.cliente}
                                    onChange={this.handleChangeSelect}
                                    name="cliente"
                                    options={this.props.clientes}
                                    placeholder="*Seleccione un cliente"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={3}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
                                <KeyboardDatePicker
                                    margin="normal"
                                    className="full-width"
                                    id="mui-pickers-date"
                                    label="Fecha de Entrega"
                                    value={this.state.fechaEntrega}
                                    onChange={this.handleDateChange}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={3}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
                                <KeyboardTimePicker
                                    margin="normal"
                                    className="full-width"
                                    id="mui-pickers-time"
                                    label="Hora de Carga"
                                    value={this.state.fechaEntrega}
                                    onChange={this.handleDateChange}
                                    KeyboardButtonProps={{
                                        'aria-label': 'Cambiar hora',
                                    }}
                                />
                            </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={3}>
                            <FormControl variant="outlined" className="form-item margin-fix2">
                                <Select2
                                    value={this.state.tipoPago}
                                    onChange={this.handleChangeSelect}
                                    name="tipoPago"
                                    options={tipos_pago}
                                    placeholder="*Tipo de Pago"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={3}>
                            <FormControl variant="outlined" className="form-item margin-fix2">
                                <Select2
                                    value={this.state.direccion}
                                    onChange={this.handleChangeSelect}
                                    name="direccion"
                                    options={addresses}
                                    placeholder="*Seleccione una Dirección"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={3}>
                            <FormControl variant="outlined" className="form-item margin-fix2 small">
                                <Select2
                                    value={this.state.fleteAplicado}
                                    onChange={this.handleChangeSelect}
                                    name="fleteAplicado"
                                    options={flete_aplicado}
                                    placeholder="*Flete"
                                />
                            </FormControl>
                            {
                                this.state.fleteAplicado.value === 1 ?
                                    (
                                        <TextField
                                            id="montoPorGalon"
                                            name="montoPorGalon"
                                            label="Monto por Galón"
                                            className="montoPorGalon"
                                            value={this.state.montoPorGalon}
                                            onChange={this.handleChange}
                                            margin="normal"
                                        />
                                    ) : ""
                            }
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={3}>
                            {
                                this.state.fleteAplicado.value === 1 ?
                                    (
                                        <FormControl variant="outlined" className="form-item margin-fix2">
                                            <Select2
                                                value={this.state.transporte}
                                                onChange={this.handleChangeSelect}
                                                name="transporte"
                                                options={this.props.fletes}
                                                placeholder="Seleccione un Transporte"
                                            />
                                        </FormControl>
                                    ) : ""
                            }
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={3}></Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6}>
                            <FormControl variant="outlined" className="form-item">
                                <TextField
                                    name="comentario"
                                    id="comentario"
                                    label="Comentario"
                                    multiline
                                    rowsMax="10"
                                    value={this.state.comentario}
                                    onChange={this.handleChange}
                                    margin="normal"
                                    ref={this.comentario}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6}></Grid>
                    </Grid>
                </div>
                <Typography variant="h4" component="h2" gutterBottom className="margin-separation">
                    Detalle de Productos
                </Typography>
                <div className="landing-container padding-bottom-separation">
                    {
                        this.state.fleteAplicado.value === 1 && this.state.transporte ?
                            (
                                <Grid container spacing={2} justify="space-around" className="padding-top-separation">
                                    <Grid item xs={12} sm={6} md={6} lg={6}>
                                        <h3 className="transporte-title">
                                            {this.state.transporte.label}
                                        </h3>
                                        <div className="cisterna">
                                            <div className="cisterna-circle">
                                                {conts}
                                            </div>
                                        </div>
                                    </Grid>
                                </Grid>
                            ) : ""
                    }
                    <Grid container spacing={2} justify="space-around" className="margin-separation">
                        <Grid item xs={12} sm={6} md={6} lg={3}>
                            <FormControl variant="outlined" className="form-item margin-fix2">
                                <Select2
                                    value={this.state.producto}
                                    onChange={this.handleChangeSelect}
                                    name="producto"
                                    options={productos}
                                    placeholder="Seleccione un producto"
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6} md={6} lg={3}>
                            <TextField
                                id="cantidad"
                                name="cantidad"
                                label="Cantidad"
                                className="full-width"
                                value={this.state.cantidad}
                                onChange={this.handleChange}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={3}>
                            {
                                this.state.fleteAplicado.value === 1 && this.state.transporte ?
                                    (
                                        <FormControl variant="outlined" className="form-item margin-fix2">
                                            <Select2
                                                value={this.state.compartimiento}
                                                onChange={this.handleChangeSelect}
                                                name="compartimiento"
                                                options={compartimientos_select}
                                                placeholder="Compartimiento"
                                                noOptionsMessage={this.NoResults}
                                            />
                                        </FormControl>
                                    ) : ""
                            }
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={3}>
                            <Button variant="contained" color="secondary" className="margin-fix" onClick={this.agregarDetalle}>
                                Agregar
                            </Button>
                        </Grid>

                        {detalle && detalle.length > 0
                            ? detalle.map((key, idx) => (
                                <React.Fragment key={`p${idx}`}>
                                    <Grid item xs={12} sm={6} md={6} lg={3}>
                                        {key[3]}
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} lg={3}>
                                        {key[1]}
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} lg={3}>
                                        {key[2] !== 0 ? key[2] : ""}
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} lg={3}>
                                        <Button variant="contained" color="secondary" onClick={() => this.delete(idx)}>
                                            <FontAwesomeIcon icon="trash" />
                                        </Button>
                                    </Grid>
                                </React.Fragment>
                            ))
                            : ""}

                    </Grid>
                </div>
                <Grid container spacing={2} justify="flex-end" className="padding-top-separation">
                    <Grid item xs={2} sm={2} md={2} lg={2}>
                        <Button variant="contained" color="primary" className="pull-right" onClick={this.guardarPedido}>
                            Guardar Pedido
                        </Button>
                    </Grid>
                </Grid>
            </div>
        );
    }
}
export default Home;