import env from '@/main/config/env'
import { MongoHelper } from '../helpers/mongo-helper'
import { LogMongoRepository } from './log-mongo-repository'
import { Collection } from 'mongodb'

// KKKKKK essa porra so serve para n ficar chamando a função toda hora kkkk pqp
const makeSut = (): LogMongoRepository => {
  return new LogMongoRepository()
}

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
    const sut = makeSut()// é a classe que fica na produção caraio kkkkkkkkk
    await sut.logError('any_error')
    const count = await errorCollection.countDocuments()
    expect(count).toBe(1)
  })
})
