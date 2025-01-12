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
import { Add, Edit, Delete } from '@mui/icons-material';
import { Link } from 'react-router-dom';

function Clientes() {
    const [clientes, setClientes] = useState([]);
    const [open, setOpen] = useState(false);
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [editando, setEditando] = useState(null);

    // Cargar clientes desde el backend
    useEffect(() => {
        fetch('http://localhost:5002/clientes')
            .then((response) => response.json())
            .then((data) => setClientes(data))
            .catch((error) => console.error('Error:', error));
    }, []);

    // Abrir y cerrar el modal
    const handleOpen = (cliente) => {
        if (cliente) {
            setEditando(cliente);
            setNombre(cliente.nombre);
            setEmail(cliente.email);
        } else {
            setEditando(null);
            setNombre('');
            setEmail('');
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setNombre('');
        setEmail('');
        setEditando(null);
    };

    // Guardar nuevo cliente o actualizar uno existente
    const handleSave = () => {
        const nuevoCliente = { nombre, email };
        if (editando) {
            fetch(`http://localhost:5002/clientes/${editando.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoCliente),
            })
                .then((response) => response.json())
                .then((data) => {
                    setClientes(clientes.map(c => (c.id === data.id ? data : c)));
                    handleClose();
                })
                .catch((error) => console.error('Error:', error));
        } else {
            fetch('http://localhost:5002/clientes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoCliente),
            })
                .then((response) => response.json())
                .then((data) => {
                    setClientes([...clientes, data]);
                    handleClose();
                })
                .catch((error) => console.error('Error:', error));
        }
    };

    // Eliminar un cliente
    const handleDelete = (id) => {
        fetch(`http://localhost:5002/clientes/${id}`, {
            method: 'DELETE',
        })
            .then(() => {
                setClientes(clientes.filter(c => c.id !== id));
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
                <Typography variant="h4" gutterBottom>
                    Gestión de Clientes
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpen(null)}
                    startIcon={<Add />}
                    style={{ marginBottom: '20px' }}
                >
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
                            {clientes.map((cliente) => (
                                <TableRow key={cliente.id}>
                                    <TableCell>{cliente.id}</TableCell>
                                    <TableCell>{cliente.nombre}</TableCell>
                                    <TableCell>{cliente.email}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleOpen(cliente)} color="primary">
                                            <Edit />
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(cliente.id)} color="error">
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Modal para crear o editar cliente */}
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>{editando ? 'Editar Cliente' : 'Nuevo Cliente'}</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Nombre"
                            fullWidth
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />
                        <TextField
                            margin="dense"
                            label="Email"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
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

export default Clientes;
