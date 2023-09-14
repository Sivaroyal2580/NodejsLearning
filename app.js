var mongoose = require("mongoose");
var express = require("express");
const Course = require('./Models/schema'); // Import the Course model
const port = process.env.PORT || 3000;
const app = express();
//schema 
//connecting db


// const newCourse = new Course({
//   title: 'Node.js Basics',
//   instructor: 'John Doe',
//   duration: 60,
// });

// newCourse.save((err) => {
//   if (err) {
//     console.error('Error saving course:', err);
//   } else {
//     console.log('Course saved successfully');
//   }
// });


mongoose.connect('mongodb://127.0.0.1:27017/learning', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
//verifying db
const db=mongoose.connection;
db.on('error',console.error.bind(console,'mongodbconnection error'));
db.once('open',()=>{
    console.log('connected')
})

const newCourse = new Course({
    title: 'Node.js Basics',
    instructor: 'John Doe',
    duration: 60,
  });
  
  newCourse.save()
    .then(() => {
      console.log('Course saved successfully');
    })
    .catch((err) => {
      console.error('Error saving course:', err);
    });
//get fucntion
app.get("/", (req, res) => {
  res.send("Hello, Expressss!");
});
//port or app server
app.listen(port, () => {
  console.log("server is up");
});
