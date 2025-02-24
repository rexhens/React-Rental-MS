import axios from "axios";
import { Link, redirect, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Grid, Typography } from "@mui/material";

export default function AuthenticationPage() {
  const [searchParams] = useSearchParams();
  const isLogin = searchParams.get('mode') === 'login';
  const navigate = useNavigate()
  // Form state
  const [personalNumber, setPersonalNumber] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [celNumber, setCelNumber] = useState('');
  const [driversLicenseNo, setDriversLicenseNo] = useState('');

    useEffect(() => {
    if (!searchParams.get('mode')) {
      navigate('/auth?mode=login', { replace: true });
    }
  }, [searchParams, navigate]);
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'personalNumber':
        setPersonalNumber(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'name':
        setName(value);
        break;
      case 'surname':
        setSurname(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'celNumber':
        setCelNumber(value);
        break;
      case 'driversLicenseNo':
        setDriversLicenseNo(value);
        break;
      default:
        break;
    }
  };

  // Handle form submission
async function handleClick() {
  if (isLogin) {
    try {
      const response = await axios.post(
        'https://localhost:7017/api/Clients/login',
        {
          personalNo: personalNumber,
          password: password,
        }
      );

      if (response.status === 200) {
        const apiKey = response.data.apiKey;
        localStorage.setItem('apiKey', apiKey);
       // console.log(apiKey)
        //console.log(localStorage.getItem('apiKey'))
        navigate('/admin');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('Invalid credentials');
      } else {
        alert('An error occurred while logging in.');
        console.error('Error:', error.message);
      }
    }
  }
}



  return (
    <Container maxWidth="sm" style={{ marginTop: '50px' }}>
      <Typography variant="h4" gutterBottom>
        {isLogin ? 'Log In Page' : 'Sign Up Page'}
      </Typography>

      <form noValidate autoComplete="off">
        <Grid container spacing={2}>
          {/* Personal Number Input */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Personal Number"
              name="personalNumber"
              type="text"
              value={personalNumber}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>

          {/* Password Input */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>

          {/* Sign Up Fields */}
          {!isLogin && (
            <>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Surname"
                  name="surname"
                  type="text"
                  value={surname}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="celNumber"
                  type="text"
                  value={celNumber}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Driver's License No"
                  name="driversLicenseNo"
                  type="text"
                  value={driversLicenseNo}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
            </>
          )}

          {/* Submit Button */}
         <Grid item xs={12}>
  <Button
    fullWidth
    variant="contained"
    style={{
      backgroundColor: '#1f2e4e',
      color: '#ffffff',
    }}
    onClick={handleClick}
  >
    {isLogin ? 'Log In' : 'Sign Up'}
  </Button>
</Grid>

        </Grid>
      </form>

      <Link to={`?mode=${isLogin ? 'signup' : 'login'}`}>
        {isLogin ? 'Create a new account' : 'Already have an account? Log in'}
      </Link>
    </Container>
  );
}
