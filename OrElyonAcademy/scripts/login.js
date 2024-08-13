function handleLogin() {
    // Get username and password from the form
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Check credentials
    if (username === 'exam123' && password === '123exam') {
        // Store a flag in localStorage to indicate that the user is logged in
        localStorage.setItem('loggedIn', 'true');
        // Redirect to the exam page
        window.location.href = 'exam.html';
    } else {
        // Show an error message
        alert('Invalid username or password. Please try again.');
    }

    return false; // Prevent form submission
}
