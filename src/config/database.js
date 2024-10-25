const mongoose = require('mongoose');

const connectDB = async () => {
  await mongoose.connect("mongodb+srv://svsumit9810:Svsumit9810@nodejs.qgfkj.mongodb.net/developerConnect");
};

module.exports = {connectDB};
