const { GraphQLServerLambda } = require('graphql-yoga')

const typeDefs = `type Query { hello: String }`
const resolvers = {
  Query: { hello: () => 'Hello from GraphQL Yoga (with a slinky) on Netlify!' }
}

const lambda = new GraphQLServerLambda({ typeDefs, resolvers })

exports.handler = lambda.handler