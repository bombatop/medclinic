import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/http-common';
import {
    Box, Table, TableBody, Button, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton, Typography,
    Pagination, Select, MenuItem,
} from '@mui/material';
import {
    Visibility as VisibilityIcon
} from '@mui/icons-material';
import SortableTableCell from '../components/SortableTableCell';
import DebouncedAutocomplete from '../components/DebouncedAutocomplete';

const UserListTable = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [sortField, setSortField] = useState('surname');
    const [sortOrder, setSortOrder] = useState('asc');
    const [selectedRole, setSelectedRole] = useState(null);
    const navigate = useNavigate();

    const fetchUsers = useCallback(async (page = 1, size = 10, sortField = 'surname', sortOrder = 'asc') => {
        try {
            const params = {
                page: page - 1,
                size,
                sortField,
                sortOrder,
                roleId: selectedRole ? selectedRole.id : ''
            };
            const response = await api.get('/users', { params });
            console.log(response.data.content);
            setUsers(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching users');
        }
    }, [selectedRole]);

    // const fetchRoles = async (query = '') => {
    //     try {
    //         const response = await api.get('/roles', {
    //             params: { searchQuery: query, page: 0, size: 5 }
    //         });
    //         return response.data.content;
    //     } catch (error) {
    //         console.error('Error fetching roles');
    //         return [];
    //     }
    // };

    useEffect(() => {
        fetchUsers(page, size, sortField, sortOrder);
    }, [page, size, sortField, sortOrder, fetchUsers]);

    const handleSort = (field) => {
        const isAsc = sortField === field && sortOrder === 'asc';
        setSortOrder(isAsc ? 'desc' : 'asc');
        setSortField(field);
    };

    const handleView = (userId) => {
        navigate(`/users/${userId}`);
    };

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4" gutterBottom>
                Пользователи
            </Typography>
            {/* <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <DebouncedAutocomplete
                    label="Роль"
                    fetchOptions={fetchRoles}
                    onChange={setSelectedRole}
                    value={selectedRole}
                    getOptionKey={(role) => `${role.id}`}
                    getOptionLabel={(role) => `${role.name}`}
                    noOptionsText={"Нет данных"}
                    sx={{ width: 300 }}
                    size="small"
                />
            </Box> */}
            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <SortableTableCell field="surname" sortField={sortField} sortOrder={sortOrder} handleSort={handleSort}>
                                Фамилия
                            </SortableTableCell>
                            <SortableTableCell field="name" sortField={sortField} sortOrder={sortOrder} handleSort={handleSort}>
                                Имя
                            </SortableTableCell>
                            <SortableTableCell field="patronymic" sortField={sortField} sortOrder={sortOrder} handleSort={handleSort}>
                                Отчество
                            </SortableTableCell>
                            <SortableTableCell field="specialty.name" sortField={sortField} sortOrder={sortOrder} handleSort={handleSort}>
                                Специальность
                            </SortableTableCell>
                            <SortableTableCell field="username" sortField={sortField} sortOrder={sortOrder} handleSort={handleSort}>
                                Логин
                            </SortableTableCell>
                            <SortableTableCell field="email" sortField={sortField} sortOrder={sortOrder} handleSort={handleSort}>
                                Email
                            </SortableTableCell>
                            <SortableTableCell field="phonenumber" sortField={sortField} sortOrder={sortOrder} handleSort={handleSort}>
                                Телефон
                            </SortableTableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    {user.surname}
                                </TableCell>
                                <TableCell>
                                    {user.name}
                                </TableCell>
                                <TableCell>
                                    {user.patronymic}
                                </TableCell>
                                <TableCell>
                                    {user?.specialty?.name}
                                </TableCell>
                                <TableCell>
                                    {user.username}
                                </TableCell>
                                <TableCell>
                                    {user.email}
                                </TableCell>
                                <TableCell>
                                    {user.phonenumber}
                                </TableCell>
                                <TableCell sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <IconButton onClick={() => handleView(user.id)}>
                                        <VisibilityIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(event, value) => setPage(value)}
                />
                <Select
                    value={size}
                    onChange={(event) => setSize(event.target.value)}
                >
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                </Select>
            </Box>
        </Box>
    );
};

export default UserListTable;
