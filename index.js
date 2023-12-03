import express from 'express'
import mongoose from "mongoose"
import multer from 'multer'
import {registerValidation, loginValidation, postCreateValidation} from './validations/validation.js'
import {UserController, PostController} from './controllers/index.js'

import {checkAuth, handlerErrors} from "./utils/index.js";


mongoose
    .connect('mongodb+srv://danilzemik73:admin@cluster0.4i8rpgl.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB Error', err))


const app = express()

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    },
})

const upload = multer({storage})

app.use(express.json())
app.use('/uploads', express.static('uploads'))

app.get('/', (req, res) => {
    res.send('hello world')
})

app.post('/auth/login', loginValidation, handlerErrors, UserController.login)
app.get('/auth/me', checkAuth, UserController.getMe)
app.post('/auth/register', registerValidation, handlerErrors, UserController.register)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `uploads/${req.file.originalname}`
    })
})

app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, postCreateValidation, PostController.create)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, PostController.update)


app.listen(4444, (err) => {
    return err ? console.log(err) : console.log('server ok')
})