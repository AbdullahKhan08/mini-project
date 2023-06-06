// Add a click event listener to the logout button
document.getElementById('logoutButton').addEventListener('click', function () {
  // Send a POST request to the logout route
  fetch('/logout', {
    method: 'POST',
  })
    .then(function (response) {
      // Redirect to the login page after successful logout
      window.location.href = '/login.html'
    })
    .catch(function (error) {
      console.log('Error logging out:', error)
    })
})
