import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Typography, Box } from "@mui/material";
import axios from "axios";

const PlanningManager = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // Chargement des plannings avec affectations
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/get-plannings-with-assignments");
        const data = response.data;

        const formattedRows = data.flatMap((planning) =>
          planning.members.map((member, index) => ({
            id: `${planning.id}-${member.id}-${index}`,
            planningId: planning.id,
            nomPlanning: planning.nom || "-",
            debut: planning.debut || "-",
            fin: planning.fin || "-",
            membre: member.name || "-",
            jours: member.days || [],
          }))
        );

        setRows(formattedRows);
      } catch (error) {
        console.error("Erreur lors du chargement :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fonction pour ajuster dynamiquement la hauteur des lignes
  const getRowHeight = (params) => {
    const jours = params.model?.jours;
    if (!jours || !Array.isArray(jours)) return 52;
    const lignes = jours.length;
    const ligneHauteur = 22;
    return Math.max(52, ligneHauteur * lignes);
  };

  const columns = [
    { field: "nomPlanning", headerName: "Nom du planning", width: 200 },
    { field: "debut", headerName: "Début", width: 150 },
    { field: "fin", headerName: "Fin", width: 150 },
    { field: "membre", headerName: "Membre", width: 200 },
    {
      field: "jours",
      headerName: "Jours Affectés",
      width: 300,
      renderCell: (params) =>
        Array.isArray(params.value) ? (
          <Box sx={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}>
            {params.value.join("\n")}
          </Box>
        ) : (
          "-"
        ),
    },
  ];

  return (
    <Box sx={{ height: "auto", width: "100%", padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Planning avec Affectations
      </Typography>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        autoHeight
        getRowHeight={getRowHeight}
        disableRowSelectionOnClick
        sx={{ backgroundColor: "#f9f9f9", borderRadius: 2 }}
      />
    </Box>
  );
};

export default PlanningManager;
