var mdb = require('mongoose');

var userschema = new mdb.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, required: true, unique: true }, // Add validation
    password: { type: String, required: true }
});

var user_schema = mdb.model("users", userschema);

module.exports = user_schema;
