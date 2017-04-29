const router = require('express').Router()

router.get('/user', (req, res) => res.json({
  name: req.user.displayName,
  ign: req.user._json.user_metadata.ign,
  admin: req.user._json.app_metadata.admin
}))

module.exports = router
