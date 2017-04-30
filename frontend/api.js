const router = require('express').Router()

router.get('/user', (req, res) => {
  if (!req.user) return res.status(401)
  res.json({
    name: req.user.displayName
  })
})

module.exports = router
