import React, { useEffect, useState } from "react";
import ReservationFormAdmin from "./ReservationFormAdmin";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Badge,
  TablePagination,
  Typography,
  Fade
} from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";
import { format } from "date-fns";
import Cars from "./Cars";

// Styled components using Material UI's styling system
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  boxShadow: theme?.shadows[5] || '0px 4px 10px rgba(0, 0, 0, 0.1)', // Fallback to a default box shadow
  borderRadius: '12px',
  overflow: 'hidden',
}));

const StyledTable = styled(Table)(({ theme }) => ({
  minWidth: 650,
  '& thead': {
    backgroundColor: '#1f2e4e', // Deep blue color for the header
    color: 'white', // White text color for header cells
  },
  '& th': {
    fontWeight: 'bold',
    color: 'white', // Explicitly set the text color to white for header cells
  },
  '& tbody tr:hover': {
    backgroundColor: theme.palette.action.hover,
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
}));

const ReservationsTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [reservations, setReservations] = useState([]);

  // Fetch reservations data
 const fetchReservations = async () => {
   const apiKey = localStorage.getItem("apiKey"); // Retrieve the API key from localStorage
   if (!apiKey) {
    window.location.href = "/auth"
     throw new Error("API key is not available in localStorage.");
     
   }
   try {
     const response = await fetch("https://localhost:7017/api/Reservations/get_all", {
       method: "GET", // Method is GET since your API uses [HttpGet]
       headers: {
         "Authorization": `Bearer ${apiKey}`,
       },
     });

     if (response.ok) { // Check if the response is successful (status 200-299)
       const data = await response.json(); // Parse the JSON response
      //console.log(data)
       if (data && Array.isArray(data) && data.length > 0) {
         setReservations(data); // Set reservations if data is an array and has elements
       } else {
         console.log("There are no reservations.");
       }
     } else {
      window.location.href = "/auth"
       console.log("Failed to fetch reservations. Response not OK.");
     }
   } catch (error) {
    window.location.href = "/auth"
     console.error("Error fetching reservations:", error);
   }
};


  useEffect(() => {
    fetchReservations();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const calculateDaysBetweenDates = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    const differenceInMs = end - start;
  
    const differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);
  
    return differenceInDays;
  };

  const paginatedReservations = reservations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
    <ReservationFormAdmin></ReservationFormAdmin>
    <div style={{ padding: "20px" }}>
      <div
        className="text-center mx-auto pb-5 wow fadeInUp"
        data-wow-delay="0.1s"
        style={{ maxWidth: "800px" }}
      >
        <h1 className="display-5 text-capitalize mb-3" style={{ marginTop: '50px' }}>
          Reservations <span className="text-primary">Categories</span>
        </h1>
        <p className="mb-0">All the reservation details</p>
      </div>

      <StyledTableContainer component={Paper}>
        <StyledTable aria-label="transaction table">
          <TableHead>
            <TableRow>
              <TableCell>Reservation ID</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Licence Plate</TableCell>
              <TableCell>Car</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedReservations.map((reservation, index) => {
              const reservationData = reservation.reservation || {}; // Safeguard if reservation or reservationData is undefined
              const reservationKey = reservationData.id || index; // Use reservation.id or fallback to index

              return (
                <Fade
                  in
                  timeout={500}
                  style={{ transitionDelay: `${index * 100}ms` }}
                  key={reservationKey} // Ensure each row has a unique key
                >
                  <TableRow>
                    <TableCell>{reservationData.id}</TableCell>
                    <TableCell>{reservation.client.name}</TableCell>
                    <TableCell>{reservation.car.plateNum}</TableCell>
                    <TableCell>{reservation.car.model}</TableCell>
                    <TableCell>
                      <Badge
                        color={new Date(reservationData.endDate) < new Date() ? "success" : "error"}  // Check if the reservation has ended
                        badgeContent={new Date(reservationData.endDate) < new Date() ? "Finished" : "Client"}  // Ensure there's a fallback for status
                      />
                    </TableCell>
                    <TableCell>{format(reservationData.startDate, "dd/MM/yyyy")}</TableCell>
                    <TableCell>{format(reservationData.endDate, "dd/MM/yyyy")}</TableCell>
                    {/* Ensure 'amount' is a valid number */}
                    <TableCell>{`$${(calculateDaysBetweenDates(reservationData.startDate, reservationData.endDate) * reservation.car.dailyPrice || 0).toFixed(2)}`}</TableCell>
                    <TableCell>{reservationData.description || "No Description"}</TableCell>
                  </TableRow>
                </Fade>
              );
            })}
          </TableBody>
        </StyledTable>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={reservations.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          style={{ backgroundColor: "#fafafa", borderRadius: "0 0 12px 12px" }}
        />
      </StyledTableContainer>
    <Cars reservations={reservations} />

    </div>
    </>
  );
};

export default ReservationsTable;
