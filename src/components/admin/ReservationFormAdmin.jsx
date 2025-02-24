import carPhoto from "../../img/carousel-1.jpg";
import React, { useState, useEffect } from "react";
import axios from "axios";
import AddClientModal from './AddClientModal'

const ReservationFormAdmin = () => {
  const [formData, setFormData] = useState({
    carId: "",
    pickUpLocation: "",
    dropOffLocation: "",
    pickUpDate: "",
    pickUpTime: "12:00AM",
    dropOffDate: "",
    dropOffTime: "12:00AM",
    clientId: "K12123412A",
  });

  const [cars, setCars] = useState([]);
  const [message, setMessage] = useState("");
  const [openModal, setOpenModal] = useState(false);
  

  const [clients, setClients] = useState([])
  const [showComponent, setShowComponent] = useState(false);
  
    const handleAddClientModal = () => {
      setShowComponent(true);
    };
  
 const handleCloseModal = () => {
    setShowComponent(false);  // Close the modal
  };

  // Fetch available cars
 const fetchCars = async () => {
   const apiKey = localStorage.getItem("apiKey"); // Retrieve the API key from localStorage
   //console.log(`Authorization Header Sent: Bearer ${apiKey}`);
   if (!apiKey) {
     alert('You are not logged in');
       window.location.href = "/auth"
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
       //console.log(data); // Check the data structure in the console
       
       if (data && Array.isArray(data) && data.length > 0) {
         setCars(data); // Set cars if data is an array and has elements
       } else {
         setMessage("No cars available."); // Handle if the array is empty
       }
     } else {
       throw new Error('Failed to fetch cars. Response not OK.');
     }
   } catch (error) {
     console.error("Error fetching cars:", error);
     setMessage("Failed to fetch cars.");
   }
};


  useEffect(() => {
    fetchCars();
  }, []);

  const fetchClients = async () => {
    try{
        const response = await axios.get("https://localhost:7017/api/Clients/GetAll");
        if(response.config && response.data.length > 0){
          console.log(response.data)
            setClients(response.data)
        }else{
            setMessage("NO clients available")
        }
    }catch(error){
        setMessage(error)
    }
  }

  useEffect(() => {
    fetchClients();
  }, []);
  

  // Update form data on change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle reservation and PDF download
 // Handle reservation and PDF download
 const handleReservation = async () => {
   const apiKey = localStorage.getItem("apiKey"); // Retrieve the API key from localStorage
   //console.log(`Authorization Header Sent: Bearer ${apiKey}`);
   if (!apiKey) {
     alert('You are not logged in');
       window.location.href = "/auth"
   }
  if (!formData.carId) {
    setMessage("Please select a car.");
    return;
  }

  const reservationData = new FormData();
  reservationData.append("CarId", formData.carId);
  reservationData.append("ClientId", formData.clientId); // Replace with actual client ID
  reservationData.append("StartDate", formData.pickUpDate);
  reservationData.append("EndDate", formData.dropOffDate);

  try {
    // Step 1: Create reservation
    const response = await fetch("https://localhost:7017/api/Reservations/add", {
      method: "POST",
      body: reservationData,
      headers: {  
        "Authorization": `Bearer ${apiKey}`,
      }
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Failed to create reservation.");
    }

    // Step 2: Parse the JSON response and get reservationId
    const result = await response.json();
    setMessage(result.message || "Reservation created successfully.");

    // Step 3: Fetch PDF after reservation is created
    const pdfResponse = await fetch(`https://localhost:7017/api/Reservations/pdf?reservationId=${result.reservationId}`, {
      method: "GET",
    });

    if (!pdfResponse.ok) {
      throw new Error("Failed to fetch PDF.");
    }

    // Step 4: Handle PDF blob (binary data)
    const blob = await pdfResponse.blob(); // Receive the PDF as a Blob

    // Step 5: Create a link to download the PDF
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob); // Create an object URL for the Blob
    link.download = `bill_no_${result.reservationId}.pdf`;  // Set the desired file name
    link.click();  // Trigger the download
  } catch (error) {
    console.error("Error:", error);
    setMessage(error.message || "Error while reserving the vehicle.");
  }
};




  return (
    <div id="carouselId" className="carousel slide" data-bs-ride="carousel" data-bs-interval="false">
      <div className="carousel-inner" role="listbox">
        <div className="carousel-item active">
          <img src={carPhoto} className="img-fluid w-100" alt="First slide" />
          <div className="carousel-caption">
            <div className="container py-4">
              <div className="row g-5">
                <div className="col-lg-6 fadeInLeft animated" style={{ animationDelay: "1s" }}>
                  <div className="bg-secondary rounded p-5">
                    <h4 className="text-white mb-4">CONTINUE CAR RESERVATION</h4>
                    {message && <p className="text-warning">{message}</p>}
                    <form>
                      <div className="row g-3">
                        <div className="col-12">
                          <select
                            className="form-select"
                            name="carId"
                            value={formData.carId}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select The Car Type</option>
                            {cars.map((car) => (
                              <option key={car.id} value={car.id}>
                                {car.model}
                              </option>
                            ))}
                          </select>
                        </div>
                      <div className="col-12" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
  	                 <select
                      className="form-select"
                      name="clientId"
                      value={formData.clientId}
                      onChange={handleChange}
                      required
                    >
                    <option value="">Select The Client</option>
                    {clients.map((client) => (
                    <option key={client.personalNumber} value={client.personalNumber}>
                    {client.name + " " + client.surname}
                    </option>
                    ))}
                    </select>
                    <button style={{ padding: '0 10px', height: 'fit-content', borderRadius: '8px', backgroundColo:'white' }} onClick={handleAddClientModal}>+</button>
                      </div>

                        <div className="col-12">
                          <input
                            className="form-control"
                            type="text"
                            name="pickUpLocation"
                            value={formData.pickUpLocation}
                            onChange={handleChange}
                            placeholder="Pick Up Location"
                            required
                          />
                        </div>
                        <div className="col-12">
                          <input
                            className="form-control"
                            type="text"
                            name="dropOffLocation"
                            value={formData.dropOffLocation}
                            onChange={handleChange}
                            placeholder="Drop Off Location"
                            required
                          />
                        </div>
                        <div className="col-6">
                          <input
                            className="form-control"
                            type="date"
                            name="pickUpDate"
                            value={formData.pickUpDate}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="col-6">
                          <input
                            className="form-control"
                            type="date"
                            name="dropOffDate"
                            value={formData.dropOffDate}
                            onChange={handleChange}
                            required
                          />
                        </div>
                    
                        <div className="col-12">
                          <button
                            className="btn btn-light w-100 py-2"
                            type="button"
                            onClick={handleReservation}
                          >
                           Reserve this vehicle
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="col-lg-6 d-none d-lg-flex fadeInRight animated" style={{ animationDelay: "1s" }}>
                  <div className="text-start">
                    <h1 className="display-5 text-white">Car Reservation</h1>
                    <p className="text-white">Select the car, client and respective dates</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
{showComponent === true ? <AddClientModal open={showComponent} handleClose={handleCloseModal}></AddClientModal>: console.log()}
    </div>
  );
};

export default ReservationFormAdmin;
