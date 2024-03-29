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
    password: '123',
    role: 'admin'
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

describe('SurveyResult GraphQl', () => {
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

  describe('SurveyResult Query', () => {
    const surveyResultQuery = gql`
      query surveyResult ($surveyId: String!){
        surveyResult (surveyId: $surveyId){
          question
          answers {
            answer
            count
            percent
            isCurrentAccountAnswer
          }
          date
        }
      }
    `

    test('should return SurveyResult', async () => {
      const accessToken = await makeAccessToken()
      const now = new Date()
      const surveyRes = await surveyCollection.insertOne({
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
      const res: any = await query(surveyResultQuery,{
        variables: {
          surveyId: surveyRes.ops[0]._id.toString()
        }
      })
      expect(res.data.surveyResult.question).toBe('Question')
      expect(res.data.surveyResult.date).toBe(now.toISOString())
      expect(res.data.surveyResult.answers).toEqual([{
        answer: 'Answer 1',
        count: 0,
        percent: 0,
        isCurrentAccountAnswer: false
      },{
        answer: 'Answer 2',
        count: 0,
        percent: 0,
        isCurrentAccountAnswer: false
      }])
    })

    test('should return AccessDeniedError if no token is provided', async () => {
      const surveyRes = await surveyCollection.insertOne({
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
       const res: any = await query(surveyResultQuery,{
        variables: {
          surveyId: surveyRes.ops[0]._id.toString()
        }
      })
       expect(res.data).toBeFalsy()
       expect(res.errors[0].message).toBe('Você não tem acesso a isso.')
      })
  })
  describe('SaveSurveyResult Mutation', () => {
    const saveSurveyResultMutation = gql`
      mutation saveSurveyResult ($surveyId: String!, $answer: String!){
        saveSurveyResult (surveyId: $surveyId, answer: $answer){
          question
          answers {
            answer
            count
            percent
            isCurrentAccountAnswer
          }
          date
        }
      }
    `

    test('should return SurveyResult', async () => {
      const accessToken = await makeAccessToken()
      const now = new Date()
      const surveyRes = await surveyCollection.insertOne({
        question: 'Question',
        answers: [{
          answer: 'Answer 1',
          image: 'http://image-name.com'
        },{
          answer: 'Answer 2'
        }],
        date: new Date()
      })
      const { mutate } = createTestClient({
         apolloServer,
         extendMockRequest: {
           headers: {
             'x-access-token': accessToken
           }
         }
      })
      const res: any = await mutate(saveSurveyResultMutation,{
        variables: {
          surveyId: surveyRes.ops[0]._id.toString(),
          answer: 'Answer 1'
        }
      })
      expect(res.data.saveSurveyResult.question).toBe('Question')
      expect(res.data.saveSurveyResult.date).toBe(now.toISOString())
      expect(res.data.saveSurveyResult.answers).toEqual([{
        answer: 'Answer 1',
        count: 1,
        percent: 100,
        isCurrentAccountAnswer: true
      },{
        answer: 'Answer 2',
        count: 0,
        percent: 0,
        isCurrentAccountAnswer: false
      }])
    })

    test('should return AccessDeniedError if no token is provided', async () => {
      const surveyRes = await surveyCollection.insertOne({
         question: 'Question',
         answers: [{
           answer: 'Answer 1',
           image: 'http://image-name.com'
         },{
           answer: 'Answer 2'
         }],
         date: new Date()
       })
       const { mutate } = createTestClient({ apolloServer })
      const res: any = await mutate(saveSurveyResultMutation,{
        variables: {
          surveyId: surveyRes.ops[0]._id.toString(),
          answer: 'Answer 1'
        }
      })
       expect(res.data).toBeFalsy()
       expect(res.errors[0].message).toBe('Você não tem acesso a isso.')
      })
  })
})
