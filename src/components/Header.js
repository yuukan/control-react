import React, { Component } from 'react';
import { Link } from "react-router-dom";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { LocalShipping, ListAltTwoTone, CheckBox, Schedule, Report } from '@material-ui/icons';
import Button from '@material-ui/core/Button';
import swal from 'sweetalert';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import axios from 'axios';

class Header extends Component {
    constructor(props) {
        super(props);
        this.handleDrawerClose = this.handleDrawerClose.bind(this);
        this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
        this.changeIndex = this.changeIndex.bind(this);
        this.logOut = this.logOut.bind(this);
        this.handleMenu = this.handleMenu.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.cambiarContrasena = this.cambiarContrasena.bind(this);
        this.state = {
            selectedIndex: 1,
            openDrawer: false,
            anchorEl: null
        };
    }

    handleMenu(event) {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose() {
        this.setState({ anchorEl: null });
    };

    cambiarContrasena() {
        swal({
            text: 'Ingrese su nueva contraseña',
            content: "input",
            button: {
                text: "Cambiar Contraseña",
                closeModal: false,
            },
        })
            .then(pass => {
                if (!pass){
                    swal("Error", "La contraseña no puede estar vacía.", "error");
                    return null;
                }
                axios.post(this.props.url + "api/change-pass", {
                    pass,
                    user: window.localStorage.getItem('tp_uid')
                })
                    .then(function (response) {
                        swal("Éxito", "Contraseña cambiada correctamente.", "success");
                    })
                    .catch(function (error) {
                        swal("Error", "Consulte con el administrador.", "error");
                    });
            });
        this.setState({ anchorEl: null });
    };

    handleDrawerClose() {
        this.setState({ openDrawer: false });
    }

    handleDrawerOpen() {
        this.setState({ openDrawer: true });
    }

    changeIndex(selectedIndex) {
        this.handleDrawerClose();
        this.setState({ selectedIndex });
    }

    logOut() {
        swal("", "Desea salir del sistema?", {
            buttons: ["No", "Si"],
            icon: "warning"
        }).then((salir) => {
            if (salir !== null) {
                this.props.changeLogged(false);
                localStorage.removeItem("tp_uid");
                localStorage.removeItem("tp_uid_per");
                localStorage.removeItem("tp_vendedor");
                this.props.clearState();
                window.location.href = window.location.origin;
            }
        });
    }


    render() {
        let cl = "";
        if (!this.props.prices_flag) cl = "red";
        // We check if the user is logged in
        if (this.props.isLoggedIn) {
            return (
                <React.Fragment>
                    <AppBar position="static">
                        <Toolbar className={`toolbar ${cl}`}>
                            <IconButton edge="start" color="inherit" aria-label="menu" onClick={this.handleDrawerOpen}>
                                <MenuIcon />
                            </IconButton>
                            <Typography variant="h6">
                                {
                                    !this.props.prices_flag ? (
                                        <span>{`(Precios no actualizados)`}</span>
                                    ) :
                                        (
                                            <img src="images/logo.png" alt="" />
                                        )
                                }
                            </Typography>
                            {
                                this.props.loading ?
                                    (
                                        !this.props.prices_flag ? (
                                            <img src="images/loadingwhite.gif" alt="" width="32" />
                                        ) :
                                            (
                                                <img src="images/loading.gif" alt="" width="32" />
                                            )
                                    ) : ""
                            }
                            <div>
                                <Button
                                    aria-label="Usuario actual"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={this.handleMenu}
                                    color="inherit"
                                >
                                    {window.localStorage.getItem('tp_nombre')}
                                </Button>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={this.state.anchorEl}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(this.state.anchorEl)}
                                    onClose={this.handleClose}
                                >
                                    <MenuItem onClick={this.cambiarContrasena}>Cambiar Contraseña</MenuItem>
                                    <MenuItem onClick={this.logOut}>Salir</MenuItem>
                                </Menu>
                            </div>
                        </Toolbar>
                    </AppBar>
                    <Drawer
                        variant="persistent"
                        anchor="left"
                        className="Drawer"
                        open={this.state.openDrawer}
                    >
                        <div className="drawer-header">
                            <IconButton onClick={this.handleDrawerClose}>
                                <ChevronLeftIcon />
                            </IconButton>
                        </div>
                        <Divider />
                        <List>
                            {
                                this.props.user_permissions.includes("1") ?
                                    (
                                        <Link className="link" to="/nueva-orden" onClick={() => this.changeIndex(0)}>
                                            <ListItem button selected={this.state.selectedIndex === 0}>
                                                <ListItemIcon>
                                                    <LocalShipping />
                                                </ListItemIcon>
                                                <ListItemText primary={`Solicitar Pedido`} />
                                            </ListItem>
                                        </Link>
                                    ) : ""
                            }

                            <Link className="link" to="/order-list" onClick={() => this.changeIndex(1)}>
                                <ListItem button selected={this.state.selectedIndex === 1}>
                                    <ListItemIcon>
                                        <ListAltTwoTone />
                                    </ListItemIcon>
                                    <ListItemText primary={`Listado de Pedidos`} />
                                </ListItem>
                            </Link>
                            {
                                this.props.user_permissions.includes("2") ?
                                    (
                                        <Link className="link" to="/new-list" onClick={() => this.changeIndex(2)}>
                                            <ListItem button selected={this.state.selectedIndex === 2}>
                                                <ListItemIcon>
                                                    <ListAltTwoTone />
                                                </ListItemIcon>
                                                <ListItemText primary={`Asignar Horario`} />
                                            </ListItem>
                                        </Link>
                                    ) : ""
                            }
                            {
                                this.props.user_permissions.includes("3") ?
                                    (
                                        <Link className="link" to="/credit-list" onClick={() => this.changeIndex(3)}>
                                            <ListItem button selected={this.state.selectedIndex === 3}>
                                                <ListItemIcon>
                                                    <ListAltTwoTone />
                                                </ListItemIcon>
                                                <ListItemText primary={`Validación Crédito`} />
                                            </ListItem>
                                        </Link>
                                    ) : ""
                            }
                            {
                                this.props.user_permissions.includes("6") ?
                                    (
                                        <Link className="link" to="/to-schedule" onClick={() => this.changeIndex(7)}>
                                            <ListItem button selected={this.state.selectedIndex === 7}>
                                                <ListItemIcon>
                                                    <Schedule />
                                                </ListItemIcon>
                                                <ListItemText primary={`Pendientes de Programar`} />
                                            </ListItem>
                                        </Link>
                                    ) : ""
                            }
                            {
                                this.props.user_permissions.includes("4") ?
                                    (
                                        <Link className="link" to="/sap-list" onClick={() => this.changeIndex(4)}>
                                            <ListItem button selected={this.state.selectedIndex === 4}>
                                                <ListItemIcon>
                                                    <ListAltTwoTone />
                                                </ListItemIcon>
                                                <ListItemText primary={`Subir a SAP`} />
                                            </ListItem>
                                        </Link>
                                    ) : ""
                            }
                            {
                                this.props.user_permissions.includes("7") ?
                                    (
                                        <Link className="link" to="/cancelled-list" onClick={() => this.changeIndex(5)}>
                                            <ListItem button selected={this.state.selectedIndex === 5}>
                                                <ListItemIcon>
                                                    <ListAltTwoTone />
                                                </ListItemIcon>
                                                <ListItemText primary={`Pedidos Anulados`} />
                                            </ListItem>
                                        </Link>
                                    ) : ""
                            }
                            {
                                this.props.user_permissions.includes("8") ?
                                    (
                                        <Link className="link" to="/processed-list" onClick={() => this.changeIndex(6)}>
                                            <ListItem button selected={this.state.selectedIndex === 6}>
                                                <ListItemIcon>
                                                    <CheckBox />
                                                </ListItemIcon>
                                                <ListItemText primary={`Procesadas`} />
                                            </ListItem>
                                        </Link>
                                    ) : ""
                            }
                            <Divider />
                            <Link className="link" to="/reporte-vendedores" onClick={() => this.changeIndex(7)}>
                                <ListItem button selected={this.state.selectedIndex === 7}>
                                    <ListItemIcon>
                                        <Report />
                                    </ListItemIcon>
                                    <ListItemText primary={`Reporte Vendedores`} />
                                </ListItem>
                            </Link>
                        </List>
                        <Divider />
                    </Drawer>
                </React.Fragment >
            );
        }

        return "";

    }
}
export default Header;