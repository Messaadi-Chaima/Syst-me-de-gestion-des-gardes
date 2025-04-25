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

const generateDateRange = (startDate: string, endDate: string) => {
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
  interface Member {
    id: string | number;
    Nom?: string;
    nom?: string;
    Prenom?: string;
    prenom?: string;
  }

  interface Planning {
    id: string;
    nom: string;
    debut: string;
    fin: string;
    members: (string | Member)[];
  }

  const [plannings, setPlannings] = useState<Planning[]>([]);
  const [members, setMembers] = useState<Member[]>([]);

  const [selectedPlanningId, setSelectedPlanningId] = useState<string>("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<Record<string, string[]>>({});
  const [planningDates, setPlanningDates] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/get-data")
      .then((res) => {
        const planningsData = Array.isArray(res.data.plannings) ? res.data.plannings : [];
        const membersData = Array.isArray(res.data.members) ? res.data.members : [];

        const planningsWithMembers = planningsData.map((planning) => {
          const membersForPlanning = membersData.filter((member) =>
            Array.isArray(planning.members) && planning.members.includes(member.id)
          );
          return { ...planning, members: membersForPlanning };
        });

        setPlannings(planningsWithMembers);
        setMembers(membersData);
        setLoading(false);
      })
      .catch((error) => {
        setError("Erreur de récupération des données: " + error.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!selectedPlanningId || !Array.isArray(plannings)) return;

    const planning = plannings.find((p) => p.id === selectedPlanningId);
    if (planning) {
      setPlanningDates(generateDateRange(planning.debut, planning.fin));
    }
  }, [selectedPlanningId, plannings]);

  const handleDayChange = (memberId: string, day: string) => {
    setSelectedDays((prev) => {
      const days = prev[memberId] || [];
      const updated = days.includes(day)
        ? days.filter((d) => d !== day)
        : [...days, day];
      return { ...prev, [memberId]: updated };
    });
  };

  const handleSubmit = () => {
    if (!selectedPlanningId || selectedMembers.length === 0) {
      alert("Sélectionnez un planning et des membres.");
      return;
    }

    const payload = {
      planningId: selectedPlanningId,
      assignments: selectedMembers.map((memberId) => {
        // Recherche du membre dans la liste des membres
        const member = members.find((m) => String(m.id) === String(memberId));
        const nom = member?.Nom ?? member?.nom ?? "Nom ?";
        const prenom = member?.Prenom ?? member?.prenom ?? "";

        return {
          member: memberId,
          memberName: `${nom} ${prenom}`.trim(),  // Suppression de "Prenom ?"
          days: selectedDays[memberId] || [],
        };
      }),
    };

    setLoading(true);
    axios
      .post("http://localhost:5000/save-assignments", payload)
      .then(() => {
        alert("Les affectations ont été sauvegardées avec succès");
        setLoading(false);
      })
      .catch((error) => {
        setError("Erreur lors de la sauvegarde: " + error.message);
        setLoading(false);
      });
  };

  const getMemberName = (id: string | number) => {
    const member = members.find((m) => String(m.id) === String(id));
    if (!member) return `ID: ${id}`;

    const nom = member.Nom ?? member.nom ?? "Nom ?";
    const prenom = member.Prenom ?? member.prenom ?? "";
    return `${nom} ${prenom}`.trim();
  };

  return (
    <Box sx={{ width: "80%", mx: "auto", padding: 4 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Affecter les membres au planning
      </Typography>

      {loading && <Typography>Chargement...</Typography>}
      {error && <Typography color="error">{error}</Typography>}

      <FormControl fullWidth margin="normal">
        <InputLabel>Choisir un planning</InputLabel>
        <Select
          value={selectedPlanningId}
          onChange={(e) => setSelectedPlanningId(e.target.value)}
          label="Choisir un planning"
        >
          {plannings.map((planning) => (
            <MenuItem key={planning.id} value={planning.id}>
              {planning.nom}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Choisir des membres</InputLabel>
        <Select
          multiple
          value={selectedMembers}
          onChange={(e) => setSelectedMembers(e.target.value as string[])}
          label="Choisir des membres"
        >
          {members.map((member) => (
            <MenuItem key={member.id} value={String(member.id)}>
              {getMemberName(member.id)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedPlanningId && planningDates.length > 0 && (
        <>
          <Typography variant="h6" marginY={2}>
            Jours de garde
          </Typography>
          <Grid container spacing={2}>
            {planningDates.map((day) => (
              <Grid item xs={12} sm={6} md={4} key={day}>
                <Box>
                  <Typography variant="subtitle2">{day}</Typography>
                  {selectedMembers.map((memberId) => (
                    <FormControlLabel
                      key={memberId + day}
                      control={
                        <Checkbox
                          checked={selectedDays[memberId]?.includes(day) || false}
                          onChange={() => handleDayChange(memberId, day)}
                        />
                      }
                      label={getMemberName(memberId)}
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
