const mongoose = require('mongoose');

console.log(process.env.MONGOOSE_URL)
mongoose.connect(process.env.MONGOOSE_URL,
    { useNewUrlParser: true, useUnifiedTopology: true }
);


// const me = new task_manager({
//     name: '   Harshal  ',
//     email: 'MADREW@MAD.IO   ',
//     password:'      japans'
// })

// me.save().then((res) => {
//     console.log(res)
// }).catch((error) => {
//     console.log(error)
// })



module.exports = mongoose