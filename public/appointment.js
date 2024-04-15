document.addEventListener('DOMContentLoaded', function () {
    const appointmentsDiv = document.getElementById('appointments');
  
    // Fetch available appointments
    fetchAppointments();
  
    // Fetch available appointments
    async function fetchAppointments() {
      try {
        const response = await fetch('/api/appointments');
        if (!response.ok) {
          throw new Error('Failed to fetch appointments');
        }
        const appointments = await response.json();
        displayAppointments(appointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        appointmentsDiv.innerHTML = '<p>Error fetching appointments</p>';
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
          <p><strong>Doctor:</strong> ${appointment.doctor}</p>
          <p><strong>Date:</strong> ${new Date(appointment.date).toDateString()}</p>
          <p><strong>Time:</strong> ${appointment.time}</p>
        `;
        appointmentsDiv.appendChild(appointmentElement);
      });
    }
  });
  