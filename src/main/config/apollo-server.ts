import typeDefs from '@/main/graphql/type-defs'
import resolvers from '@/main/graphql/resolvers'

import { ApolloServer } from 'apollo-server-express'
import { Express } from 'express'

export default (app: Express): void => {
  const server = new ApolloServer({ // para rodar o apollo server precisa de um objeto de configuração
    resolvers,
    typeDefs
  })
  server.applyMiddleware({ app })
}
