const { ApolloServer } = require("apollo-server");
const { createTestClient } = require('apollo-server-testing');

const { typeDefs } = require("./schemas");
const { usersResolvers } = require("./resolvers/_users");

const USERS = {
  all: () => [
    {
      id: "1",
      name: "user1",
      email: "email1@mail.com"
    },
    {
      id: "2",
      name: "user2",
      email: "email2@mail.com"
    }
  ],
  byId(id) { return this.all().find(i => i.id === id) }
};




describe("testing GraphQL shcemas", () => {
  const testServer = new ApolloServer({
    typeDefs,
    resolvers: {
      Email: usersResolvers.Email,
      Query: {
        users: () => USERS.all(),
        user: (_, { id }) => USERS.byId(id),
      },
      Mutation: {
        createUser: (_, { input }) => ({ ...input, id: "1" }),
        updateUser: (_, { id, input }) => ({ id, ...USERS.byId(id), ...input }),
        deleteUser: (_, { id }) => ({ id, ...USERS.byId(id) })
      }
    },
  });

  const client = createTestClient(testServer);

  it("users", async () => {
    const res = await client.query({
      query: `{ users { id, name, email }}`
    });
    expect(res.data.users).toEqual(USERS.all());
  });

  it("user", async () => {
    const res = await client.query({
      query: `{ user(id: "1") { id, name, email }}`
    });
    expect(res.data.user).toEqual(USERS.byId("1"));
  });

  it("createUser", async () => {
    const user = USERS.byId("1");
    const query = `mutation { createUser(input: { name: "${user.name}", email: "${user.email}"}) { id, name, email }}`;
    const res = await client.mutate({
      mutation: query
    });
    expect(res.data.createUser).toEqual(user);
  });

  it("updateUser", async () => {
    const user = USERS.byId("1");
    const query = `mutation { updateUser(id: "1", input: { name: "${user.name}", email: "${user.email}"}) { id, name, email }}`;
    const res = await client.mutate({
      mutation: query
    });
    expect(res.data.updateUser).toEqual(user);
  });

  it("deleteUser", async () => {
    const user = USERS.byId("1");
    const res = await client.mutate({
      mutation: `mutation { deleteUser(id: "1") { id, name, email }}`
    });
    expect(res.data.deleteUser).toEqual(user);
  });

})
