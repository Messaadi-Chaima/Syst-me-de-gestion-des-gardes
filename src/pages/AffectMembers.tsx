import React, { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import axios from "axios";

const generateDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dateArray = [];
  while (start <= end) {
    dateArray.push(new Date(start).toISOString().split("T")[0]);
    start.setDate(start.getDate() + 1);
  }
  return dateArray;
};

const AffectMembers = () => {
  const [plannings, setPlannings] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedPlanningId, setSelectedPlanningId] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedDays, setSelectedDays] = useState({});
  const [planningDates, setPlanningDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetching planning and members data
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/get-data")
      .then((res) => {
        const planningsData = Array.isArray(res.data.plannings) ? res.data.plannings : [];
        const membersData = Array.isArray(res.data.members) ? res.data.members : [];

        // Associer les membres à leurs plannings
        const planningsWithMembers = planningsData.map(planning => {
          // Chercher les membres pour chaque planning
          const membersForPlanning = membersData.filter(member => planning.members.includes(member.id));
          return { ...planning, members: membersForPlanning };
        });

        setPlannings(planningsWithMembers);
        setMembers(membersData);
        setLoading(false);
        console.log("Données chargées:", { plannings: planningsWithMembers, members: membersData });
      })
      .catch((error) => {
        setError("Erreur de récupération des données: " + error.message);
        console.error("Erreur API:", error);
        setLoading(false);
      });
  }, []);

  // When a planning is selected, generate the date range
  useEffect(() => {
    if (!selectedPlanningId || !Array.isArray(plannings)) return;
    
    const planning = plannings.find((p) => p.id === selectedPlanningId);
    if (planning) {
      setPlanningDates(generateDateRange(planning.debut, planning.fin));
    }
  }, [selectedPlanningId, plannings]);

  const handleDayChange = (member, day) => {
    setSelectedDays((prev) => {
      const days = prev[member] || [];
      const updated = days.includes(day)
        ? days.filter((d) => d !== day)
        : [...days, day];
      return { ...prev, [member]: updated };
    });
  };

  const handleSubmit = () => {
    if (!selectedPlanningId || selectedMembers.length === 0) {
      alert("Sélectionner un planning et des membres");
      return;
    }
    
    const payload = {
      planningId: selectedPlanningId,
      assignments: selectedMembers.map((member) => ({
        member,
        days: selectedDays[member] || [],
      })),
    };
    
    setLoading(true);
    axios.post("http://localhost:5000/save-assignments", payload)
      .then(response => {
        alert("Les affectations ont été sauvegardées avec succès");
        setLoading(false);
      })
      .catch(error => {
        setError("Erreur lors de la sauvegarde: " + error.message);
        setLoading(false);
      });
  };

  return (
    <Box sx={{ width: "80%", mx: "auto", padding: 4 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Affecter les membres au planning
      </Typography>

      {loading && <Typography>Chargement des données...</Typography>}
      {error && <Typography color="error">{error}</Typography>}

      <FormControl fullWidth margin="normal">
        <InputLabel>Choisir un planning</InputLabel>
        <Select
          value={selectedPlanningId}
          onChange={(e) => setSelectedPlanningId(e.target.value)}
          label="Choisir un planning"
        >
          {Array.isArray(plannings) ? plannings.map((planning) => (
            <MenuItem key={planning.id} value={planning.id}>
              {planning.nom}
            </MenuItem>
          )) : <MenuItem value="">Aucun planning disponible</MenuItem>}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Choisir des membres</InputLabel>
        <Select
          multiple
          value={selectedMembers}
          onChange={(e) => setSelectedMembers(e.target.value)}
          label="Choisir des membres"
        >
          {Array.isArray(members) ? members.map((member) => (
            <MenuItem key={member.id} value={member.id}>
              {member.Nom} {member.Prenom}
            </MenuItem>
          )) : <MenuItem value="">Aucun membre disponible</MenuItem>}
        </Select>
      </FormControl>

      {selectedPlanningId && (
        <>
          <Typography variant="h6" marginY={2}>
            Jours de garde
          </Typography>
          <Grid container spacing={2}>
            {planningDates.map((day) => (
              <Grid item xs={12} sm={4} key={day}>
                <Box display="flex" alignItems="center">
                  <Typography>{day}</Typography>
                  {selectedMembers.map((member) => (
                    <FormControlLabel
                      key={member}
                      control={
                        <Checkbox
                          checked={selectedDays[member]?.includes(day) || false}
                          onChange={() => handleDayChange(member, day)}
                        />
                      }
                      label={member}
                    />
                  ))}
                </Box>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSubmit}
        disabled={loading}
        sx={{ marginTop: 4 }}
      >
        Sauvegarder les affectations
      </Button>
    </Box>
  );
};

export default AffectMembers;
