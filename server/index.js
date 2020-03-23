const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");

const { typeDefs } = require("./schemas");
const { resolvers } = require("./resolvers");

require('dotenv').config();

async function main() {
  console.log("mongoDB connecting...");
  try {
    await mongoose.connect(process.env.MONGO_CONNECTION_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });
    console.log("mongoDB connected");
  } catch (ex) {
    console.error(ex.message);
    process.abort(1);
  }
  const server = new ApolloServer({ typeDefs, resolvers });
  
  try {
    const { url } = await server.listen();
    console.log(`Apollo Server ready at ${url}`);
  } catch (ex) {
    console.error(ex.message);
    process.abort(2);
  }
}

main();