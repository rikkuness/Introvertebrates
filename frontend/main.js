const path = require('path')
const express = require('express')
const session = require('express-session')
const morgan = require('morgan')
const passport = require('passport')
const Auth0Strategy = require('passport-auth0')

const app           = express(),  
      DIST_DIR      = path.join(__dirname, 'dist'),
      HTML_FILE     = path.join(DIST_DIR, 'index.html'),
      isDevelopment = process.env.NODE_ENV !== 'production'

let auth0settings = {}

if (isDevelopment) {
  auth0settings = {
    domain:       '',
    clientID:     '',
    clientSecret: '',
    callbackURL:  ''
  }
  app.use(session({
    secret: 'sosig',
    resave: false,
    saveUninitialized: true,
  }))
} else {
  auth0settings = {
    domain:       '',
    clientID:     '',
    clientSecret: '',
    callbackURL:  ''
  }
  app.set('trust proxy', 1)
  app.use((req, res, next) => {
    if(req.headers["x-forwarded-proto"] === "https"){
      return next()
    }
    res.redirect('https://' + req.hostname + req.url)
  })
  app.use(session({
    secret: 'blerglhlehlelhel',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }))
}

app.use(morgan('combined'))
app.use(require('body-parser').json())
app.set('port', process.env.PORT || 3000);

// Authentication middleware
// const strategy = new Auth0Strategy(auth0settings,
//   (accessToken, refreshToken, extraParams, profile, done) => {
//     return done(null, profile)
//   }
// )
passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((user, done) => done(null, user))

app.use(passport.initialize())
app.use(passport.session())

//passport.use(strategy)

const expressWs = require('express-ws')(app)

// Chat server
app.ws('/ws', (ws, req) => {
  if (!req.user) return ws.close()

  // ws.send(JSON.stringify({ type: 'EXAMPLE', content: msgs }))

  // Message received
  ws.on('message', (data) => {
    console.log(data)
  })
})

app.get('/auth', (req, res) => res.json({
  domain:       strategy.options.domain,
  clientID:     strategy.options.clientID,
  callbackURL:  strategy.options.callbackURL
}))

app.get('/callback',
  passport.authenticate('auth0', { failureRedirect: '/login' }),
  (req, res) => {
    if (!req.user) throw new Error('user null')
    res.redirect('/')
  }
)

app.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

app.use('/api', require('./api'))

if (isDevelopment) {
  console.log('Server is running in development mode.')

  const webpack = require('webpack')
  const config = require('./webpack.config')
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')
  const compiler = webpack(config)

  app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
  }))

  app.use(webpackHotMiddleware(compiler))

  app.get('/**', (req, res, next) => {
    compiler.outputFileSystem.readFile(HTML_FILE, (err, result) => {
      if (err) return next(err)
      res.set('content-type', 'text/html')
      res.send(result)
      res.end()
    })
  })
} else {
  app.get('/health', (req, res) => res.send('ok'))

  console.log('Server is running in production mode.')
  app.use(require('express-static-gzip')(DIST_DIR))
  app.get('/**', (req, res) => res.sendFile(HTML_FILE))
}

app.listen(app.get('port'), (err) => console.log('Listening on: ' + app.get('port')))
