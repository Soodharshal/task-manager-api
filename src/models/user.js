
const { default: validator } = require('validator');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { response } = require('express');
const jwt = require('jsonwebtoken');
const task = require('./task')
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        age: {
            type: Number,
            default: 0,
            validate(value) {
                if (value < 0) {
                    throw new Error('Age always be positive');
                }
            }
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Email in wrong format');
                }
            }
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minlength: 7,
            validate(pass) {
                // if (pass.length > 6) {
                //     throw new Error('password is not greater than 6 digits')
                // }
                if (pass.includes('password')) {
                    throw new Error('password does not contain letter password')
                }
            }
        },
        tokens: [{
            token: {
                type: String,
                required: true,
            }
        }],
        avatar: {
            type: Buffer
        }
    }, {
    timestamps: true
}
)

userSchema.virtual('tasks', {
    ref: 'task',
    localField: '_id',
    foreignField: 'owner'
})

//toJSON call when we use JSON.stringify
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;

    return userObject
}

userSchema.methods.generateToken = async function () {
    const user = this;
    const jwtToken = jwt.sign({ _id: user._id.toString() }, process.env.JSW_TOKEN);
    user.tokens = user.tokens.concat({ 'token': jwtToken })
    user.save()
    return jwtToken;
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('unable to login');
    }
    const isMatchPass = await bcrypt.compare(password, user.password);
    if (!isMatchPass) {
        throw new Error('unable to login');
    }
    return user;
};

// plain text password
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

userSchema.pre('remove', async function (next) {
    const user = this;
    await task.deleteMany({ owner: user._id })
    next()
})


const User = mongoose.model('user', userSchema);

module.exports = User;