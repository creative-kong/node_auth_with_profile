const express = require('express')

const { getProfile, createProfile, updateProfile } = require('../controllers/profileController')
const { protect } = require('../middleware/auth')

const router = express.Router()

router.route('/').get(protect, getProfile)
router.route('/').post(protect, createProfile)
router.route('/:id').put(protect, updateProfile)

module.exports = router