function showMessage(message) {
  // Display the message to the user, e.g., using an alert or by updating a DOM element
  alert(message)
}

function showInvalidRegistrationMessage(message) {
  const container = document.getElementById('registerMessageContainer')

  // Create a new message element
  const messageElement = document.createElement('p')
  messageElement.classList.add('error-message')
  messageElement.textContent = message

  // Clear any existing messages
  container.innerHTML = ''

  // Append the new message element to the container
  container.appendChild(messageElement)
}

// // Usage example
// showInvalidRegistrationMessage('Invalid registration. Please try again.')

const form = document.getElementById('registrationForm')

form.addEventListener('submit', function (event) {
  event.preventDefault()

  var email = document.getElementById('email').value
  var password = document.getElementById('password').value

  let data = {
    email: email,
    password: password,
  }

  fetch('/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.status === 409) {
        // User already exists, display appropriate message
        return response.json().then((data) => {
          showInvalidRegistrationMessage(data.message)
        })
      } else if (response.status === 200) {
        // Successful registration, display success message and redirect to login page
        showMessage('Registration successful! Redirecting to login page.')
        window.location.href = '/login.html'
      }
    })
    .catch((error) => {
      console.error('Error:', error)
    })
})
