const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth')
// const user = require('../models/users');
const { sendEmail, removeEmail } = require('../email/account')
const multer = require('multer');
const sharp = require('sharp');
router.get('/users/me', auth, async (req, res) => {
    try {
        res.send(req.user)
    } catch (e) {
        res.status(500).send();
    }
});


router.get('/users', auth, async (req, res) => {
    try {
        const newUser = await User.find({});
        if (!newUser) {
            return res.status(404).send();
        }
        res.status(200).send(newUser)
    } catch (e) {
        res.send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    // const _id = req.params.id;
    try {
        // const findByIDAndDelete = await User.findByIdAndDelete(_id);

        // if (!findByIDAndDelete) {
        //     return res.status(404).send()
        // }
        await req.user.remove()
        removeEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch (e) {
        res.status(500).send();
    }
});

const upload = multer({
    // dest: 'avatar',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        // if (!file.originalname.endsWith('.pdf')) {
        //     cb(new Error("Please upload pdf"))
        // }

        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            cb(new Error("Please upload image"))
        }
        cb(undefined, true)
    }
})
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    req.user.avatar = buffer;
    console.log(buffer)
    console.log(req.file.buffer)
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || !user.avatar) {
            throw new Error()
        }
        console.log(user.avatar)
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        console.log(e)
        res.send(e)
    }
})

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const FindByID = await User.findById(_id);
        if (!FindByID) {
            return res.status(404).send();
        }
        res.status(201).send(FindByID)
    } catch (e) {
        res.send(e)
    }
})

router.post('/users/signin', async (req, res) => {
    const user = new User(req.body);
    try {
        const userObject = await user.save()
        const savedToken = await userObject.generateToken();
        res.status(201).send({ userObject, savedToken });
    } catch (e) {
        console.log(e)
        res.status(404).send(e)
    }

})

router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        const newUser = await user.save();
        sendEmail(user.email, user.name);
        const token = await newUser.generateToken();
        res.status(201).send({ newUser, token })
    }
    catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const loginUser = await User.findByCredentials(req.body.email, req.body.password);
        const token = await loginUser.generateToken();
        res.send({ loginUser, token });
    }
    catch (e) {
        console.log(e)
        res.status(404).send(e)
    }
})


router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            token.token !== req.token
        })
        await req.user.save()
        res.send(200)
    } catch (e) {
        console.log(e)
        res.status(404).send(e)
    }

})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send(200)
    } catch (e) {
        console.log(e)
        res.status(404).send(e)
    }
})




router.patch('/users/me', auth, async (req, res) => {
    // const _id = req.params.id;
    const updateProp = Object.keys(req.body)
    const dtoPorperties = ['name', 'email', 'password', 'age'];
    const isInvalidProp = updateProp.every((prop) => dtoPorperties.includes(prop));

    if (!isInvalidProp) {
        return res.status(400).send({ error: 'Invalid Properties' });
    }

    try {
        // const userFindById = await User.findById(_id);
        updateProp.forEach((prop) => req.user[prop] = req.body[prop])

        await req.user.save()
        // if (!userFindById) {
        //     return res.status(404).send();
        // }

        res.status(200).send(req.user)
    } catch (e) {
        res.send(e)
    }
})

module.exports = router