import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { Outlet } from 'react-router';
import { AppProvider } from '@toolpad/core/AppProvider';
import { useDemoRouter } from '@toolpad/core/internal';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import type { Navigation } from '@toolpad/core/AppProvider';
import ComputerIcon from '@mui/icons-material/Computer';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

// Définir la navigation
const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'CreatePlanning',
    title: 'Cree un nouveau Planning',
    icon: <CalendarMonthIcon />,
  },
  {
    segment: 'Garde',
    title: 'Ajouter un membre',
    icon: <PersonAddIcon />,
  },
  {
    segment: 'AffectMembers',
    title: 'Affectation des membres',
    icon: <AssignmentIndIcon />,
  },
  {
    segment: 'PlanningManager',
    title: 'PlanningManager',
    icon: <EventNoteIcon />,
  },
];

// Définir la marque
const BRANDING = {
  logo: <ComputerIcon sx={{ fontSize: 32, color: 'primary.main' }} />,
  title: "Gestion matériel informatique",
};


// Créer un thème personnalisé
const customTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: {
    light: {
      palette: {
        background: {
          default: '#F9F9FE',
          paper: '#EEEEF9',
        },
      },
    },
    dark: {
      palette: {
        background: {
          default: '#2A4364',
          paper: '#112E4D',
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function DemoPageContent({ pathname }: { pathname: string }) {
  return (
    <Box
      sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Typography>Dashboard content for {pathname}</Typography>
    </Box>
  );
}

interface DemoProps {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window?: () => Window;
}

export default function AppProviderTheme(props: DemoProps) {
  const { window } = props;

  const router = useDemoRouter('/page');

  // Retirer cette ligne quand vous l'intégrez à votre projet.
  const demoWindow = window !== undefined ? window() : undefined;

  return (
    // Fournir le thème personnalisé et la navigation
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={customTheme}
      window={demoWindow}
    >
      {/* Fournir la navigation et la marque */}
      <ReactRouterAppProvider navigation={NAVIGATION} branding={BRANDING}>
        <Outlet />
      </ReactRouterAppProvider>
    </AppProvider>
  );
}
