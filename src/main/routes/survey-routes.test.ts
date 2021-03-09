import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import env from '../../main/config/env'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'

let surveyCollection: Collection
let accountCollection: Collection

const makeAccessToken = async (role?: string): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'Guilherme',
    email: 'gui@mail.com',
    password: 'Adjiguix5',
    role
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

describe('Survey Routes',() => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST / surveys', () => {
    test('Should return 403 on add Survey without accessToken', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'Question',
          answers: [{
            answer: 'Answer 1',
            image: 'http://image-name.com'
          },{
            answer: 'Answer 2'
          }]
        })
        .expect(403)
    })

    test('Should return 204 on add Survey with valid accessToken', async () => {
      const accessToken = await makeAccessToken('admin')

      await request(app)
        .post('/api/surveys')
        .set('x-access-token',accessToken)
        .send({
          question: 'Question',
          answers: [{
            answer: 'Answer 1',
            image: 'http://image-name.com'
          },{
            answer: 'Answer 2'
          }]
        })
        .expect(204)
    })
  })
})
