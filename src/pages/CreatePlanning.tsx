import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const CreatePlanning = () => {
  const [nomPlanning, setNomPlanning] = useState("");
  const [debutPlanning, setDebutPlanning] = useState("");
  const [finPlanning, setFinPlanning] = useState("");
  const [alert, setAlert] = useState({ open: false, severity: "", message: "" });
  const [existingPlannings, setExistingPlannings] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/get-plannings")
      .then((res) => res.json())
      .then((data) => setExistingPlannings(data))
      .catch((err) => {
        console.error("Erreur lors du chargement des plannings :", err);
      });
  }, []);

  const showAlert = (severity, message) => {
    setAlert({ open: true, severity, message });
  };

  const handleSubmit = async () => {
    const today = new Date().setHours(0, 0, 0, 0);

    if (!nomPlanning.trim()) {
      showAlert("error", "❌ Le nom du planning est requis.");
      return;
    }

    if (!debutPlanning || !finPlanning) {
      showAlert("error", "❌ Les dates de début et de fin sont obligatoires.");
      return;
    }

    if (new Date(debutPlanning) >= new Date(finPlanning)) {
      showAlert("error", "❌ La date de début doit être antérieure à la date de fin.");
      return;
    }

    if (new Date(finPlanning) < today) {
      showAlert("error", "❌ La date de fin ne peut pas être dans le passé.");
      return;
    }

    const nameExists = existingPlannings.some(
      (p) => p.nom.toLowerCase() === nomPlanning.trim().toLowerCase()
    );

    if (nameExists) {
      showAlert("error", "❌ Un planning avec ce nom existe déjà.");
      return;
    }

    const newPlanning = {
      id: Date.now(),
      nom: nomPlanning.trim(),
      debut: debutPlanning,
      fin: finPlanning,
      members: [],
    };

    try {
      const response = await fetch("http://localhost:5000/save-plannings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPlanning),
      });

      if (response.ok) {
        showAlert("success", "✅ Planning sauvegardé avec succès !");
        setNomPlanning("");
        setDebutPlanning("");
        setFinPlanning("");
        setExistingPlannings((prev) => [...prev, newPlanning]);
      } else {
        const errorData = await response.json();
        showAlert("error", "❌ Erreur : " + errorData.error);
      }
    } catch (err) {
      showAlert("error", "❌ Erreur de connexion : " + err.message);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#f5f5f5",
        p: 2,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 500,
          backgroundColor: "#fff",
          padding: 4,
          borderRadius: 3,
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" sx={{ textAlign: "center", mb: 3 }}>
          <CalendarMonthIcon sx={{ verticalAlign: "middle", mr: 1 }} />
          Créer un planning
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nom du planning"
              value={nomPlanning}
              onChange={(e) => setNomPlanning(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Date de début"
              type="date"
              value={debutPlanning}
              onChange={(e) => setDebutPlanning(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Date de fin"
              type="date"
              value={finPlanning}
              onChange={(e) => setFinPlanning(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              Ajouter Planning
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={alert.severity}
          variant="filled"
          onClose={() => setAlert({ ...alert, open: false })}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreatePlanning;
