const mongoose = require('mongoose');

const lifestyleFaculty = mongoose.Schema({
   department: {type: String, default: ''},
   faculty: {type: String, default: ''},
   image: {type: String, default: 'default.png'},
   followers: [{
         username: {type: String, default: ''},
         email: {type: String, default: ''}
   }]

});

module.exports = mongoose.model('Lifestyle', lifestyleFaculty);