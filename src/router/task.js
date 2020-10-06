const express = require('express');
const router = new express.Router();
const Task = require('../models/task')
const auth = require('../middleware/auth');
const { findById } = require('../models/task');
const { compareSync } = require('bcrypt');

router.delete('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findOneAndDelete({ _id, owner: req.user._id });

        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get('/tasks', auth, async (req, res) => {
    match = {}
    sort = {}
    console.log(req.query)
    if (req.query.sortBy) {
        const part = req.query.sortBy.split(':')
        console.log(part)
        sort[part[0]] = part[1] === 'desc' ? -1 : 1;
    }

    if (req.query.completed) {
        match.completed = (req.query.completed === 'true');
    }

    try {
        // const newTask = await Task.find({ owner: req.user._id });
        await req.user.populate({
            path: 'tasks', match, options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        // if (!newTask) {
        //     return res.status(404).send();
        // }
        res.status(201).send(req.user.tasks)
    } catch (e) {
        res, send(e)
    }
})


router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const FindByID = await Task.findOne({ _id, owner: req.user._id });
        console.log(FindByID)
        if (!FindByID) {
            return res.status(404).send();
        }

        res.send(FindByID)
    } catch (e) {
        res.send(e)
    }
})


router.patch('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    const updateProp = Object.keys(req.body)
    const dtoPorperties = ['completed', 'description'];
    const isInvalidProp = updateProp.every((prop) => dtoPorperties.includes(prop));
    if (!isInvalidProp) {
        return res.status(400).send({ error: 'Invalid Properties' });
    }

    try {
        // const FindByIDAndUpdate = await Task.findByIdAndUpdate({ _id, owner: req.user_id }, req.body, { new: true, runValidators: true });

        const task = await Task.findOne({ _id, owner: req.user._id })
        if (!task) {
            return res.status(404).send();
        }
        console.log(req.body)
        dtoPorperties.forEach((prop) => {
            task[prop] = req.body[prop];
        })
        console.log(task)
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.send(e)
    }
})

router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        const newUser = await user.save();
        const token = await newUser.generateToken();
        res.status(201).send({ newUser, token })
    }
    catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})


router.post('/tasks', auth, async (req, res) => {
    // const tasks = new Task(req.body);
    console.log(req.user)
    const tasks = new Task({
        ...req.body, owner: req.user._id
    })
    try {
        await tasks.save()
        res.status(201).send(tasks)
    }
    catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router