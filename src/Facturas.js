import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton, Box } from '@mui/material';
import { Add, Edit, Delete, ArrowBack } from '@mui/icons-material';
import { Link } from 'react-router-dom';

function Facturas() {
    const [facturas, setFacturas] = useState([]);
    const [open, setOpen] = useState(false);
    const [cliente, setCliente] = useState('');
    const [total, setTotal] = useState('');
    const [editando, setEditando] = useState(null);

    useEffect(() => {
        fetch('http://192.168.1.33:5000/facturas')
            .then((response) => response.json())
            .then((data) => setFacturas(data))
            .catch((error) => console.error('Error:', error));
    }, []);

    const handleOpen = (factura) => {
        if (factura) {
            setEditando(factura);
            setCliente(factura.cliente);
            setTotal(factura.total);
        } else {
            setEditando(null);
            setCliente('');
            setTotal('');
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCliente('');
        setTotal('');
        setEditando(null);
    };

    const handleSave = () => {
        const nuevaFactura = { cliente, total: parseFloat(total) };
        if (editando) {
            fetch(`http://192.168.1.33:5000/facturas/${editando.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevaFactura),
            })
                .then((response) => response.json())
                .then((data) => {
                    setFacturas(facturas.map(f => (f.id === data.id ? data : f)));
                    handleClose();
                })
                .catch((error) => console.error('Error:', error));
        } else {
            fetch('http://192.168.1.33:5000/facturas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevaFactura),
            })
                .then((response) => response.json())
                .then((data) => {
                    setFacturas([...facturas, data]);
                    handleClose();
                })
                .catch((error) => console.error('Error:', error));
        }
    };

    const handleDelete = (id) => {
        fetch(`http://192.168.1.33:5000/facturas/${id}`, {
            method: 'DELETE',
        })
            .then(() => {
                setFacturas(facturas.filter(f => f.id !== id));
            })
            .catch((error) => console.error('Error:', error));
    };

    return (
        <Box sx={{ display: 'flex' }}>
            {/* Sidebar */}
            <Box sx={{ width: '200px', backgroundColor: '#f0f0f0', height: '100vh', padding: '20px' }}>
                <Typography variant="h6" gutterBottom>
                    Menú
                </Typography>
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Button fullWidth variant="contained" color="primary" sx={{ marginBottom: '10px' }}>
                        Inicio
                    </Button>
                </Link>
                <Link to="/clientes" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Button fullWidth variant="contained" color="success" sx={{ marginBottom: '10px' }}>
                        Clientes
                    </Button>
                </Link>
                <Link to="/productos" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Button fullWidth variant="contained" color="warning" sx={{ marginBottom: '10px' }}>
                        Productos
                    </Button>
                </Link>
            </Box>

            {/* Content */}
            <Container sx={{ marginLeft: '220px' }}>
                <Typography variant="h4" gutterBottom>
                    Gestión de Facturas
                </Typography>

                <Button variant="contained" color="warning" onClick={() => handleOpen(null)} startIcon={<Add />} style={{ marginBottom: '20px' }}>
                    Nueva Factura
                </Button>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Cliente</TableCell>
                                <TableCell>Total</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {facturas.map((factura) => (
                                <TableRow key={factura.id}>
                                    <TableCell>{factura.id}</TableCell>
                                    <TableCell>{factura.cliente}</TableCell>
                                    <TableCell>${factura.total}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleOpen(factura)} color="primary">
                                            <Edit />
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(factura.id)} color="error">
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Modal */}
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>{editando ? 'Editar Factura' : 'Nueva Factura'}</DialogTitle>
                    <DialogContent>
                        <TextField autoFocus margin="dense" label="Cliente" fullWidth value={cliente} onChange={(e) => setCliente(e.target.value)} />
                        <TextField margin="dense" label="Total" type="number" fullWidth value={total} onChange={(e) => setTotal(e.target.value)} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancelar</Button>
                        <Button onClick={handleSave} color="primary">
                            Guardar
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
}

export default Facturas;
