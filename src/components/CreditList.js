import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import MaterialTable from 'material-table';
import swal from 'sweetalert';
import axios from 'axios';

import { forwardRef } from 'react';
import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import { LocalAtm, Cancel, Star } from '@material-ui/icons/';

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

class CreditList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            columns: [
                { title: 'Fecha', field: 'creado' },
                { title: 'Cliente', field: 'CodigoCliente' },
                { title: 'Status', field: 'status' },
                { title: 'Tipo Pago', field: 'tipo_pago' },
                { title: 'Flete', field: 'flete' },
                { title: 'Placa Flete', field: 'placa' },
            ]
        };
    }

    render() {

        let orders = null;

        if (this.props.orders) orders = this.props.orders;

        // Show only the anuladas orders
        if (orders)
            orders = orders.filter(
                (key) =>
                    key.status.trim() !== "Anulado" && key.status.trim() !== "Operado"
            );

        return (
            <div className="main-container">
                <Typography variant="h3" component="h1" gutterBottom>
                    Pendientes de Validación Créditos
                </Typography>
                <div className="landing-container with-spacing">
                    {
                        orders ? (
                            <MaterialTable
                                icons={tableIcons}
                                columns={this.state.columns}
                                data={orders}
                                title="Listado de Pedidos"
                                options={{
                                    pageSize: 20
                                }}
                                actions={[
                                    rowData => ({
                                        icon: () => <Star color="secondary" />,
                                        tooltip: 'VIP',
                                        hidden: rowData.star === 'N'
                                    }),
                                    rowData => ({
                                        icon: LocalAtm,
                                        tooltip: 'Créditos',
                                        onClick: (event, rowData) => {
                                            // console.log(rowData);
                                            this.props.history.push("/creditos/" + rowData.id);
                                        },
                                        hidden: parseInt(rowData.oid) === 6
                                    }),
                                    rowData => ({
                                        icon: Cancel,
                                        tooltip: 'Anular Orden',
                                        onClick: (event, rowData) => {
                                            // this.props.history.push("/creditos/" + rowData.id);
                                            swal("Anular Orden?", "Comentario", {
                                                buttons: ["No", "Si"],
                                                icon: "warning",
                                                content: "input",
                                            }).then((anular) => {
                                                if (anular !== null) {
                                                    let t_ = this;
                                                    axios.post(this.props.url + "api/cancel-order", {
                                                        id: rowData.id,
                                                        user: window.localStorage.getItem('tp_uid'),
                                                        comentario: anular
                                                    })
                                                        .then(function () {
                                                            // t.setState({ clientes: response.data });
                                                            t_.props.load_orders();
                                                        })
                                                        .catch(function (error) {
                                                            console.log(error);
                                                        });
                                                }
                                            });
                                        }
                                    })
                                ]}
                                localization={{
                                    pagination: {
                                        labelDisplayedRows: '{from}-{to} de {count}',
                                        labelRowsSelect: 'Filas'
                                    },
                                    toolbar: {
                                        nRowsSelected: '{0} filas(s) seleccionadas',
                                        searchPlaceholder: 'Buscar'
                                    },
                                    header: {
                                        actions: 'Acciones'
                                    },
                                    body: {
                                        emptyDataSourceMessage: 'No existen ordenes',
                                        filterRow: {
                                            filterTooltip: 'Filter'
                                        }
                                    }

                                }}
                            />
                        ) : ""
                    }
                </div>
            </div>
        );
    }
}
export default CreditList;