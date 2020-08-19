//mongoose.connect('mongodb://localhost/noderest', { useMongoClient: true });
const uri = "mongodb://localhost/noderest";

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/nodetest', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

mongoose.Promise = global.Promise;

module.exports = mongoose;
