const router = require('express').Router()

router.get('/user', (req, res) => res.json({
  name: req.user.displayName
}))

module.exports = router
