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
import { LocalShipping } from '@material-ui/icons';
import Button from '@material-ui/core/Button';



class Header extends Component {
    constructor(props) {
        super(props);
        this.handleDrawerClose = this.handleDrawerClose.bind(this);
        this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
        this.changeIndex = this.changeIndex.bind(this);
        this.state = {
            selectedIndex: 1,
            openDrawer: false
        };
    }

    handleDrawerClose() {
        this.setState({ openDrawer: false });
    }

    handleDrawerOpen() {
        this.setState({ openDrawer: true });
    }

    changeIndex(selectedIndex) {
        this.handleDrawerClose();
        this.setState({selectedIndex });
    }

    render() {
        // We check if the user is logged in
        if (this.props.isLoggedIn) {
            return (
                <React.Fragment>
                    <AppBar position="static">
                        <Toolbar className="toolbar">
                            <IconButton edge="start" color="inherit" aria-label="menu" onClick={this.handleDrawerOpen}>
                                <MenuIcon />
                            </IconButton>
                            <Typography variant="h6">
                                Control de Pedidos
                            </Typography>
                            <Button color="inherit">Salir</Button>
                        </Toolbar>
                    </AppBar>
                    <Drawer
                        variant="persistent"
                        anchor="left"
                        open={this.state.openDrawer}
                    >
                        <div className="drawer-header">
                            <IconButton onClick={this.handleDrawerClose}>
                                <ChevronLeftIcon />
                            </IconButton>
                        </div>
                        <Divider />
                        <List>
                            <Link className="back" to="/nueva-orden" onClick={()=>this.changeIndex(0)}>
                                <ListItem button selected={this.state.selectedIndex === 0}>
                                    <ListItemIcon>
                                        <LocalShipping />
                                    </ListItemIcon>
                                    <ListItemText primary={`Solicitar Pedido`} />
                                </ListItem>
                            </Link>
                            <Link className="back" to="/order-list" onClick={()=>this.changeIndex(1)}>
                                <ListItem button selected={this.state.selectedIndex === 1}>
                                    <ListItemIcon>
                                        <LocalShipping />
                                    </ListItemIcon>
                                    <ListItemText primary={`Listado de Ordenes`} />
                                </ListItem>
                            </Link>
                        </List>
                        <Divider />
                    </Drawer>
                </React.Fragment>
            );
        }

        return "";

    }
}
export default Header;