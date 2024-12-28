document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/admin/adminLogin.html';
    }

    // Fetch all room bookings
    fetch('https://flavor-junction-be.onrender.com/api/tableBookings' , {
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
            const tableBody = document.querySelector('.table tbody');
            data.forEach(table_booking => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${table_booking.id}</td>
                    <td>${table_booking.user_id}</td>
                    <td>${table_booking.name}</td>
                    <td>${table_booking.email}</td>
                    <td>${table_booking.phone}</td>
                    <td>${table_booking.date}</td>
                    <td>${table_booking.time}</td>
                    <td>${table_booking.number_of_people}</td>
                    <td><button class="action-btn" data-id="${table_booking.email}">Send Email</button></td>
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
                    const id = row.querySelector('td:nth-child(1)').textContent;
                    const user_id = row.querySelector('td:nth-child(2)').textContent;
                    const name = row.querySelector('td:nth-child(3)').textContent;
                    const email = row.querySelector('td:nth-child(4)').textContent;
                    const phone = row.querySelector('td:nth-child(5)').textContent;
                    const date = row.querySelector('td:nth-child(6)').textContent;   
                    const time = row.querySelector('td:nth-child(7)').textContent;
                    const number_of_people = row.querySelector('td:nth-child(8)').textContent;
                    fetch(`https://flavor-junction-be.onrender.com/api/tableBookingSendEmail`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        },
                        body: JSON.stringify({ id, user_id, name, email, phone, date, time, number_of_people })
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