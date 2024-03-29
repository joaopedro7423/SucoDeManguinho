import { makeApolloServer } from './helpers'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'

import { ApolloServer, gql } from 'apollo-server-express'
import { createTestClient } from 'apollo-server-integration-testing'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import env from '@/main/config/env'

let accountCollection: Collection
let surveyCollection: Collection
let apolloServer: ApolloServer

const makeAccessToken = async (): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'Jooj',
    email: 'Jooj@mail.com',
    password: '123'
  })

  const id = res.ops[0]._id
  const accessToken = sign({ id }, env.jwtSecret)
  await accountCollection.updateOne({
    _id: id
  }, {
    $set: {
      accessToken
    }
  })

  return accessToken
}

describe('Survey GraphQl', () => {
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
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  describe('Surveys Query', () => {
    const surveysQuery = gql`
      query surveys{
        surveys{
          id
          question
          answers{
            image
            answer
          }
          date
          didAnswer
        }
      }
    `

    test('should return Surveys', async () => {
      const accessToken = await makeAccessToken()
      const now = new Date()
      await surveyCollection.insertOne({
        question: 'Question',
        answers: [{
          answer: 'Answer 1',
          image: 'http://image-name.com'
        },{
          answer: 'Answer 2'
        }],
        date: new Date()
      })
      const { query } = createTestClient({
         apolloServer,
         extendMockRequest: {
           headers: {
             'x-access-token': accessToken
           }
         }
      })
      const res: any = await query(surveysQuery)
      expect(res.data.surveys.length).toBe(1)
      expect(res.data.surveys[0].id).toBeTruthy()
      expect(res.data.surveys[0].question).toBe('Question')
      expect(res.data.surveys[0].date).toBe(now.toISOString())
      expect(res.data.surveys[0].didAnswers).toBeFalsy()
      expect(res.data.surveys[0].answers).toEqual([{
        answer: 'Answer 1',
        image: 'http://image-name.com'
      },{
        answer: 'Answer 2',
        image: null
      }])
    })

    test('should return AccessDeniedError if no token is provided', async () => {
     await surveyCollection.insertOne({
        question: 'Question',
        answers: [{
          answer: 'Answer 1',
          image: 'http://image-name.com'
        },{
          answer: 'Answer 2'
        }],
        date: new Date()
      })
      const { query } = createTestClient({ apolloServer })
      const res: any = await query(surveysQuery)
      expect(res.data).toBeFalsy()
      expect(res.errors[0].message).toBe('Você não tem acesso a isso.')
    })
  })
})
