import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { useState, useRef, useMemo } from 'react';
import { TextField, Button, Box } from '@mui/material';

ModuleRegistry.registerModules([AllCommunityModule]);

export default function DataGrid({ rowData, columnDefs, quickFilterText }) {
    const gridRef = useRef(null);
   

    const onExportClick = () => {
        gridRef.current.api.exportDataAsCsv();
    };

    const rowSelection = useMemo(() => {
        return {
            mode: 'multiRow'
        };
    }, []);

    return (
        <Box>
       
        <Box className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
            <AgGridReact
                ref={gridRef}
                rowData={rowData}
                columnDefs={columnDefs}
                pagination={true}
                rowSelection={rowSelection}
                quickFilterText={quickFilterText}
                suppressCsvExport={false}
                
            />
        </Box>
    </Box>
    );
}