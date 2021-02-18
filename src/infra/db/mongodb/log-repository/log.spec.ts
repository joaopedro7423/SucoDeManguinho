import { MongoHelper } from '../helpers/mongo-helper'
import env from '../../../../main/config/env'
import { Collection } from 'mongodb'
import { LogMongoRepository } from './log'

describe('Log Mongo Repository',() => {
  let errorCollection: Collection
  // variavel constante do tipo collection

  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.deleteMany({})
  })

  test('Should create an error log on success',async () => {
    const sut = new LogMongoRepository() // é a classe que fica na produção caraio kkkkkkkkk
    await sut.logError('any_error')
    const count = await errorCollection.countDocuments()
    expect(count).toBe(1)
  })
})
