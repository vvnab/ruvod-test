import gql from "graphql-tag";

export const USERS = gql`
query {
  users {
    id
    name
    email
  }
}
`;

export const USER = gql`
  query user($id: ID!) {
    user(id: $id) {
      id
      name
      email
    }
  }
`;

export const ADD_USER = gql`
  mutation createUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      email
    }
  }
`;

export const UPDATE_USER = gql`
  mutation updateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      name
      email
    }
  }
`;

export const DELETE_USER = gql`
  mutation deleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
      name
      email
    }
  }
`;