import React, { useEffect, useState } from "react";
import axios from "axios";
import $ from "jquery";
import UpdateCarModal from "./UpdateCarModal";
import './Cars.css'

const Cars = ({reservations}) => {
  const [cars, setCars] = useState([]); // All cars fetched from the API
  const [message, setMessage] = useState(""); // Message to show if no cars are found
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [carsPerPage] = useState(3); // Number of cars to show per page
  const [selectedCar, setSelectedCar] = useState(null); // Track the selected car for the modal
  const [openModal, setOpenModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [filteredCars, setFilteredCars] = useState([]); // State for filtered cars
  const [showAvailableDatePicker, setShowAvailableDatePicker] = useState(false)
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentCars, setCurrentCars] = useState([]);

const handleStartDateChange = (e) => {
  setStartDate(e.target.value);
};

const handleEndDateChange = (e) => {
  setEndDate(e.target.value);
};


  const handleUpdateClick = (car) => {
    setSelectedCar(car);  // Set the selected car data
    setOpenModal(true);    // Open the modal
  };

  const handleCloseModal = () => {
    setOpenModal(false);  // Close the modal
  };

  // Search functionality
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter cars based on search query
  useEffect(() => {
    const filtered = cars.filter((car) =>
      car.model.toLowerCase().includes(searchQuery.toLowerCase()) || 
      car.category?.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCars(filtered); // Update filtered cars based on search query
    setCurrentPage(1); // Reset to first page when search query changes
  }, [searchQuery, cars]);

  // Fetch cars from the API
 const fetchCars = async () => {
   const apiKey = localStorage.getItem("apiKey"); // Retrieve the API key from localStorage
   if (!apiKey) {
     throw new Error("API key is not available in localStorage.");
   }
   try {
     const response = await fetch("https://localhost:7017/api/Cars/get_cars", {
       method: "GET", // Change to POST
       headers: {
         "Authorization": `Bearer ${apiKey}`,
       },
     });

     if (response.ok) { // Check if the response is successful (status 200-299)
       const data = await response.json(); // Parse the JSON response
       
       if (data && Array.isArray(data) && data.length > 0) {
         setCars(data); // Set cars if data is an array and has elements
       } else {
         setMessage("No cars available."); // Handle if the array is empty
       }
     } else {
       alert('You have to log in first.');
       window.location.href = "/auth"
     }
   } catch (error) {
     console.error("Error fetching cars:", error);
     setMessage("Failed to fetch cars.");
     window.location.href = "/auth"
   }
};

  useEffect(() => {
    fetchCars();
  }, []);

useEffect(() => {
  let filtered = cars;

  // Apply search query filter
  if (searchQuery) {
    filtered = filtered.filter((car) =>
      car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.category?.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Apply date range filter if both start and end date are selected
  if (startDate && endDate) {
    filtered = handleFilterAvailableCars()
  }

  // Update the filtered cars state with the combined filter
  setFilteredCars(filtered);
  setCurrentPage(1); // Reset to first page after filtering
}, [searchQuery, startDate, endDate, cars]);

const handleFilterAvailableCars = () => {
  if (!startDate || !endDate) {
    alert("Please select both start and end dates.");
    return cars; // Return unfiltered cars if no dates are selected
  }

  const selectedStartDate = new Date(startDate);
  const selectedEndDate = new Date(endDate);


  try {
    // Filter cars based on reservation overlap
    const filteredCars = cars.filter((car) => {
      // Get reservations for the current car
      const carReservations = reservations.filter(
        (reservation) => reservation.car.id === car.id
      );
      // Check if the car has any overlapping reservations
      const isAvailable = !carReservations.some((reservation) => {
        const reservationStartDate = new Date(reservation.reservation.startDate);
        const reservationEndDate = new Date(reservation.reservation.endDate);

        // Overlap logic
        const overlaps = (
          reservationStartDate < selectedEndDate &&
          reservationEndDate > selectedStartDate
        );

        return overlaps; // Return true if there's an overlap
      });

      return isAvailable; // Include car if it's available
    });

    return filteredCars;
  } catch (error) {
    console.error("Error filtering available cars:", error);
    alert("An error occurred while filtering cars. Please try again.");
    return cars; // Return unfiltered cars in case of error
  }
};

  // Get the cars to display on the current page
 useEffect(() => {
  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;

  // Decide whether to display filtered cars or all cars
const carsToDisplay = filteredCars.length > 0 || searchQuery || (startDate && endDate)
  ? filteredCars
  : cars;
  // Slice the cars for the current page
  const slicedCars = carsToDisplay.slice(indexOfFirstCar, indexOfLastCar);

  setCurrentCars(slicedCars);
}, [currentPage, carsPerPage, filteredCars, cars]); // Dependencies

  // Change page handler
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  let totalPages = 0
  // Calculate total pages
  filteredCars.length === 0 ? totalPages = 0 : totalPages = Math.ceil(filteredCars.length / carsPerPage);
  
  const refreshCarsList = async () => {
    await fetchCars(); // Re-fetch the cars list
  };

 function handleAvailableCarsBtn() {
  setShowAvailableDatePicker((prev) => !prev); // Toggle the visibility of the date picker
  
}

  return (
    <section id="cars-section" style={{ marginTop: "100px" }}>
      <div className="container-fluid categories pb-5">
        <div className="container pb-5">
          <div
            className="text-center mx-auto pb-5 wow fadeInUp"
            data-wow-delay="0.1s"
            style={{ maxWidth: "800px" }}
          >
            <h1 className="display-5 text-capitalize mb-3">
              Vehicle <span className="text-primary">Catalog</span>
            </h1>
            <p className="mb-0">
              Browse through our collection of available vehicles and find the one that suits you best!
            </p>
            {message && <p className="text-center">{message}</p>}
            <a
              href="http://localhost:5173/add"
              className="btn btn-primary rounded-pill d-flex justify-content-center py-3"
              style={{ marginTop: "20px" }}
            >
              Add a new Car
            </a>
            <button onClick={handleAvailableCarsBtn} className="btn btn-primary rounded-pill" id="availableCarsBtn">Available cars</button>
{showAvailableDatePicker && (
  <div>
    <input
      type="date"
      value={startDate}
      onChange={handleStartDateChange}
      placeholder="Start Date"
    />
    <input
      type="date"
      value={endDate}
      onChange={handleEndDateChange}
      placeholder="End Date"
    />

<button className="btn btn-primary" onClick={() => { setStartDate(""); setEndDate(""); }}>Clear Dates</button>

  </div>
)}

          </div>
          <input
            type="text"
            placeholder="Search by Model or Category..."
            className="form-control my-4"
            value={searchQuery}
            onChange={handleSearchChange}
          />
  
          {/* Cars display */}
          <div className="categories-carousel owl-carousel wow fadeInUp" data-wow-delay="0.1s">
            {currentCars.map((car) => (
              <div className="categories-item p-4" key={car.id}>
                <div className="categories-item-inner">
                  <div className="categories-img rounded-top">
                    <img
                      src={`data:image/png;base64,${car.image}`}
                      className="img-fluid w-100 rounded-top"
                      alt={car.model}
                    />
                  </div>
                  <div className="categories-content rounded-bottom p-4">
                    <h4>{car.model}</h4>
                    <div className="categories-review mb-4">
                      <div className="me-3">4.5 Review</div>
                      {/* Star Rating */}
                      <div className="d-flex justify-content-center text-secondary">
                        {[...Array(5)].map((_, starIndex) => (
                          <i
                            key={starIndex}
                            className={`fas fa-star ${starIndex < 4.5 ? "text-warning" : "text-body"}`}
                          ></i>
                        ))}
                      </div>
                    </div>
                    <div className="mb-4">
                      <h4 className="bg-white text-primary rounded-pill py-2 px-4 mb-0">
                        ${car.dailyPrice} /Day
                      </h4>
                    </div>

                    <div className="row gy-2 gx-0 text-center mb-4">
                      <div className="col-4 border-end border-white">
                        <i className="fa fa-users text-dark"></i> 
                        <span className="text-body ms-1">4 Seat</span>
                      </div>
                      <div className="col-4 border-end border-white">
                        <i className="fa fa-car text-dark"></i> 
                        <span className="text-body ms-1">{car.yearProduction}</span>
                      </div>
                      <div className="col-4">
                        <i className="fa fa-gas-pump text-dark"></i> 
                        <span className="text-body ms-1">Petrol</span>
                      </div>
                    </div>

                    <div className="row gy-2 gx-0 text-center mb-4">
                      <div className="col-4 border-end border-white">
                        <i className="fa fa-users text-dark"></i> 
                        <span className="text-body ms-1">Model: {car.model}</span>
                      </div>
                      <div className="col-4 border-end border-white">
                        <i className="fa fa-car text-dark"></i> 
                        <span className="text-body ms-1">Category: {car.category.categoryName}</span>
                      </div>
                      <div className="col-4">
                        <i className="fa fa-gas-pump text-dark"></i> 
                        <span className="text-body ms-1">Motor: 3.6L</span>
                      </div>
                    </div>

                   <a
  href="#"
  className="btn btn-primary rounded-pill d-flex justify-content-center py-3"
  onClick={(e) => {
    e.preventDefault(); // Prevent default link behavior
    handleUpdateClick(car); // Open modal with selected car
  }}
>
  Edit Car
</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
  
          {/* Pagination Controls */}
          <div className="pagination-controls text-center mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="btn btn-primary rounded-pill me-2 "
              style={{ margin: "16px" }} // Using traditional CSS margin
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="btn btn-primary rounded-pill"
              style={{ margin: "16px" }} // Using traditional CSS margin
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Render the UpdateModal */}
      <UpdateCarModal
        car={selectedCar} 
        open={openModal}   
        handleClose={handleCloseModal}  
        onCarUpdated={refreshCarsList}
      />
    </section>
  );
};

export default Cars;
