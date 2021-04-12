import { makeApolloServer } from './helpers'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'

import { ApolloServer, gql } from 'apollo-server-express'
import { createTestClient } from 'apollo-server-integration-testing'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'
import env from '@/main/config/env'

let accountCollection: Collection
let apolloServer: ApolloServer

describe('Login GraphQl', () => {
  beforeAll(async () => {
    apolloServer = makeApolloServer()
    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('Login Query', () => {
    const loginQuery = gql`
      query login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          accessToken
          name
        }
      }
    `

    test('should return an account on valid credentials', async () => {
      const password = await hash('123', 12)// criando o hash da conta
      await accountCollection.insertOne({ // criando a contna
        name: 'JooJ',
        email: 'jooj@gmail.com',
        password
      })
      const { query } = createTestClient({ apolloServer })
      const res: any = await query(loginQuery, {
        variables: {
          email: 'jooj@gmail.com',
          password: '123'
        }
      })
      expect(res.data.login.accessToken).toBeTruthy()
      expect(res.data.login.name).toBe('JooJ')
    })

    test('should return UnauthorizedError on invalid credentials', async () => {
      const { query } = createTestClient({ apolloServer })
      const res: any = await query(loginQuery, {
        variables: {
          email: 'jooj@gmail.com',
          password: '123'
        }
      })
      expect(res.data).toBeFalsy()
      expect(res.errors[0].message).toBe('Não Autorizado')
    })

    test('should return InvalidParamError on invalid email', async () => {
        const { query } = createTestClient({ apolloServer })
        const res: any = await query(loginQuery, {
          variables: {
            email: 'jooj',
            password: '123'
          }
        })
        expect(res.data).toBeFalsy()
        expect(res.errors[0].message).toBe('Invalid param: email')
      })
  })

  describe('SignUp Mutation', () => {
    const signUpMutation = gql`
      mutation signUp($name: String!, $email: String!, $password: String!, $passwordConfirmation: String!) {
        signUp(name:$name, email: $email, password: $password, passwordConfirmation: $passwordConfirmation) {
          accessToken
          name
        }
      }
    `

    test('should return an account on valid data', async () => {
      const { mutate } = createTestClient({ apolloServer })
      const res: any = await mutate(signUpMutation, {
        variables: {
            name: 'iriney',
          email: 'jooj@gmail.com',
          password: '123',
          passwordConfirmation: '123'
        }
      })
      expect(res.data.signUp.accessToken).toBeTruthy()
      expect(res.data.signUp.name).toBe('iriney')
    })

    test('should return EmailInUseError on valid data', async () => {
      const password = await hash('123', 12)
      await accountCollection.insertOne({
        name: 'JooJ',
        email: 'jooj@gmail.com',
        password
      })
        const { mutate } = createTestClient({ apolloServer })
        const res: any = await mutate(signUpMutation, {
          variables: {
              name: 'iriney',
            email: 'jooj@gmail.com',
            password: '123',
            passwordConfirmation: '123'
          }
        })
        expect(res.data).toBeFalsy()
        expect(res.errors[0].message).toBe('O email recebido já está em uso')
    })
})
})
