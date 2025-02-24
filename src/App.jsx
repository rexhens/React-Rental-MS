import reactImg from './assets/react-core-concepts.png'
import Cars from './components/Cars.jsx'
import ReservationForm from './components/ReservationForm'
import Features from './components/Features'
import FactCounter from './components/FactCounter'
import Services from './components/Services'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AddCar from './components/admin/AddCar.jsx'
import ReservationsTable from './components/admin/ReservationsTable.jsx'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AuthenticationPage from './components/AuthenticationPage.jsx'
import ReservationFormAdmin from './components/admin/ReservationFormAdmin.jsx'
import LogOut from './components/admin/LogOut.jsx'
const theme = createTheme({
  palette: {
    primary: {
      main: '#6200ea', // Purple primary color
    },
    secondary: {
      main: '#03dac6', // Teal secondary color
    },
    background: {
      default: '#f5f5f5', // Light background color
      paper: '#ffffff', // White paper background color
    },
    text: {
      primary: '#333333', // Default text color
      secondary: '#666666', // Secondary text color
    },
    success: {
      main: '#4caf50', // Green success color
    },
    error: {
      main: '#f44336', // Red error color
    },
    warning: {
      main: '#ff9800', // Orange warning color
    },
    info: {
      main: '#2196f3', // Blue info color
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', // Default font
    h1: {
      fontSize: '2.25rem',
      fontWeight: 500,
      letterSpacing: '-0.5px',
    },
    h2: {
      fontSize: '1.875rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  spacing: 8, // Default spacing for your layout
  shape: {
    borderRadius: 8, // Rounded corners for components
  },
  shadows: Array(25).fill('0px 4px 10px rgba(0, 0, 0, 0.1)'), // Default shadow for components
});
const router = createBrowserRouter([
  {path:'/', element: <div>
    <ReservationForm></ReservationForm>
    <Features></Features>
    <FactCounter></FactCounter>
    <Services></Services>
  <Cars />
</div>},
  {path:'/add', element:<AddCar/>},
  {path:'/admin', element:<ThemeProvider theme={theme}>
   <ReservationsTable/>  </ThemeProvider>},
  {path:'/add', element: <AddCar/>},
  {path:'/auth', element: <AuthenticationPage/>},
  {path:'/logout', element: <LogOut/>}
])

function App() {

  return (
   <RouterProvider router={router}/>
  );
}
 
export default App;
