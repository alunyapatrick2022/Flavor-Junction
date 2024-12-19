document.getElementById('room-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    try {
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone')?.value || '',
            check_in_date: document.getElementById('check-in-date').value,
            check_out_date: document.getElementById('check-out-date').value,
            room_type: document.getElementById('room-type').value
        };

        const response = fetch(`http://localhost:3000/api/room-booking`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data =  response.json();

        if (response.ok) {
            window.location.href = 'success.html';
        } else {
            throw new Error(data.message || 'Booking failed');
        }
    } catch (error) {
        console.error('Booking error:', error);
        // Handle error display to user
    }
});