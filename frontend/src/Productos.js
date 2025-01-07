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

function Productos() {
    const [productos, setProductos] = useState([]);
    const [open, setOpen] = useState(false);
    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState('');
    const [editando, setEditando] = useState(null);

    // Cargar productos desde el backend
    useEffect(() => {
        fetch('http://192.168.1.33:5000/productos')
            .then((response) => response.json())
            .then((data) => setProductos(data))
            .catch((error) => console.error('Error:', error));
    }, []);

    // Abrir y cerrar el modal
    const handleOpen = (producto) => {
        if (producto) {
            setEditando(producto);
            setNombre(producto.nombre);
            setPrecio(producto.precio);
        } else {
            setEditando(null);
            setNombre('');
            setPrecio('');
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setNombre('');
        setPrecio('');
        setEditando(null);
    };

    // Guardar nuevo producto o actualizar uno existente
    const handleSave = () => {
        const nuevoProducto = { nombre, precio: parseFloat(precio) };
        if (editando) {
            fetch(`http://192.168.1.33:5000/productos/${editando.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoProducto),
            })
                .then((response) => response.json())
                .then((data) => {
                    setProductos(productos.map(p => (p.id === data.id ? data : p)));
                    handleClose();
                })
                .catch((error) => console.error('Error:', error));
        } else {
            fetch('http://192.168.1.33:5000/productos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoProducto),
            })
                .then((response) => response.json())
                .then((data) => {
                    setProductos([...productos, data]);
                    handleClose();
                })
                .catch((error) => console.error('Error:', error));
        }
    };

    // Eliminar un producto
    const handleDelete = (id) => {
        fetch(`http://192.168.1.33:5000/productos/${id}`, {
            method: 'DELETE',
        })
            .then(() => {
                setProductos(productos.filter(p => p.id !== id));
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
                <Link to="/clientes" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Button fullWidth variant="contained" color="success" sx={{ marginBottom: '10px' }}>
                        Clientes
                    </Button>
                </Link>
            </Box>

            {/* Content */}
            <Container sx={{ marginLeft: '220px' }}>
                <Typography variant="h4" gutterBottom>
                    Gestión de Productos
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpen(null)}
                    startIcon={<Add />}
                    style={{ marginBottom: '20px' }}
                >
                    Nuevo Producto
                </Button>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Nombre</TableCell>
                                <TableCell>Precio</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {productos.map((producto) => (
                                <TableRow key={producto.id}>
                                    <TableCell>{producto.id}</TableCell>
                                    <TableCell>{producto.nombre}</TableCell>
                                    <TableCell>${producto.precio}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleOpen(producto)} color="primary">
                                            <Edit />
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(producto.id)} color="error">
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Modal para crear o editar producto */}
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>{editando ? 'Editar Producto' : 'Nuevo Producto'}</DialogTitle>
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
                            label="Precio"
                            type="number"
                            fullWidth
                            value={precio}
                            onChange={(e) => setPrecio(e.target.value)}
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

export default Productos;
