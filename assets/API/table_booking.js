document.getElementById('table-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const token = localStorage.getItem('token');
if (!token) {
    alert('You must be logged in to book a room.');
    return;
}
    const  name = document.getElementById('name').value;
    const  email = document.getElementById('email').value;
    const  phone = document.getElementById('phone')?.value || '';
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const  number_of_people = document.getElementById('number-of-people').value;

        try {
            const response = await fetch(`https://flavor-junction-be.onrender.com/api/table-booking`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                     'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({name, email, phone, date, time, number_of_people })
            });
    
            let data;
            try {
                data = await response.json();
            } catch (e) {
                throw new Error('Server error: ' + await response.text());
            }
    
            if (response.ok) {
                alert('Your Table Booking successful');
                window.location.href = 'success.html';
            } else {
                alert('Table Booking failed, please give it a short.');
                throw new Error(data.message || 'Table Booking failed');
            }
        }
        catch (error) {
        console.error('Booking error:', error);
        // Handle error display to user
    }
});