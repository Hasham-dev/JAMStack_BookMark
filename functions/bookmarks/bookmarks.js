const { ApolloServer, gql } = require('apollo-server-lambda')

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
  }
`

const authors = [
  { id: 1, url: 'https://dashboard.fauna.com/keys/@db/mytestdatabase', desc: "Faunadb" },
  { id: 2, url: 'https://www.apollographql.com/docs/react/get-started/', desc: "Apollo Client" },
  { id: 3, url: 'https://app.netlify.com/teams/hasham-dev/overview', desc: "Neltify Page" },
]

const resolvers = {
  Query: {
    
    bookmark: (root, args,context) => {
      return authors
    },
  },
  Mutation:{
    addBookmark: (_,{url,desc})=>{
      console.log('url--desc',url,desc);
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

exports.handler = server.createHandler()
