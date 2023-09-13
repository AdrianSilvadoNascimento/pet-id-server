const { PrismaClient } = require('@prisma/client')
const { env } = require('process')

const errorMessage = 'Aconteceu algum erro interno!'

const prisma = new PrismaClient()

const getPet = async (req, res) => {  
  try {
    const pet = await prisma.pet.findUnique({
      where: {
        id: req.params.id,
      }
    })
  
    if (!pet) {
      res.status(500).json({ message: errorMessage })
    } else {
      res.status(200).json(pet)
    }
  } catch (error) {
    res.status(500).json({ message: errorMessage })
  }
}

const getPets = async (req, res) => {
  try {
    const pets = await prisma.pet.findMany({
      where: {
        userId: req.params.id,
      }
    })

    if (!pets) {
      res.status(401).json({ message: "Não há pets" })
    } else {
      res.status(200).json(pets)
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: errorMessage })
  }
}

const registerPet = async (req, res) => {
  try {
    if (!req.body) {
      res.status(401).json({ message: errorMessage })
    } else {
      await prisma.user.update({
        where: {
          id: req.params.id
        },
  
        data: {
          pets: {
            create: req.body,
          },
        },
      })
  
      res.status(200).json({ message: 'Cadastrado com sucesso!' })
    }
  } catch (error) {
    console.error('error', error)
    res.status(500).json({ message: errorMessage })
  }
}

const registerFoundPet = async (req, res) => {
  try {
    const url = `${env.BASE_URL}/createpet`
    const petImage = await blobToBase64(req.file)

    console.log('petImage:', petImage)

    const body = JSON.parse(req.body.data)

    body.link = petImage

    const response = await axios.post(url, JSON.stringify(body))

    if (response.data && response.data.status !== 'error') {
      const petImagePath = path.join(__dirname, '../images', req.file.filename)

      fs.unlinkSync(petImagePath)
      res.status(200).json({ message: 'Pet registrado com sucesso!' })
    } else {
      res.status(500).json({ message: errorMessage })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: errorMessage })
  }
}

const updatePet = async (req, res) => {
  try {
    const petId = req.params.id
    const searchPet = await prisma.pet.findUnique({
      where: {
        id: petId,
      }
    })

    if (!searchPet) {
      res.status(404).json({ message: "Pet não encontrado" })
    } else {
      await prisma.pet.update({
        where: {
          id: petId,
        },
  
        data: req.body,
      })

      res.status(200).json({ message: "Pet atualizado com sucesso" })
    }
  } catch (error) {
    res.status(500).json({ message: errorMessage })
  }
}

const deletePet = async (req, res) => {
  try {
    const pet = await prisma.pet.delete({
      where: {
        id: req.params.id,
      }
    })

    if (!pet) {
      res.status(404).json({ message: 'Pet não encontrado' })
    } else {
      res.status(200).json({ message: 'Removido com sucesso!' })    
    }
  } catch (error) {
    res.status(500).json({ message: errorMessage })
  }
}

module.exports = {
  registerFoundPet,
  registerPet,
  updatePet,
  deletePet,
  getPets,
  getPet,
}
