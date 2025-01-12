import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    IconButton,
    Box,
} from '@mui/material';
import { Add, Edit, Delete, Search } from '@mui/icons-material';
import { Link } from 'react-router-dom';

function Clientes() {
    const [clientes, setClientes] = useState([]);
    const [filteredClientes, setFilteredClientes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [open, setOpen] = useState(false);
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [editando, setEditando] = useState(null);
    const [error, setError] = useState('');

    // Cargar clientes desde el backend
    useEffect(() => {
        fetch('http://localhost:5002/clientes')
            .then(response => response.json())
            .then(data => {
                setClientes(data);
                setFilteredClientes(data);
            })
            .catch(error => console.error('Error:', error));
    }, []);

    // Filtro de búsqueda
    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        setFilteredClientes(clientes.filter(cliente =>
            cliente.nombre.toLowerCase().includes(term) || cliente.email.toLowerCase().includes(term)
        ));
    };

    // Abrir y cerrar el modal
    const handleOpen = (cliente) => {
        setEditando(cliente);
        setNombre(cliente ? cliente.nombre : '');
        setEmail(cliente ? cliente.email : '');
        setError('');
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setNombre('');
        setEmail('');
        setEditando(null);
        setError('');
    };

    // Guardar o actualizar un cliente
    const handleSave = () => {
        if (!nombre || !email) return setError('Todos los campos son obligatorios.');
        if (!/\S+@\S+\.\S+/.test(email)) return setError('El email ingresado no es válido.');

        const nuevoCliente = { nombre, email };

        const url = editando ? `http://localhost:5002/clientes/${editando.id}` : 'http://localhost:5002/clientes';
        const method = editando ? 'PUT' : 'POST';

        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoCliente),
        })
            .then(response => response.json())
            .then(data => {
                const updatedClientes = editando
                    ? clientes.map(c => (c.id === data.id ? data : c))
                    : [...clientes, data];

                setClientes(updatedClientes);
                setFilteredClientes(updatedClientes);
                handleClose();
            })
            .catch(error => console.error('Error:', error));
    };

    // Eliminar un cliente
    const handleDelete = (id) => {
        fetch(`http://localhost:5002/clientes/${id}`, { method: 'DELETE' })
            .then(() => {
                const updatedClientes = clientes.filter(c => c.id !== id);
                setClientes(updatedClientes);
                setFilteredClientes(updatedClientes);
            })
            .catch(error => console.error('Error:', error));
    };

    return (
        <Box sx={{ display: 'flex' }}>
            {/* Sidebar */}
            <Box sx={{ width: '200px', backgroundColor: '#f0f0f0', height: '100vh', padding: '20px' }}>
                <Typography variant="h6" gutterBottom>Menú</Typography>
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Button fullWidth variant="contained" color="primary" sx={{ marginBottom: '10px' }}>
                        Inicio
                    </Button>
                </Link>
                <Link to="/facturas" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Button fullWidth variant="contained" color="warning" sx={{ marginBottom: '10px' }}>
                        Facturas
                    </Button>
                </Link>
                <Link to="/productos" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Button fullWidth variant="contained" color="success" sx={{ marginBottom: '10px' }}>
                        Productos
                    </Button>
                </Link>
            </Box>

            {/* Content */}
            <Container sx={{ marginLeft: '220px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <Typography variant="h4" gutterBottom>Gestión de Clientes</Typography>
                    <TextField
                        variant="outlined"
                        label="Buscar cliente"
                        value={searchTerm}
                        onChange={handleSearch}
                        sx={{ width: '300px' }}
                        InputProps={{ endAdornment: <Search /> }}
                    />
                </Box>

                {error && <Typography color="error">{error}</Typography>}

                <Button variant="contained" color="primary" onClick={() => handleOpen(null)} startIcon={<Add />} sx={{ marginBottom: '20px' }}>
                    Nuevo Cliente
                </Button>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Nombre</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredClientes.map(cliente => (
                                <TableRow key={cliente.id}>
                                    <TableCell>{cliente.id}</TableCell>
                                    <TableCell>{cliente.nombre}</TableCell>
                                    <TableCell>{cliente.email}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleOpen(cliente)} color="primary"><Edit /></IconButton>
                                        <IconButton onClick={() => handleDelete(cliente.id)} color="error"><Delete /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>{editando ? 'Editar Cliente' : 'Nuevo Cliente'}</DialogTitle>
                    <DialogContent>
                        <TextField autoFocus margin="dense" label="Nombre" fullWidth value={nombre} onChange={(e) => setNombre(e.target.value)} />
                        <TextField margin="dense" label="Email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancelar</Button>
                        <Button onClick={handleSave} color="primary">Guardar</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
}

export default Clientes;
