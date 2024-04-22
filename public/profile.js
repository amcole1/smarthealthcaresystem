//Old event listener, worked prior to needing to show appointments
// document.addEventListener('DOMContentLoaded', function() {
//     if (!localStorage.getItem('jwt')) {
//         window.location.href = '/index.html'; // Redirect to login if no token
//         return; 
//     }

//     fetchUserData();
//     document.getElementById('editProfileButton').addEventListener('click', openEditModal);
//     document.querySelector('.close-button').addEventListener('click', function() {
//         document.getElementById('editModal').style.display = "none";
//     });
// });

//New FetchUserData
document.addEventListener('DOMContentLoaded', function() {
    if (!localStorage.getItem('jwt')) {
        window.location.href = '/index.html'; // Redirect if no JWT token
        return;
    }

    fetchUserData();
    fetchBookedAppointments();
    setupEventListeners();
});

let currentUserData;

function setupEventListeners() {
    document.getElementById('editProfileButton').addEventListener('click', openEditModal);
    document.querySelector('.close-button').addEventListener('click', function() {
        document.getElementById('editModal').style.display = "none";
    });
}

//Old FetchUserData
// function fetchUserData() {
//     fetch('/api/user', {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': 'Bearer ' + localStorage.getItem('jwt')
//         }
//     })
//     .then(response => response.json())
//     .then(data => {
//         currentUserData = data;
//         displayUserData(data);
//     })
//     .catch(error => console.error('Error fetching user data:', error));
// }



function fetchUserData() {
    fetch('/api/user', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('jwt')
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Fetched User Data:', data);
        currentUserData = data;
        displayUserData(data);
    })
    .catch(error => console.error('Error fetching user data:', error));
}



// Old displayUserData function
// function displayUserData(userData) {
//     const userInfoDisplay = document.getElementById('userInfoDisplay');
//     userInfoDisplay.innerHTML = `
//         <p>First Name: ${userData.userInfo.firstName}</p>
//         <p>Last Name: ${userData.userInfo.lastName}</p>
//         <p>DOB: ${userData.userInfo.dob.month}/${userData.userInfo.dob.day}/${userData.userInfo.dob.year}</p>
//         <p>Gender: ${userData.userInfo.gender}</p>
//         <p>Address: ${userData.userInfo.address.streetNumber} ${userData.userInfo.address.streetName}, ${userData.userInfo.address.city}, ${userData.userInfo.address.state} ${userData.userInfo.address.zipCode}</p>
//         <p>Phone Number: ${userData.userInfo.phoneNumber}</p>
//     `;

//     // Clear and update allergies display
//     const allergiesDisplay = document.getElementById('allergiesDisplay');
//     allergiesDisplay.innerHTML = userData.allergiesInfo.allergies.length > 0 
//         ? userData.allergiesInfo.allergies.map(allergy => `<p>${allergy}</p>`).join('') 
//         : '<p>No allergies listed.</p>';

//     // Clear and update medications display
//     const medicationsDisplay = document.getElementById('medicationsDisplay');
//     if (userData.medicalInfo.medication.length > 0) {
//         medicationsDisplay.innerHTML = userData.medicalInfo.medication.map(med => `
//             <div>
//                 <p>Name: ${med.name}</p>
//                 <p>Dosage: ${med.dosage}</p>
//                 <p>Frequency: ${med.frequency}</p>
//                 <p>Prescribed Date: ${new Date(med.prescribedDate).toLocaleDateString()}</p>
//             </div>
//         `).join('');
//     } else {
//         medicationsDisplay.innerHTML = '<p>No medications listed.</p>';
//     }
    
// }

//New slightly updated displayUserData function
function displayUserData(userData) {
    console.log(userData); // Check what is received exactly.

    if (!userData || !userData.userInfo) {
        console.error('Invalid or incomplete user data received:', userData);
        alert('Failed to load user data.');
        return; // Handle missing data appropriately.
    }

    const userInfoDisplay = document.getElementById('userInfoDisplay');
    userInfoDisplay.innerHTML = `
        <p>First Name: ${userData.userInfo.firstName || 'N/A'}</p>
        <p>Last Name: ${userData.userInfo.lastName || 'N/A'}</p>
        <p>DOB: ${userData.userInfo.dob ? `${userData.userInfo.dob.month}/${userData.userInfo.dob.day}/${userData.userInfo.dob.year}` : 'N/A'}</p>
        <p>Gender: ${userData.userInfo.gender || 'N/A'}</p>
        <p>Address: ${userData.userInfo.address ? `${userData.userInfo.address.streetNumber} ${userData.userInfo.address.streetName}, ${userData.userInfo.address.city}, ${userData.userInfo.address.state} ${userData.userInfo.address.zipCode}` : 'N/A'}</p>
        <p>Phone Number: ${userData.userInfo.phoneNumber || 'N/A'}</p>
    `;

    // Handle allergies
    const allergiesDisplay = document.getElementById('allergiesDisplay');
    if (userData.allergiesInfo && userData.allergiesInfo.allergies.length > 0) {
        allergiesDisplay.innerHTML = userData.allergiesInfo.allergies.map(allergy => `<p>${allergy}</p>`).join('');
    } else {
        allergiesDisplay.innerHTML = '<p>No allergies listed.</p>';
    }

    // Handle medications
    const medicationsDisplay = document.getElementById('medicationsDisplay');
    if (userData.medicalInfo && userData.medicalInfo.medication.length > 0) {
        medicationsDisplay.innerHTML = userData.medicalInfo.medication.map(med => `
            <div>
                <p>Name: ${med.name || 'N/A'}</p>
                <p>Dosage: ${med.dosage || 'N/A'}</p>
                <p>Frequency: ${med.frequency || 'N/A'}</p>
                <p>Prescribed Date: ${med.prescribedDate ? new Date(med.prescribedDate).toLocaleDateString() : 'N/A'}</p>
            </div>
        `).join('');
    } else {
        medicationsDisplay.innerHTML = '<p>No medications listed.</p>';
    }
}





