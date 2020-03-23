const { GraphQLScalarType } = require("graphql");
const validator = require("validator");
const { User } = require("../models");

const usersResolvers = {
  Email: new GraphQLScalarType({
    name: 'Email',
    parseValue: value => {
      if (validator.isEmail(value)) {
        return value;
      } else {
        throw new Error("Bad email");
      }
    },
    serialize: value => value
  }),
  Query: {
    users: async (_, { skip, limit }) => await User.find({}).skip(skip || 0).limit(limit || 0),
    user: async (_, { id }) => await User.findById(id),
  },
  Mutation: {
    createUser: async (_, { input }) => await User.create(input),
    updateUser: async (_, { id, input }) => await User.findByIdAndUpdate(id, input, { new: true }),
    deleteUser: async (_, { id }) => await User.findByIdAndDelete(id)
  }
};

module.exports = { usersResolvers }