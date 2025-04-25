import * as React from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ComputerIcon from '@mui/icons-material/Computer';
import PrintIcon from '@mui/icons-material/Print';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import StorageIcon from '@mui/icons-material/Storage';

export default function HomePage() {
  // Données des cartes pour éviter la répétition de code
  const materials = [
    { icon: <ComputerIcon />, label: "PC Portable", number: "5" },
    { icon: <PrintIcon />, label: "Imprimante", number: "5" },
    { icon: <DesktopWindowsIcon />, label: "Unité Centrale", number: "5" },
    { icon: <DesktopWindowsIcon />, label: "Écran", number: "5" },
    { icon: <StorageIcon />, label: "Serveur", number: "2" },
  ];

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid container spacing={3} justifyContent="start">
        {materials.map((material, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card variant="outlined" sx={{ width: "100%" }}>
              <Box sx={{ p: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {material.icon}
                  <Typography gutterBottom variant="h5">
                    {material.label}
                  </Typography>
                </Box>
              </Box>
              <Divider />
              <Box sx={{ p: 2, textAlign: "center" }}>
                <Typography gutterBottom variant="h6">{material.number}</Typography>
                <Button variant="outlined" startIcon={<OpenInNewIcon />}>
                  Ouvrir
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
