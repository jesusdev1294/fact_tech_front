import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemText, Box, Toolbar } from '@mui/material';
import Inicio from './Inicio';
import Facturas from './Facturas';

const drawerWidth = 240;

function Dashboard() {
    return (
        <Router>
            <Box sx={{ display: 'flex' }}>
                {/* Sidebar */}
                <Drawer
                    variant="permanent"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                    }}
                >
                    <Toolbar />
                    <List>
                        <ListItem button component={Link} to="/">
                            <ListItemText primary="Inicio" />
                        </ListItem>
                        <ListItem button component={Link} to="/facturas">
                            <ListItemText primary="Facturas" />
                        </ListItem>
                    </List>
                </Drawer>

                {/* Content */}
                <Box
                    component="main"
                    sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
                >
                    <Toolbar />
                    <Routes>
                        <Route path="/" element={<Inicio />} />
                        <Route path="/facturas" element={<Facturas />} />
                    </Routes>
                </Box>
            </Box>
        </Router>
    );
}

export default Dashboard;
