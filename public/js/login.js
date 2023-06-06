// Define the showMessage function
function showMessage(message, isError = false) {
  const errorContainer = document.getElementById('error-container')
  errorContainer.innerHTML = ''

  const messageElement = document.createElement('p')
  messageElement.innerText = message

  if (isError) {
    messageElement.classList.add('error-message')
  }

  errorContainer.appendChild(messageElement)
}

function handleInvalidLogin() {
  // Clear any existing error messages
  errorContainer.innerHTML = ''

  // Create the error message element
  const errorMessage = document.createElement('p')
  errorMessage.classList.add('error-message')
  errorMessage.textContent = 'Invalid email or password.'

  // Append the error message to the error container
  errorContainer.appendChild(errorMessage)
}

const messageContainer = document.getElementById('dynamic-container')
const errorContainer = document.getElementById('error-container')

// Function to create a button element
function createRedirectButton() {
  const button = document.createElement('button')
  button.textContent = 'Register here'
  button.classList.add('form-btn')
  button.addEventListener('click', function () {
    window.location.href = '/register.html'
  })
  return button
}

document
  .getElementById('loginForm')
  .addEventListener('submit', function (event) {
    event.preventDefault() // Prevent the form from submitting

    errorContainer.innerHTML = ''

    // Get the entered email and password
    var email = document.getElementById('email').value
    var password = document.getElementById('password').value

    // Create a data object with the email and password
    var data = {
      email: email,
      password: password,
    }

    fetch('/index', { method: 'GET' })
      .then((response) => {
        if (response.url.includes('/login.html')) {
          // User is not authenticated, redirect to the login page
          window.location.href = '/login.html'
        }
      })
      .catch((error) => {
        console.error('Error checking authentication:', error)
      })

    // Send the data to the backend login API
    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.status === 200) {
          // Successful login, display success message and redirect to index.html
          showMessage('Login successful! Redirecting to index page.')
          window.location.href = '/protected/index.html'
        } else if (response.status === 401) {
          // Invalid credentials, display error message
          showMessage('Invalid email or password.')
          const button = createRedirectButton()
          messageContainer.appendChild(button)
          handleInvalidLogin()
        }
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  })
