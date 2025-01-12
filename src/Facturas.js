import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton, Box } from '@mui/material';
import { Add, Edit, Delete, Search } from '@mui/icons-material';

function Facturas() {
    const [facturas, setFacturas] = useState([]);
    const [filteredFacturas, setFilteredFacturas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [open, setOpen] = useState(false);
    const [cliente, setCliente] = useState('');
    const [total, setTotal] = useState('');
    const [editando, setEditando] = useState(null);

    // Cargar facturas desde el backend
    useEffect(() => {
        fetch('http://localhost:5002/facturas')
            .then(response => response.json())
            .then(data => {
                setFacturas(data);
                setFilteredFacturas(data);
            })
            .catch(error => console.error('Error:', error));
    }, []);

    // Filtro de búsqueda
    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        setFilteredFacturas(facturas.filter(factura =>
            factura.cliente.toLowerCase().includes(term)
        ));
    };

    // Abrir y cerrar el modal
    const handleOpen = (factura) => {
        setEditando(factura);
        setCliente(factura ? factura.cliente : '');
        setTotal(factura ? factura.total : '');
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCliente('');
        setTotal('');
        setEditando(null);
    };

    // Guardar o actualizar una factura
    const handleSave = () => {
        if (!cliente || !total) return alert('Todos los campos son obligatorios.');

        const nuevaFactura = { cliente, total: parseFloat(total) };

        const url = editando ? `http://localhost:5002/facturas/${editando.id}` : 'http://localhost:5002/facturas';
        const method = editando ? 'PUT' : 'POST';

        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevaFactura),
        })
            .then(response => response.json())
            .then(data => {
                const updatedFacturas = editando
                    ? facturas.map(f => (f.id === data.id ? data : f))
                    : [...facturas, data];

                setFacturas(updatedFacturas);
                setFilteredFacturas(updatedFacturas);
                handleClose();
            })
            .catch(error => console.error('Error:', error));
    };

    // Eliminar una factura
    const handleDelete = (id) => {
        fetch(`http://localhost:5002/facturas/${id}`, { method: 'DELETE' })
            .then(() => {
                const updatedFacturas = facturas.filter(f => f.id !== id);
                setFacturas(updatedFacturas);
                setFilteredFacturas(updatedFacturas);
            })
            .catch(error => console.error('Error:', error));
    };

    return (
        <Container>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <Typography variant="h4" gutterBottom>Gestión de Facturas</Typography>
                <TextField
                    variant="outlined"
                    label="Buscar cliente"
                    value={searchTerm}
                    onChange={handleSearch}
                    sx={{ width: '300px' }}
                    InputProps={{ endAdornment: <Search /> }}
                />
            </Box>

            <Button variant="contained" color="primary" onClick={() => handleOpen(null)} startIcon={<Add />} sx={{ marginBottom: '20px' }}>
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
                        {filteredFacturas.map(factura => (
                            <TableRow key={factura.id}>
                                <TableCell>{factura.id}</TableCell>
                                <TableCell>{factura.cliente}</TableCell>
                                <TableCell>${factura.total}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpen(factura)} color="primary"><Edit /></IconButton>
                                    <IconButton onClick={() => handleDelete(factura.id)} color="error"><Delete /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{editando ? 'Editar Factura' : 'Nueva Factura'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Cliente"
                        fullWidth
                        value={cliente}
                        onChange={(e) => setCliente(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Total"
                        type="number"
                        fullWidth
                        value={total}
                        onChange={(e) => setTotal(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleSave} color="primary">Guardar</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default Facturas;
