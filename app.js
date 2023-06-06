const express = require('express')
const app = express()
const path = require('path')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)

const PORT = 3000

// users registered
const registeredUsers = []

const store = new MongoDBStore({
  uri: 'mongodb://localhost:27017/session-store', // Replace with your MongoDB connection string
  collection: 'sessions', // Collection name for storing sessions
})

store.on('error', (error) => {
  console.log('Session store error:', error)
})

app.use(
  session({
    secret: 'abdullahKhan08',
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 20 * 20 * 60 * 1000, // Session expiration time (in milliseconds)
    },
  })
)

// Middleware function to check authentication
function isAuthenticated(req, res, next) {
  // Check if user is authenticated, for example using a session

  if (req.session && req.session.user) {
    // User is authenticated, proceed to the next middleware or route
    next()
  } else {
    // User is not authenticated, redirect to the login page
    if (req.path === '/protected/index.html') {
      res.redirect('/login.html')
    } else {
      res.sendStatus(401) // Unauthorized status code
    }
  }
}

app.use(express.json())

// Serve the index.html file
app.get('/protected/index.html', isAuthenticated, function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'protected', 'index.html'))
})

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function (req, res) {
  res.redirect('/login.html')
})

app.post('/register', (req, res) => {
  const email = req.body.email
  const password = req.body.password

  const userExists = registeredUsers.some((user) => user.email === email)

  if (userExists) {
    res.status(409).json({
      message: 'Email already exists. Please choose a different email.',
    })
  } else {
    // Perform registration logic here (e.g., save the user to a database)
    const newUser = {
      email: email,
      password: password,
    }

    registeredUsers.push(newUser)

    // Redirect to the login page after successful registration
    res.status(200).json({ message: 'Registration successful!' })
  }
})

// Handle POST request to /login
app.post('/login', function (req, res) {
  const email = req.body.email
  const password = req.body.password

  // Check if the email and password match a registered user
  const user = registeredUsers.find(
    (user) => user.email === email && user.password === password
  )

  if (user) {
    req.session.user = user

    // Successful login
    res.status(200).json({ message: 'Login successful!' })
  } else {
    // Invalid credentials
    res.status(401).json({ message: 'Invalid email or password.' })
  }
})

// Handle POST request to /logout
app.post('/logout', function (req, res) {
  // Destroy the session to log out the user
  req.session.destroy(function (err) {
    if (err) {
      console.log('Error logging out:', err)
    } else {
      console.log('User logged out successfully')
      res.redirect('/login.html')
    }
  })
})

app.get('/index', function (req, res, next) {
  // Check if user is authenticated, for example using a session
  if (req.session && req.session.user) {
    // User is authenticated, serve the index.html file
    res.sendFile(path.join(__dirname, 'public', 'protected', 'index.html'))
  } else {
    // User is not authenticated, redirect to the login page
    res.sendFile(path.join(__dirname, 'public', 'login.html'))
  }
})

// Redirect to the login page if the user tries to access the index.html file directly
app.get('/index.html', function (req, res) {
  res.redirect('/login.html')
})

// Serve the login.html file
app.get('/login.html', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'login.html'))
})

// Serve the register.html file
app.get('/register.html', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'register.html'))
})

app.listen(PORT)
