document.getElementById('room-form').addEventListener('submit', async function(event) {
    event.preventDefault();
const token = localStorage.getItem('token');
if (!token) {
    alert('You must be logged in to book a room.');
    return;
}
    const    name = document.getElementById('name').value;
    const     email = document.getElementById('email').value;
    const    phone = document.getElementById('phone')?.value || '';
    const    check_in_date = document.getElementById('check-in-date').value;
    const     check_out_date = document.getElementById('check-out-date').value;
    const    room_type = document.getElementById('room-type').value;
    const    guests = document.getElementById('guests').value;

    try {
        const response = await fetch(`https://flavor-junction-be.onrender.com/api/room-booking`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({name, email, phone, check_in_date, check_out_date, room_type, guests})
        });

        let data;
        try {
            data = await response.json();
        } catch (e) {
            throw new Error('Server error: ' + await response.text());
        }

        if (response.ok) {
            alert('Room Booking was successful');
            window.location.href = 'success.html';
        } else {
            alert('Room Booking failed, please give it a short.');
            throw new Error(data.message || 'Room Booking failed, please give it a short.');
        }
    }
    catch (error) {
        console.log(error);
        console.error('Room Booking error:', error);
        // Handle error display to user
    }
});