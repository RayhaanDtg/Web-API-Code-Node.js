

const http = require('http')
const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const bodyParser = require('body-parser') //parses bodies of POST messsages
const logger = require('morgan') //console logger for dubugging

const app = express() //create express middleware dispatcher

const PORT = process.env.PORT || 3000

app.locals.pretty = true //to generate pretty view-source code in browser

//read routes modules javascript file
const routes = require('./routes/index')

//Some logger middleware functions
//here you can write your own logging functions for
//whatever debugging you want to do.

function methodLogger(request, response, next) {
  console.log("METHOD LOGGER")
  console.log("================================")
  console.log("METHOD: " + request.method)
  console.log("URL:" + request.url)
  next() //call next middleware registered
}

function headerLogger(request, response, next) {
  console.log("HEADER LOGGER:")
  console.log("Headers:")
  for (let k in request.headers) console.log(k)
  next() //call next middleware registered
}

//register middleware with dispatcher
//ORDER MATTERS HERE
//middleware
app.use(routes.authenticate) //authenticate user
app.use(favicon(path.join(__dirname,  'public',  'favicon.ico')))
app.use(logger('dev'))
//app.use(methodLogger);
//app.use(headerLogger);
app.use(bodyParser.json()) //parse JSON in POST bodies.
app.use(express.static(__dirname + '/public')) //static server to serve files in public folder

//JSON API routes
//returns JSON data to clients so client can render
app.get('/api/users', routes.api_users)

app.get('/api/songs', routes.api_songs)
app.get('/api/song/*', routes.api_songDetails)
app.post('/api/song/*', routes.api_update_song)

app.get('/api/books', routes.api_books)
app.get('/api/book/*', routes.api_bookDetails)
app.post('/api/book/*', routes.api_update_book)

//start server
app.listen(PORT, function(err){
  if (err) console.log(err)
  else {
    console.log(`Server listening on port: ${PORT} CNTL:-C to stop`)
    console.log(`Testing:`)
    console.log(`hardcoded user: ldnel, password: secret`)
    console.log(`http://localhost:3000/index.html`)
  }
})
