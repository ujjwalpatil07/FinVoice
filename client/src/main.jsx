import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import { SnackbarProvider } from 'notistack';
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from "./context/ThemeProvider.jsx"
import { UserProvider } from './context/UserProvider.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <UserProvider>
          <SnackbarProvider maxSnack={3}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            autoHideDuration={2000}>
            <App />
          </SnackbarProvider>
        </UserProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
