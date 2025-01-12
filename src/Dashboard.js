import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper, Card, CardContent } from '@mui/material';
import { AttachMoney, Receipt, People } from '@mui/icons-material';
import { Link } from 'react-router-dom';

function Dashboard() {
    const [facturas, setFacturas] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [hora, setHora] = useState('');
    const [precioVES, setPrecioVES] = useState(null);

    // Función para obtener la hora actual
    const actualizarHora = () => {
        const fecha = new Date();
        const opciones = { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' };
        const horaFormateada = fecha.toLocaleTimeString('es-VE', opciones);
        setHora(horaFormateada);
    };

    // Función para obtener el precio del dólar en VES
    const obtenerPrecioVES = async () => {
        try {
            const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
            const data = await response.json();
            const precio = data.rates.VES.toFixed(2);
            setPrecioVES(precio);
        } catch (error) {
            console.error('Error obteniendo el precio VES:', error);
        }
    };

    // Obtener datos del backend
    useEffect(() => {
        fetch('http://localhost:5002/facturas')
            .then((response) => response.json())
            .then((data) => setFacturas(data))
            .catch((error) => console.error('Error:', error));

        fetch('http://localhost:5002/clientes')
            .then((response) => response.json())
            .then((data) => setClientes(data))
            .catch((error) => console.error('Error:', error));

        obtenerPrecioVES();
        actualizarHora();
        const interval = setInterval(actualizarHora, 1000);

        return () => clearInterval(interval);
    }, []);

    const totalIngresos = facturas.reduce((sum, factura) => sum + factura.total, 0);

    return (
        <Box sx={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>
                Bienvenido a FortFact
            </Typography>

            {/* Mostrar fecha y hora */}
            <Typography variant="h6">Fecha: {new Date().toLocaleDateString('es-VE')}</Typography>
            <Typography variant="h6">Hora: {hora}</Typography>

            {/* Mostrar precio del dólar en VES */}
            <Typography variant="h6" sx={{ marginTop: '10px', color: '#1976d2' }}>
                Precio VES: {precioVES ? `${precioVES} Bs por USD` : 'Cargando...'}
            </Typography>

            {/* Tarjetas de resumen */}
            <Box sx={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
                <Card sx={{ minWidth: 200, backgroundColor: '#1976d2', color: 'white', borderRadius: '12px', boxShadow: 3 }}>
                    <CardContent>
                        <Typography variant="h6" component="div" gutterBottom>
                            <Receipt sx={{ fontSize: 40, verticalAlign: 'middle', marginRight: '10px' }} />
                            Facturas
                        </Typography>
                        <Typography variant="h4">{facturas.length}</Typography>
                    </CardContent>
                </Card>

                <Card sx={{ minWidth: 200, backgroundColor: '#4caf50', color: 'white', borderRadius: '12px', boxShadow: 3 }}>
                    <CardContent>
                        <Typography variant="h6" component="div" gutterBottom>
                            <People sx={{ fontSize: 40, verticalAlign: 'middle', marginRight: '10px' }} />
                            Clientes
                        </Typography>
                        <Typography variant="h4">{clientes.length}</Typography>
                    </CardContent>
                </Card>

                <Card sx={{ minWidth: 200, backgroundColor: '#ff9800', color: 'white', borderRadius: '12px', boxShadow: 3 }}>
                    <CardContent>
                        <Typography variant="h6" component="div" gutterBottom>
                            <AttachMoney sx={{ fontSize: 40, verticalAlign: 'middle', marginRight: '10px' }} />
                            Ingresos
                        </Typography>
                        <Typography variant="h4">${totalIngresos}</Typography>
                    </CardContent>
                </Card>
            </Box>

            {/* Botones de colores */}
            <Box sx={{ marginTop: '40px' }}>
                <Link to="/facturas" style={{ textDecoration: 'none' }}>
                    <Button fullWidth variant="contained" sx={{ backgroundColor: '#2196f3', marginBottom: '10px' }}>
                        Facturas
                    </Button>
                </Link>

                <Link to="/clientes" style={{ textDecoration: 'none' }}>
                    <Button fullWidth variant="contained" sx={{ backgroundColor: '#4caf50', marginBottom: '10px' }}>
                        Clientes
                    </Button>
                </Link>

                <Link to="/productos" style={{ textDecoration: 'none' }}>
                    <Button fullWidth variant="contained" sx={{ backgroundColor: '#ff9800', marginBottom: '10px' }}>
                        Productos
                    </Button>
                </Link>
            </Box>
        </Box>
    );
}

export default Dashboard;
