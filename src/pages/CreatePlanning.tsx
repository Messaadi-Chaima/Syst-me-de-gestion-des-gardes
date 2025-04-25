import React, { useState } from "react";
import { Box, TextField, Button, Grid, Typography } from "@mui/material";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const CreatePlanning = () => {
  const [nomPlanning, setNomPlanning] = useState('');
  const [debutPlanning, setDebutPlanning] = useState('');
  const [finPlanning, setFinPlanning] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    const newPlanning = {
      id: Date.now(),
      nom: nomPlanning,
      debut: debutPlanning,
      fin: finPlanning,
      members: []
    };

    try {
      const response = await fetch("http://localhost:5000/save-plannings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newPlanning)
      });

      if (response.ok) {
        setMessage("Planning sauvegardé avec succès !");
        setNomPlanning('');
        setDebutPlanning('');
        setFinPlanning('');
      } else {
        const errorData = await response.json();
        setMessage("Erreur : " + errorData.error);
      }
    } catch (err) {
      setMessage("Erreur de connexion : " + err.message);
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: '#f5f5f5', p: 2 }}>
      <Box sx={{ width: '100%', maxWidth: 500, backgroundColor: '#fff', padding: 4, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h5" sx={{ textAlign: 'center', mb: 3 }}>
          <CalendarMonthIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Créer un planning
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField fullWidth label="Nom du planning" value={nomPlanning} onChange={(e) => setNomPlanning(e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Date de début" type="date" value={debutPlanning} onChange={(e) => setDebutPlanning(e.target.value)} InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Date de fin" type="date" value={finPlanning} onChange={(e) => setFinPlanning(e.target.value)} InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12}>
            <Button fullWidth variant="contained" color="primary" onClick={handleSubmit}>
              Ajouter Planning
            </Button>
          </Grid>
          {message && (
            <Grid item xs={12}>
              <Typography color="primary">{message}</Typography>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default CreatePlanning;
