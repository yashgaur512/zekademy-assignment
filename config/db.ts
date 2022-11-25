const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://yashgaur512:yashgaur@cluster0.0u7lpey.mongodb.net/?retryWrites=true&w=majority";

let myMongoose = require('mongoose');

const InitiateMongoServer = async () => {
    try {
        console.log("I am connecting");
      await myMongoose.connect(uri, {
        useNewUrlParser: true
      });
      console.log("Connected to DB !!");
    } catch (e) {
      console.log(e);
      throw e;
    }
  };
  

module.exports = InitiateMongoServer;