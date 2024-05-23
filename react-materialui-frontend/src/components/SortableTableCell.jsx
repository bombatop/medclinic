import React from 'react';
import { TableCell, Box } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const SortableTableCell = ({ field, sortField, sortOrder, handleSort, children }) => {
    const isSorted = sortField === field;
    const isAsc = isSorted && sortOrder === 'asc';

    return (
        <TableCell onClick={() => handleSort(field)} style={{ cursor: 'pointer' }}>
            <Box display="flex" alignItems="center">
                {children}
                <Box
                    component="span"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        marginLeft: 1,
                        opacity: isSorted ? 1 : 0,
                        pointerEvents: isSorted ? 'auto' : 'none',
                    }}
                >
                    {isAsc ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />}
                </Box>
            </Box>
        </TableCell>
    );
};

export default SortableTableCell;
