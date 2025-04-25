import React, { useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import CreatePlanning from './CreatePlanning';
import AffectMembers from './AffectMembers';
import { DataGrid } from '@mui/x-data-grid';

const PlanningManager = () => {
  const [plannings, setPlannings] = useState([]);

  const columns = [
    { field: 'nom', headerName: 'Nom du Planning', width: 200 },
    { field: 'debut', headerName: 'Début', width: 150 },
    { field: 'fin', headerName: 'Fin', width: 150 },
    { field: 'members', headerName: 'Membres', width: 250, 
      renderCell: (params) => (
        <Typography>{params.value.join(', ')}</Typography>
      ),
    },
  ];

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ textAlign: 'center', marginBottom: 2 }}>
        Gestion des Plannings de Garde
      </Typography>

      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={plannings}
          columns={columns}
          pageSize={5}
          getRowId={(row) => row.id}
        />
      </Box>
    </Box>
  );
};

export default PlanningManager;
