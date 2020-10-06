const express = require('express');
require('./db/moongoose');
const userRouter = require('./router/user')
const taskRouter = require('./router/task')
const bcrypt = require('bcrypt');

const app = express();
const port = process.env.PORT
// app.use((req, res, next) => {
//     res.status(503).send('website under maintance')
// })
app.use(express.json())
app.use(userRouter);
app.use(taskRouter);

// checkBcryptAlgo = async () => {
//     const jsonwebtoken = require('jsonwebtoken');
//     const jsonweb = jsonwebtoken.sign({ _id: '123qweasd' }, 'ThisIsMyVerifiedToken');
//     console.log(jsonweb)
//     const data = jsonwebtoken.verify(jsonweb, 'ThisIsMyVerifiedToken');
//     console.log(data)
//     // const pass= "1h@daJob"
//     // const hashPass = await bcrypt.hash(pass,8)
//     // console.log(hashPass)
//     // const isMatch = await bcrypt.compare(pass,hashPass)
//     // console.log(isMatch)
// }


// checkBcryptAlgo().then(() => {

// }).catch((e) => {
//     console.log(e)
// })

const tasks = require('./models/task')
const users = require('./models/user')

app.listen(port, () => {
    console.log('Server is running on ', port);
})

// main = async () => {
//     // const user = await users.findById('5f73026fbc0e8b28f0d1d017');
//     // await user.populate('tasks').execPopulate()
//     // console.log(user.tasks)

//     // const task = await tasks.findById('5f730276bc0e8b28f0d1d019');
//     // await task.populate('owner').execPopulate()
//     // console.log(task.owner)

// }


// main();


const multer = require('multer');
const upload = multer({
    dest: 'images',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        // if (!file.originalname.endsWith('.pdf')) {
        //     cb(new Error("Please upload pdf"))
        // }

        if (!file.originalname.match(/\.(doc|docx)$/)) {
            cb(new Error("Please upload word"))
        }
        cb(undefined, true)
    }
})

app.post('/upload', upload.single('upload'), (req, res) => {
    res.send()
}, (error,req, res, next) => {
    res.status(400).send({ error: error.message })
})