function openEditModal() {
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div id="userInfoFields">
            <label>First Name:</label>
            <input type="text" id="editFirstName" value="${currentUserData.userInfo.firstName || ''}"><br>
            <label>Last Name:</label>
            <input type="text" id="editLastName" value="${currentUserData.userInfo.lastName || ''}"><br>
            <label>DOB Month:</label>
            <input type="number" id="editDobMonth" value="${currentUserData.userInfo.dob?.month || 1}" min="1" max="12"><br>
            <label>DOB Day:</label>
            <input type="number" id="editDobDay" value="${currentUserData.userInfo.dob?.day || 1}" min="1" max="31"><br>
            <label>DOB Year:</label>
            <input type="number" id="editDobYear" value="${currentUserData.userInfo.dob?.year || 1990}" min="1900" max="${new Date().getFullYear()}"><br>
            <label>Gender:</label>
            <input type="text" id="editGender" value="${currentUserData.userInfo.gender || ''}"><br>
            <label>Street Number:</label>
            <input type="text" id="editStreetNumber" value="${currentUserData.userInfo.address.streetNumber || ''}"><br>
            <label>Street Name:</label>
            <input type="text" id="editStreetName" value="${currentUserData.userInfo.address.streetName || ''}"><br>
            <label>City:</label>
            <input type="text" id="editCity" value="${currentUserData.userInfo.address.city || ''}"><br>
            <label>State:</label>
            <input type="text" id="editState" value="${currentUserData.userInfo.address.state || ''}"><br>
            <label>Zip Code:</label>
            <input type="text" id="editZipCode" value="${currentUserData.userInfo.address.zipCode || ''}"><br>
            <label>Phone Number:</label>
            <input type="text" id="editPhoneNumber" value="${currentUserData.userInfo.phoneNumber || ''}"><br>
        </div>
        <h3>Allergies</h3>
        </div>
        <h3>Allergies</h3>
        <div id="allergiesFieldsContainer">
            ${currentUserData.allergiesInfo.allergies.map(allergy => `
                <div class="allergyField">
                    <input type="text" class="allergyInput" value="${allergy}">
                    <button onclick="this.parentElement.remove();">Remove</button>
                </div>
            `).join('')}
            <button onclick="addAllergyField()">Add Allergy</button>
        </div>
        <h3>Medications</h3>
        <div id="medicationsFieldsContainer">
            ${currentUserData.medicalInfo.medication.map(med => `<div><input type="text" class="medName" value="${med.name}"><input type="text" class="medDosage" value="${med.dosage}"><input type="text" class="medFrequency" value="${med.frequency}"><input type="date" class="medPrescribedDate" value="${med.prescribedDate?.split('T')[0] || new Date().toISOString().split('T')[0]}"><button onclick="this.parentElement.remove();">Remove</button></div>`).join('')}
            <button onclick="addMedicationField()">Add Medication</button>
        </div>
        <button onclick="submitForm()">Save Changes</button>
    `;
    document.getElementById('editModal').style.display = "block";
}


function addAllergyField(value = '') {
    const container = document.getElementById('allergiesFieldsContainer');
    const allergyField = document.createElement('div');
    allergyField.className = 'allergyField';

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'allergyInput';
    input.value = value;

    const removeButton = document.createElement('button');
    removeButton.innerText = 'Remove';
    removeButton.onclick = function() {
        allergyField.remove();
    };

    allergyField.appendChild(input);
    allergyField.appendChild(removeButton);
    container.insertBefore(allergyField, container.lastChild); // Insert before the "Add Allergy" button
}


function addMedicationField() {
    const container = document.getElementById('medicationsFieldsContainer');
    const div = document.createElement('div');
    div.className = 'medicationField';

    // Medication Name
    const nameDiv = document.createElement('div');
    const nameLabel = document.createElement('label');
    nameLabel.innerText = 'Name: ';
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.className = 'medName';
    nameDiv.appendChild(nameLabel);
    nameDiv.appendChild(nameInput);

    // Dosage
    const dosageDiv = document.createElement('div');
    const dosageLabel = document.createElement('label');
    dosageLabel.innerText = 'Dosage: ';
    const dosageInput = document.createElement('input');
    dosageInput.type = 'text';
    dosageInput.className = 'medDosage';
    dosageDiv.appendChild(dosageLabel);
    dosageDiv.appendChild(dosageInput);

    // Frequency
    const frequencyDiv = document.createElement('div');
    const frequencyLabel = document.createElement('label');
    frequencyLabel.innerText = 'Frequency: ';
    const frequencyInput = document.createElement('input');
    frequencyInput.type = 'text';
    frequencyInput.className = 'medFrequency';
    frequencyDiv.appendChild(frequencyLabel);
    frequencyDiv.appendChild(frequencyInput);

    // Prescribed Date
    const prescribedDateDiv = document.createElement('div');
    const prescribedDateLabel = document.createElement('label');
    prescribedDateLabel.innerText = 'Prescribed Date: ';
    const prescribedDateInput = document.createElement('input');
    prescribedDateInput.type = 'date';
    prescribedDateInput.className = 'medPrescribedDate';
    prescribedDateDiv.appendChild(prescribedDateLabel);
    prescribedDateDiv.appendChild(prescribedDateInput);

    // Remove Button
    const removeButton = document.createElement('button');
    removeButton.innerText = 'Remove';
    removeButton.onclick = function() { div.remove(); };

    // Append everything to the div
    div.appendChild(nameDiv);
    div.appendChild(dosageDiv);
    div.appendChild(frequencyDiv);
    div.appendChild(prescribedDateDiv);
    div.appendChild(removeButton);

    container.appendChild(div);
}



function submitForm() {
    const allergies = Array.from(document.querySelectorAll('.allergyInput')).map(input => input.value);
    const medications = Array.from(document.querySelectorAll('.medicationField')).map(div => {
        return {
            name: div.querySelector('.medName').value,
            dosage: div.querySelector('.medDosage').value,
            frequency: div.querySelector('.medFrequency').value,
            prescribedDate: div.querySelector('.medPrescribedDate').value
        };
    });
    

    const data = {
        userInfo: {
            firstName: document.getElementById('editFirstName').value,
            lastName: document.getElementById('editLastName').value,
            dob: {
                month: parseInt(document.getElementById('editDobMonth').value, 10),
                day: parseInt(document.getElementById('editDobDay').value, 10),
                year: parseInt(document.getElementById('editDobYear').value, 10),
            },
            gender: document.getElementById('editGender').value,
            address: {
                streetNumber: document.getElementById('editStreetNumber').value,
                streetName: document.getElementById('editStreetName').value,
                city: document.getElementById('editCity').value,
                state: document.getElementById('editState').value,
                zipCode: document.getElementById('editZipCode').value,
            },
            phoneNumber: document.getElementById('editPhoneNumber').value,
        },
        allergiesInfo: {
            allergies: allergies
        },
        medicalInfo: {
            medication: medications.map(medication => ({
                ...medication,
                prescribedDate: new Date(medication.prescribedDate)
            }))
        }
    };
    

    fetch('/api/user/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('jwt')
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update profile.');
        }
        return response.json();
    })
    .then(() => {
        alert('Profile updated successfully.');
        fetchUserData(); 
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while updating the profile.');
    });


    //Fetch booked appointments!
    function fetchBookedAppointments() {
        fetch('/api/user/appointments', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
        })
        .then(response => response.json())
        .then(appointments => {
            console.log('Booked appointments:', appointments);
            displayBookedAppointments(appointments);
        })
        .catch(error => {
            console.error('Error fetching booked appointments:', error);
        });
    }
    
    function displayBookedAppointments(appointments) {
        const appointmentsContainer = document.getElementById('appointmentsContainer');
        if (appointments.length === 0) {
            appointmentsContainer.innerHTML = '<p>No booked appointments.</p>';
            return;
        }
    
        let appointmentHTML = appointments.map(appointment => `
            <div>
                <p>Doctor: ${appointment.doctor.name}</p>
                <p>Date: ${new Date(appointment.date).toLocaleDateString()}</p>
                <p>Time: ${appointment.time}</p>
            </div>
        `).join('');
    
        appointmentsContainer.innerHTML = appointmentHTML;
    }
    
    
      
    //   document.addEventListener('DOMContentLoaded', function() {
    //     fetchUserData();
    //     fetchBookedAppointments();
    //     document.getElementById('editProfileButton').addEventListener('click', openEditModal);
    //     document.querySelector('.close-button').addEventListener('click', function() {
    //         document.getElementById('editModal').style.display = "none";
    //     });
    // });
    
      





}



