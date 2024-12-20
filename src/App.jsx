import { useState, useEffect } from 'react';
import DataGrid from "./DataGrid";
import { CssBaseline, AppBar, Button, Menu, MenuItem, Checkbox, ListItemText, Box, Grid, Typography, IconButton, TextField } from '@mui/material';
import { Search, FilterList, Download } from '@mui/icons-material';

export default function App() {
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [visibleRows, setVisibleRows] = useState(8); 
    const [searchText, setSearchText] = useState(''); 

   
    const handleColumnMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

 
    const handleColumnMenuClose = () => {
        setAnchorEl(null);
    };

    
    const handleColumnChange = (event) => {
        setSelectedColumns(event.target.value);
    };

    
    const filteredColumns = columns.filter((column) => selectedColumns.includes(column.field));

    
    const exportToCSV = () => {
        const csvRows = [];
        const headers = columns.map(col => col.headerName).join(',');
        csvRows.push(headers);

        data.forEach(row => {
            const rowData = columns.map(col => row[col.field]).join(',');
            csvRows.push(rowData);
        });

        const csvData = csvRows.join('\n');
        const blob = new Blob([csvData], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'data.csv';
        link.click();
    };

    useEffect(() => {
        fetch("https://localhost:7260/api/Data")
            .then((response) => response.json())
            .then((data) => {
                const dataWithIds = data.map((item, index) => ({ ...item, id: index }));
                setData(dataWithIds);
                if (data.length > 0) {
                    const keys = Object.keys(data[0]);
                    const columns = keys.map(key => ({
                        field: key,
                        headerName: getCustomHeaderName(key),
                        width: 150,
                        filter: true,
                        floatingFilter: true
                    }));

                    
                    setSelectedColumns(columns.slice(0, 10).map(column => column.field));
                    setColumns(columns);
                }
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    
    const getCustomHeaderName = (key) => {
        const customHeaders = {
            invoiceDetailsId: "Invoice Details ID",
            uploadedDate: "Uploaded Date",
            fileId: "File ID",
            batchSeq: "Batch Sequence",
            organisationLevelId: "Organisation Level ID",
            userId: "User ID",
            isDuplicate: "Is Duplicate",
            dupStatusUpdate: "Duplicate Status Update",
            dupStatusRemarks: "Duplicate Status Remarks",
            actionTaken: "Action Taken",
            rootCause: "Root Cause",
            dupRules: "Duplicate Rules",
            createdOn: "Created On",
            modifiedOn: "Modified On",
            isCompleted: "Is Completed",
            isYank: "Is Yank",
            yankUser: "Yank User",
            manuallyMovedToHist: "Manually Moved To History",
            withinFileDuplicate: "Within File Duplicate",
            invoiceDetailsTempId: "Invoice Details Temp ID",
            auditedBy: "Audited By",
            auditedOn: "Audited On"
        };
        return customHeaders[key] || key.charAt(0).toUpperCase() + key.slice(1);
    };

    return (
        <CssBaseline>
            <AppBar position="static" color="primary" sx={{ padding: '10px' }}>
                <Typography variant="h6" color="inherit">
                    Data Viewer
                </Typography>
            </AppBar>

            <Box sx={{ padding: '20px' }}>
                {/* Toolbar with Search, Filter, and Export Buttons */}
                <Grid container spacing={2} alignItems="center" sx={{ marginBottom: '20px' }}>
                    {/* Search Bar */}
                    <Grid item xs={3}>
                        <TextField
                            label="Search"
                            variant="outlined"
                            fullWidth
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <IconButton position="start">
                                        <Search />
                                    </IconButton>
                                ),
                            }}
                        />
                    </Grid>

                    {/* Filter Columns Button */}
                    <Grid item>
                        <IconButton
                            onClick={handleColumnMenuClick}
                            color="secondary"
                            sx={{ padding: '10px' }}
                        >
                            <FilterList />
                        </IconButton>
                    </Grid>

                    {/* Export to CSV Button */}
                    <Grid item>
                        <IconButton
                            onClick={exportToCSV}
                            color="primary"
                            sx={{ padding: '10px' }}
                        >
                            <Download />
                        </IconButton>
                    </Grid>
                </Grid>

              
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleColumnMenuClose}
                >
                    {columns.map((column) => (
                        <MenuItem key={column.field}>
                            <Checkbox
                                checked={selectedColumns.includes(column.field)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setSelectedColumns([...selectedColumns, column.field]);
                                    } else {
                                        setSelectedColumns(selectedColumns.filter(c => c !== column.field));
                                    }
                                }}
                            />
                            <ListItemText primary={column.headerName} />
                        </MenuItem>
                    ))}
                </Menu>

                
                <Box sx={{ marginTop: 3 }}>
                    <DataGrid
                        rowData={data.slice(0, visibleRows)}
                        columnDefs={filteredColumns}
                        style={{ height: 400 }}
                        quickFilterText={searchText}  
                    />
                </Box>
            </Box>
        </CssBaseline>
    );
}
