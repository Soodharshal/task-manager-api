const { default: validator } = require('validator');
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    description: {
        type: String,
        trim: true,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },

}, {
    timestamps: true
})

const task = mongoose.model('task', TaskSchema);

TaskSchema.pre('save', async function (next) {
    // const user = this;
    // if (user.isModified('password')) {
    //     user.password = await bcrypt.hash(user.password, 8)
    // }
    next()
})




// const task = new task_manager({
//     description: 'Task 1',
//     // completed: true
// })

// task.save().then((res) => {
//     console.log(res)
// }).catch((error) => {
//     console.log(error)
// })

module.exports = task