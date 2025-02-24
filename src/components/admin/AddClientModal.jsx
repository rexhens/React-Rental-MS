import React, { useState, useEffect } from 'react';
import { Modal, Box, Button, TextField, Select, MenuItem } from '@mui/material';
import axios from 'axios';

// Modal styling
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 4,
  boxShadow: 24,
  p: 3, // Padding added here to avoid inputs sticking to edges
};

export default function AddClientModal({open,handleClose}){

  const [personalNumber, setPersonalNumber] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [celNumber, setCelNumber] = useState('');
  const [driversLicenseNo, setDriversLicenseNo] = useState('');
  const [message, setMessage] = useState('')

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

  async function handleAddClient() {
    const clientData = {
  personalNumber: personalNumber,
  driversLicenseNo: driversLicenseNo,
  name: name,
  surname: surname,
  phoneNum: celNumber,
  email: email,
  password: password
};

try {
  const response = await axios.post('https://localhost:7017/api/Clients/Add', clientData);
  
  if (response.status === 200) {
    console.log('Client added successfully:', response.data);
    
    const token = "Client";
    localStorage.setItem('token', token);
    localStorage.setItem('personalNo',clientData.personalNumber)
    window.location.href = '/admin'
}
} catch (error) {
  if (error.response) {
    console.error('Error:', error.response.data);
  } else {
    console.error('Error adding client:', error.message);
  }
}
  }

   return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
      <Box sx={modalStyle}>
        <form style={{ width: '100%' }}>
          <TextField
            label="PersonalNumber"
            name="personalNumber"
            value={personalNumber}
            onChange={handleInputChange}
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            name="password"
            value={password}
            onChange={handleInputChange}
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Name"
            name="name"
            value={name}
            onChange={handleInputChange}
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Surname"
            name="surname"
            value={surname}
            onChange={handleInputChange}
            variant="outlined"
            fullWidth
            margin="normal"
          />
           <TextField
            label="Email"
            name="email"
            value={email}
            onChange={handleInputChange}
            variant="outlined"
            fullWidth
            margin="normal"
          />
           <TextField
            label="CelNumber"
            name="celNumber"
            value={celNumber}
            onChange={handleInputChange}
            variant="outlined"
            fullWidth
            margin="normal"
          />
           <TextField
            label="DriversLicenseNo"
            name="driversLicenseNo"
            value={driversLicenseNo}
            onChange={handleInputChange}
            variant="outlined"
            fullWidth
            margin="normal"
          />


          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginTop: 2 }}>
            <Button onClick={handleClose} className="btn btn-primary rounded-pill" sx={{ marginTop: 2 }}>
              Cancel
            </Button>
            <Button onClick={handleAddClient} className="btn btn-primary rounded-pill" sx={{ backgroundColor: '#1F2E4E', marginTop: 2 }}>
              Save Changes
            </Button>
          </Box>

          {message && <Box sx={{ textAlign: 'center', marginTop: 2 }}>{message}</Box>}
        </form>
      </Box>
    </Modal>
  );
}