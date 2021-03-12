import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Select2 from 'react-select';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';


class ReporteVendedores extends Component {

    constructor() {
        super();
        this.handleChangeSelect = this.handleChangeSelect.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.generarReporte = this.generarReporte.bind(this);
        this.state = {
            vendedor: null,
            fechaInicio: new Date(),
            fechaFin: new Date(),
            report: null
        }
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleDateChange(fechaInicio) {
        this.setState({ fechaInicio });
    }
    handleDateChange2(fechaFin) {
        this.setState({ fechaFin });
    }

    generarReporte() {
        let t = this;
        axios.post(this.props.url + "api/generate-reporte", {
            vendedor: t.state.vendedor,
            inicio: t.state.fechaInicio,
            fin: t.state.fechaFin
        })
            .then(function (response) {
                t.setState({report:response.data});
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    
    //############################################################
    handleChangeSelect(option, b) {
        this.setState({ [b.name]: option });
    }
    render() {

        return (
            <div className="main-container">
                <Typography variant="h3" component="h1" gutterBottom>
                    Reporte de Vendedores
                </Typography>
                <div className="landing-container">
                    <Grid container spacing={2} justify="space-around">
                        <Grid item xs={12} sm={6} md={3} lg={3}>
                            <FormControl variant="outlined" className="form-item margin-fix2">
                                <Select2
                                    value={this.state.vendedor}
                                    isSearchable={true}
                                    onChange={this.handleChangeSelect}
                                    name="vendedor"
                                    options={this.props.vendedores}
                                    placeholder="Vendedor"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3} lg={3}>
                            <div className="date-picker">
                                <DatePicker
                                    selected={this.state.fechaInicio}
                                    onChange={date => this.handleDateChange(date)}
                                    selectsStart
                                    startDate={this.state.fechaInicio}
                                    endDate={this.state.fechaFin}
                                />
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3} lg={3}>
                            <div className="date-picker">
                                <DatePicker
                                    selected={this.state.fechaFin}
                                    onChange={date => this.handleDateChange2(date)}
                                    selectsEnd
                                    startDate={this.state.fechaInicio}
                                    endDate={this.state.fechaFin}
                                    minDate={this.state.fechaInicio}
                                />
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3} lg={3}>
                            <Button variant="contained" color="primary" disabled={this.state.disabled} className="save-btn pull-right margin-fix2" onClick={this.generarReporte}>
                                Generar Reporte
                            </Button>
                            {
                                this.state.disabled ?
                                (
                                    <div className="progress">
                                        <LinearProgress /> 
                                    </div>
                                ): ""
                            }
                        </Grid>
                    </Grid>
                </div>
                <div className="landing-container padding-bottom-separation">
                  asdfas  
                </div>
            </div>
        );
    }
}
export default ReporteVendedores;