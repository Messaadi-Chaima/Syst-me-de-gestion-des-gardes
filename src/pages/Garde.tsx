import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Modal,
} from "@mui/material";

const Garde = () => {
  const [rows, setRows] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [editId, setEditId] = useState(null);

  // Charger les données du backend Flask
  useEffect(() => {
    fetch("http://localhost:5000/get-gardes")
      .then(res => res.json())
      .then(data => setRows(data))
      .catch(err => console.error("Erreur de chargement :", err));
  }, []);

  // Sauvegarder vers le backend Flask
  const saveToBackend = async (updatedRows) => {
    try {
      const response = await fetch("http://localhost:5000/save-gardes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedRows),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
    } catch (err) {
      alert("Erreur de sauvegarde : " + err.message);
    }
  };

  const addLocalisation = () => {
    let updatedRows;
    if (editId !== null) {
      updatedRows = rows.map(row =>
        row.id === editId
          ? { id: editId, Nom: nom, Prenom: prenom, Email: email }
          : row
      );
    } else {
      const newRow = {
        id: Date.now(),
        Nom: nom,
        Prenom: prenom,
        Email: email,
      };
      updatedRows = [...rows, newRow];
    }

    setRows(updatedRows);
    saveToBackend(updatedRows);

    setNom('');
    setPrenom('');
    setEmail('');
    setEditId(null);
    setOpenAddModal(false);
  };

  const handleEdit = (params) => {
    setNom(params.row.Nom);
    setPrenom(params.row.Prenom);
    setEmail(params.row.Email);
    setEditId(params.row.id);
    setOpenAddModal(true);
  };

  const handleDelete = (id) => {
    const updatedRows = rows.filter(row => row.id !== id);
    setRows(updatedRows);
    saveToBackend(updatedRows);
  };

  const columns = [
    { field: 'Nom', headerName: 'Nom', width: 150 },
    { field: 'Prenom', headerName: 'Prénom', width: 150 },
    { field: 'Email', headerName: 'Email', width: 250 },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      width: 250,
      renderCell: (params) => (
        <Grid container spacing={1} justifyContent="center">
          <Grid item>
            <Button variant="contained" color="primary" size="small" onClick={() => handleEdit(params)}>
              Modifier
            </Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" color="error" size="small" onClick={() => handleDelete(params.row.id)}>
              Supprimer
            </Button>
          </Grid>
        </Grid>
      ),
    },
  ];

  return (
    <div style={{ width: '90%', margin: '80px auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button variant="contained" color="primary" onClick={() => setOpenAddModal(true)}>
          Ajouter un nouveau garde
        </Button>
      </Box>

      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={7}
        getRowId={(row) => row.id}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 7,
            },
          },
        }}
        pageSizeOptions={[7]}
        components={{ Toolbar: GridToolbar }}
      />

      <Modal open={openAddModal} onClose={() => setOpenAddModal(false)}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}>
          <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
            {editId !== null ? "Modifier une personne" : "Ajouter une personne"}
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField fullWidth label="Nom" value={nom} onChange={(e) => setNom(e.target.value)} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Prénom" value={prenom} onChange={(e) => setPrenom(e.target.value)} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={6}>
              <Button fullWidth variant="contained" color="secondary" onClick={() => setOpenAddModal(false)}>
                Annuler
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button fullWidth variant="contained" color="primary" onClick={addLocalisation}>
                {editId !== null ? "Enregistrer" : "Ajouter"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
};

export default Garde;
