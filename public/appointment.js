document.addEventListener('DOMContentLoaded', function () {
  const appointmentsDiv = document.getElementById('appointments');
  console.log('Script loaded, attempting to fetch appointments...');

  fetchAppointments();

  async function fetchAppointments() {
    try {
      console.log('Sending request to fetch appointments...');
      const response = await fetch('/api/appointments', {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('jwt')
        }
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch appointments, status: ${response.status}`);
      }
      const appointments = await response.json();
      console.log('Appointments fetched:', appointments);
      displayAppointments(appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      appointmentsDiv.innerHTML = '<p>Error fetching appointments. Check console for details.</p>';
    }
  }
  //!! This code works, but it does not populate the Doctor field.
  // function displayAppointments(appointments) {
  //   if (appointments.length === 0) {
  //     appointmentsDiv.innerHTML = '<p>No appointments available</p>';
  //     return;
  //   }

  //   appointmentsDiv.innerHTML = '';
  //   appointments.forEach(appointment => {
  //     const appointmentElement = document.createElement('div');
  //     appointmentElement.className = 'appointment';
  //     appointmentElement.innerHTML = `
  //       <p><strong>Doctor:</strong> ${appointment.doctor.name}</p>
  //       <p><strong>Date:</strong> ${new Date(appointment.date).toDateString()}</p>
  //       <p><strong>Time:</strong> ${appointment.time}</p>
  //       <button onclick="bookAppointment('${appointment._id}')">Book Appointment</button>
  //     `;
  //     appointmentsDiv.appendChild(appointmentElement);
  //   });
  // }

  //!! Worked to poulate the doctor field, but I cannot book appoointments. V2
  // function displayAppointments(appointments) {
  //   if (appointments.length === 0) {
  //     appointmentsDiv.innerHTML = '<p>No appointments available</p>';
  //     return;
  //   }
  
  //   appointmentsDiv.innerHTML = '';
  //   appointments.forEach(appointment => {
  //     const appointmentElement = document.createElement('div');
  //     appointmentElement.className = 'appointment';
  //     appointmentElement.innerHTML = `
  //       <p><strong>Doctor:</strong> ${appointment.doctor ? appointment.doctor.name : 'Not assigned'}</p>
  //       <p><strong>Date:</strong> ${new Date(appointment.date).toDateString()}</p>
  //       <p><strong>Time:</strong> ${appointment.time}</p>
  //       <button onclick="bookAppointment('${appointment._id}')">Book Appointment</button>
  //     `;
  //     appointmentsDiv.appendChild(appointmentElement);
  //   });
  // }

  function displayAppointments(appointments) {
    if (appointments.length === 0) {
      appointmentsDiv.innerHTML = '<p>No appointments available</p>';
      return;
    }
  
    appointmentsDiv.innerHTML = '';
    appointments.forEach(appointment => {
      const appointmentElement = document.createElement('div');
      appointmentElement.className = 'appointment';
      appointmentElement.innerHTML = `
        <p><strong>Doctor:</strong> ${appointment.doctor ? appointment.doctor.name : 'Not assigned'}</p>
        <p><strong>Date:</strong> ${new Date(appointment.date).toDateString()}</p>
        <p><strong>Time:</strong> ${appointment.time}</p>
        <button id="book-${appointment._id}">Book Appointment</button>
      `;
      appointmentsDiv.appendChild(appointmentElement);
  
      // Add event listener to each button
      document.getElementById(`book-${appointment._id}`).addEventListener('click', function() {
        bookAppointment(appointment._id);
      });
    });
  }
  
  

  function bookAppointment(appointmentId) {
    console.log(`Attempting to book appointment with ID: ${appointmentId}`);
    fetch(`/api/appointments/book/${appointmentId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('jwt')
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to book appointment, status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Booking successful', data);
      alert('Appointment booked successfully!');
      fetchAppointments(); // Refresh the list of appointments
    })
    .catch(error => {
      console.error('Error booking appointment:', error);
      alert('Error booking appointment. Check console for details.');
    });
  }
});
