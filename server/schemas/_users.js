const { gql } = require("apollo-server");

const users = gql`
  scalar Email

  type Query {
    user(id: ID!): User!
    users(skip: Int = 0, limit: Int = 10): [User]
  }

  type Mutation {
    createUser(input: CreateUserInput!): User!
    updateUser(id: ID!, input: UpdateUserInput!): User!
    deleteUser(id: ID!): User!
  }

  type User {
    id: ID!
    email: Email!
    name: String!
  }

  input CreateUserInput {
    email: Email!
    name: String!
  }

  input UpdateUserInput {
    email: Email
    name: String
  }
`;

module.exports = { users }