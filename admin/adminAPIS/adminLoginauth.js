

// Handle form submission
document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Retrieve token and user details from localStorage
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');


    // Send a POST request to the backend for authentication
    try {
        const response = await fetch('https://flavor-junction-be.onrender.com/api/auth/admin/login', { // Ensure this matches your backend
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {

            // Store token and user details in localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(user));
            
            alert('Login successful, redirecting you to the admin page.')
            // Redirect to home page
            // Adjust path if necessary
            window.location.href = '/admin/admin.htm';

        } else {
            console.error('Login failed:');
        }
    } catch (error) {
        console.error('Error during login:', error);

    }
});