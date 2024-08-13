window.onload = function() {
    // Check if user is logged in
    if (localStorage.getItem('loggedIn') !== 'true') {
        // Redirect to login page if not logged in
        window.location.href = 'login.html';
    }
}
