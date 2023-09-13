const { PrismaClient } = require('@prisma/client')
const { env } = require('process')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const errorMessage = 'Aconteceu algum erro interno!'
const prisma = new PrismaClient()

const getUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.params.id,
      }
    })
  
    if (!user) {
      res.status(404).json({ message: 'Usuário não encontrado!' })
    } else {
      res.status(200).json(user)
    }
  } catch (error) {
    res.status(500).json({ message: errorMessage })
  }
}

const loginUser = async (req, res) => {
  try {
    const body = req.body
    const email = body.email
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      }
    })

    if (user) {
      const invalidPassword = await bcrypt.compare(body.password, user.password)

      if (!invalidPassword) {
        res.status(401).json({ message: 'Senha inválida!' })
      } else {
        const token = jwt.sign(
          {
            userName: `${user.name} ${user.last_name}`,
            email: user.email,
            userId: user.id,
          },
          env.SECRET_MESSAGE,
          {
            expiresIn: '1h',
          }
        )

        return res.status(200).json({
          token: token,
          userId: user.id,
          expiresIn: 3600,
          userName: `${user.name} ${user.last_name}`,
          plan: user.plan,
        })
      }
    } else {
      res.status(401).json({ message: 'E-mail inválido!' })
    }
  } catch (error) {
    res.status(500).json({ message: errorMessage })
  }
}

const registerUser = async (req, res) => {
  try {
    const body = req.body

    const newUser = await prisma.user.findUnique({
      where: {
        email: body.email,
      }
    })
    
    if (!newUser) {
      const salt = await bcrypt.genSalt(10)
      body.password = await bcrypt.hash(body.password, salt)
      await prisma.user.create({
        data: body,
      })

      res.status(200).json({ message: 'Cadastrado com sucesso!' })
    } else {
      res.status(400).json({ message: 'Usuário já cadastrado!' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: errorMessage })
  }
}

module.exports = {
  registerUser,
  loginUser,
  getUser,
}
