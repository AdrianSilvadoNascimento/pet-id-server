const express = require('express')
const petController = require('../controllers/pet-controller')

const router = express.Router()

router.post('/register-pet/:id', petController.registerPet)
router.post('/found-pet', petController.registerFoundPet)
router.delete('/delete-pet/:id', petController.deletePet)
router.get('/get-pets/:id', petController.getPets)
router.get('/get-pet/:id', petController.getPet)
router.put('/update-pet/:id', petController.updatePet)

module.exports = router
