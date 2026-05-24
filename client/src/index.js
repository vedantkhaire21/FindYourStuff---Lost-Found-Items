import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#4F7CFF",
      light: "#7B9FFF",
      dark: "#2E5CE6",
    },
    secondary: {
      main: "#8B5CF6",
    },
    success: {
      main: "#10B981",
    },
    background: {
      default: "#0B1020",
      paper: "#111827",
    },
    text: {
      primary: "#F1F5F9",
      secondary: "#94A3B8",
    },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", system-ui, -apple-system, sans-serif',
    h1: { fontWeight: 800, letterSpacing: "-0.02em" },
    h2: { fontWeight: 700, letterSpacing: "-0.01em" },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "10px",
          textTransform: "none",
          fontWeight: 600,
          letterSpacing: "0.01em",
          transition: "all 0.2s ease",
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #4F7CFF 0%, #6B5FFF 100%)",
          boxShadow: "0 4px 15px rgba(79, 124, 255, 0.35)",
          "&:hover": {
            background: "linear-gradient(135deg, #5E8AFF 0%, #7B6FFF 100%)",
            boxShadow: "0 6px 20px rgba(79, 124, 255, 0.5)",
            transform: "translateY(-1px)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: "rgba(17, 24, 39, 0.8)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "16px",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
            background: "rgba(255,255,255,0.04)",
            "& fieldset": {
              borderColor: "rgba(255,255,255,0.12)",
            },
            "&:hover fieldset": {
              borderColor: "rgba(79, 124, 255, 0.5)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#4F7CFF",
              boxShadow: "0 0 0 3px rgba(79, 124, 255, 0.15)",
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          background: "#1A2235",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          "&:hover": {
            background: "rgba(79, 124, 255, 0.12)",
          },
        },
      },
    },
    MuiModal: {
      styleOverrides: {
        root: {},
      },
    },
    MuiPagination: {
      styleOverrides: {
        root: {},
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: "2px solid rgba(79, 124, 255, 0.3)",
        },
      },
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <App />
  </ThemeProvider>,
);
