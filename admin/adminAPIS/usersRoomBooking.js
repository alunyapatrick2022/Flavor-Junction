document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/admin/adminLogin.html';
    }

    // Fetch all room bookings
    fetch('https://flavor-junction-be.onrender.com/api/roomBookings' , {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }

    }
    )
        .then(async response => {
            if (!response.ok) {
                const text = await response.text();
                console.error('Server error:', text);
                throw new Error(text);
            }
            return response.json();
        })
        .then(data => {
            const tableBody = document.querySelector('.room tbody');
            data.forEach(room_booking => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${room_booking.id}</td>
                    <td>${room_booking.user_id}</td>
                    <td>${room_booking.name}</td>
                    <td>${room_booking.email}</td>
                    <td>${room_booking.phone}</td>
                    <td>${room_booking.checkInDate}</td>
                    <td>${room_booking.checkOutDate}</td>
                    <td>${room_booking.roomType}</td>
                    <td>${room_booking.guests}</td>
                    <td><button class="action-btn" data-id="${room_booking.email}">Send Email</button></td>
                `;
                tableBody.appendChild(row);
            });
        })

        // Send email to user
        .then(() => {
            const actionBtns = document.querySelectorAll('.action-btn');
            actionBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const row = btn.closest('tr');
                    const name = row.querySelector('td:nth-child(3)').textContent;
                    const email = row.querySelector('td:nth-child(4)').textContent;
                    // const phone = row.querySelector('td:nth-child(5)').textContent;
                    const checkInDate = row.querySelector('td:nth-child(6)').textContent;   
                    const checkOutDate = row.querySelector('td:nth-child(7)').textContent;
                    const roomType = row.querySelector('td:nth-child(8)').textContent;
                    const guests = row.querySelector('td:nth-child(9)').textContent;
                    fetch(`https://flavor-junction-be.onrender.com/api/sendEmail`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        },
                        body: JSON.stringify({ name, email, checkInDate, checkOutDate, roomType, guests})
                    })
                    .then(async response => {
                        const data = await response.json();
                        if (response.ok) {
                            alert('Email sent successfully');
                            window.location.reload();
                            console.log(data.message);
                        } else {
                            console.error('Server error:', data);
                            alert('Error sending email');
                        }
                    });
                });
            });
        })
        .catch(error => 
            console.error('Error fetching data:', error));

});