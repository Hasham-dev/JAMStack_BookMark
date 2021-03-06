const { ApolloServer, gql } = require('apollo-server-lambda')
const faunadb = require('faunadb'),
  q = faunadb.query

const typeDefs = gql`
  type Query {
    bookmark: [Bookmark!]
  }
  type Bookmark {
    id: ID!
    url: String!
    desc: String!
  }
  type Mutation {
    addBookmark(url: String!, desc: String!) : Bookmark
    deleteTask(id: ID!): Bookmark
  }
`

const authors = [
  { id: 1, url: 'https://dashboard.fauna.com/keys/@db/mytestdatabase', desc: "Faunadb" },
  { id: 2, url: 'https://www.apollographql.com/docs/react/get-started/', desc: "Apollo Client" },
  { id: 3, url: 'https://app.netlify.com/teams/hasham-dev/overview', desc: "Neltify Page" },
]

const resolvers = {
  Query: {

    bookmark: async (root, args, context) => {
      try {
        var client = new faunadb.Client({ secret: "fnAD56A0rjACBw0m-hNGEbQIhNV-hfO2A4ku6nln" });
        var result = await client.query(
          q.Map(
            q.Paginate(q.Match(q.Index("url"))),
            q.Lambda(x => q.Get(x))
          )
        )
        return result.data.map(d => {
          console.log(d.ref.id);
          return {
            id: d.ref.id,
            url: d.data.url,
            desc: d.data.desc,
          }
        })
      }
      catch (err) {
        console.log('err', err);
      }

    },
  },
  Mutation: {
    addBookmark: async (_, { url, desc }) => {
      try {
        var client = new faunadb.Client({ secret: "fnAD56A0rjACBw0m-hNGEbQIhNV-hfO2A4ku6nln" });
        var result = await client.query(
          q.Create(
            q.Collection('links'),
            {
              data: {
                url,
                desc
              }
            },
          )

        );
        console.log("Document Created and Inserted in Container: " + result.ref.id);
        return result.ref.data

      }
      catch (error) {
        console.log('Error: ');
        console.log(error);
      }
      console.log('url--desc', url, desc);
    },
    deleteTask: async (_, { id }) => {
      try {
        const reqId = JSON.stringify(id);
        const reqId2 = JSON.parse(id);
        console.log(id);
        var adminClient = new faunadb.Client({ secret: 'fnAD56A0rjACBw0m-hNGEbQIhNV-hfO2A4ku6nln' });
        const result = await adminClient.query(
          q.Delete(q.Ref(q.Collection("links"), id))
        );
        console.log(result);
        return result.ref.data;
      } catch (error) {
        return error.toString();
      }}
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

exports.handler = server.createHandler()
