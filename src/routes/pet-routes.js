const express = require('express')
const cors = require('cors')
const petController = require('../controllers/pet-controller')

const router = express.Router()

const corsOptions = {
  origin: 'https://pet-id-front.vercel.app',
  methods: 'POST, DELETE, GET, PUT',
  allowedHeaders: 'Content-Type',
}

router.post('/register-pet/:id', cors(corsOptions), petController.registerPet)
router.post('/found-pet', cors(corsOptions), petController.registerFoundPet)
router.delete('/delete-pet/:id', cors(corsOptions), petController.deletePet)
router.get('/get-pets/:id', petController.getPets)
router.get('/get-pet/:id', petController.getPet)
router.put('/update-pet/:id', cors(corsOptions), petController.updatePet)

module.exports = router
