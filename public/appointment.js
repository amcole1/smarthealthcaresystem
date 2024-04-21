document.addEventListener('DOMContentLoaded', function () {
  const appointmentsDiv = document.getElementById('appointments');


  fetchAppointments();

  async function fetchAppointments() {
    try {
     
      const response = await fetch('/api/appointments', {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('jwt')
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
      const appointments = await response.json();
      displayAppointments(appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      appointmentsDiv.innerHTML = '<p>Error fetching appointments. Please ensure you are logged in.</p>';
    }
  }
  

  // Function to display appointments
  function displayAppointments(appointments) {
    if (appointments.length === 0) {
      appointmentsDiv.innerHTML = '<p>No appointments available</p>';
      return;
    }

    appointmentsDiv.innerHTML = '';
    appointments.forEach(appointment => {
      const appointmentElement = document.createElement('div');
      appointmentElement.innerHTML = `
        <p><strong>Doctor:</strong> ${appointment.doctor.name}</p>
        <p><strong>Date:</strong> ${new Date(appointment.date).toDateString()}</p>
        <p><strong>Time:</strong> ${appointment.time}</p>
        <button onclick="bookAppointment('${appointment._id}')">Book Appointment</button>
      `;
      appointmentsDiv.appendChild(appointmentElement);
    });
  }


  function bookAppointment(appointmentId) {
    fetch(`/api/appointments/book/${appointmentId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('jwt')
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to book appointment');
      }
      return response.json();
    })
    .then(data => {
      console.log('Booking successful', data);
      fetchAppointments(); // Refresh the list of appointments
    })
    .catch(error => console.error('Error booking appointment:', error));
  }
});
