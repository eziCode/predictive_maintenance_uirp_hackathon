import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import {FC, useState} from 'react';

const rowPerPageOptions = {
    five: 5,
    ten: 10,
    twentyFive: 25
};

const TableComponent: FC = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(rowPerPageOptions.five);


    return (
        <>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{'Date'}</TableCell>
                            <TableCell>{'Component'}</TableCell>
                            <TableCell>{'Maintenance Notes'}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {[
                            {
                                date: '2024-06-01',
                                component: 'Engine',
                                notes: 'Oil changed, filter replaced'
                            },
                            {
                                date: '2024-05-20',
                                component: 'Hydraulics',
                                notes: 'Hydraulic fluid topped up'
                            },
                            {
                                date: '2024-05-10',
                                component: 'Transmission',
                                notes: 'Transmission belt adjusted'
                            },
                            {
                                date: '2024-04-28',
                                component: 'Brakes',
                                notes: 'Brake pads replaced'
                            },
                            {
                                date: '2024-04-15',
                                component: 'Tires',
                                notes: 'Front tires rotated'
                            },
                            {
                                date: '2024-03-30',
                                component: 'Electrical',
                                notes: 'Battery terminals cleaned'
                            },
                            {
                                date: '2024-03-10',
                                component: 'Cabin',
                                notes: 'Air filter replaced'
                            }
                        ]
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, idx) => (
                                <TableRow key={idx}>
                                    <TableCell>{row.date}</TableCell>
                                    <TableCell>{row.component}</TableCell>
                                    <TableCell>{row.notes}</TableCell>
                                </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component={'div'}
                count={7}
                onPageChange={(_, newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) => setRowsPerPage(Number(event.target.value))}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={Object.values(rowPerPageOptions)}
            />
        </>
    );
};

export default TableComponent;
