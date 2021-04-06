import { AccountMongoRepository } from './account-mongo-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import { mockAddAccountParams } from '@/domain/test'
import { Collection } from 'mongodb'
import env from '@/main/config/env'
import faker from 'faker'

let accountCollection: Collection

describe('AccountMongoRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }
  describe('add()',() => {
    test('Should return an account on success', async () => {
      const sut = makeSut()
      const addAccountParams = mockAddAccountParams()
      const isValid = await sut.add(addAccountParams)
      expect(isValid).toBe(true)
     })
  })

  describe('loadByEmail()',() => {
    test('Should return an account on success', async () => {
      const sut = makeSut()
      const addAccountParams = mockAddAccountParams()
      await accountCollection.insertOne(addAccountParams)
      const account = await sut.loadByEmail(addAccountParams.email)
      expect(account).toBeTruthy()// verifica se tem algo, nao importa o que.toBeTruthy
      expect(account.id).toBeTruthy()// se ele tem um id
      expect(account.name).toBe(addAccountParams.name) // se tem um nome igual ao tobe
      expect(account.password).toBe(addAccountParams.password) // se tem um password igual ao tobe
    })

    test('Should return null if loadbyEmail fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByEmail(faker.internet.email())
      expect(account).toBeFalsy()// verifica se tem algo, nao importa o que.toBeTruthy
    })
  })

  describe('UpdateAccessToken()',() => {
    test('Should update the account accessToken on success', async () => {
      const sut = makeSut()
      const res = await accountCollection.insertOne(mockAddAccountParams())
      const fakeAccount = res.ops[0]
      expect(fakeAccount.accessToken).toBeFalsy()
      const accessToken = faker.random.uuid()
      await sut.updateAccessToken(fakeAccount._id, accessToken)
      const account = await accountCollection.findOne({ _id: fakeAccount._id })
      expect(account).toBeTruthy()// verifica se tem algo, nao importa o que.toBeTruthy
      // se tem um email igual ao tobe
      expect(account.accessToken).toBe(accessToken) // se tem um password igual ao tobe
    })
  })

  describe('loadByToken()',() => {
    let name = faker.name.findName()
    let email = faker.internet.email()
    let password = faker.internet.password()
    let accessToken = faker.random.uuid()

    beforeEach(() => {
      name = faker.name.findName()
      email = faker.internet.email()
      password = faker.internet.password()
      accessToken = faker.random.uuid()
    })

    test('Should return an account on loadByToken without role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name,
        email,
        password,
        accessToken
      })
      const account = await sut.loadByToken(accessToken)
      expect(account).toBeTruthy()// verifica se tem algo, nao importa o que.toBeTruthy
      expect(account.id).toBeTruthy()// se ele tem um id
     })

    test('Should return an account on loadByToken with admin role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name,
        email,
        password,
        accessToken,
        role: 'admin'
      })
      const account = await sut.loadByToken(accessToken, 'admin')
      expect(account).toBeTruthy()// verifica se tem algo, nao importa o que.toBeTruthy
      expect(account.id).toBeTruthy()// se ele tem um id
       })

    test('Should return null on loadByToken with invalid role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name,
        email,
        password,
        accessToken
      })
      const account = await sut.loadByToken(accessToken, 'admin')
      expect(account).toBeFalsy()// verifica se tem algo, nao importa o que.toBeTruthy
    })

    test('Should return an account on loadByToken with if user is admin', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name,
        email,
        password,
        accessToken,
        role: 'admin'
      })
      const account = await sut.loadByToken(accessToken)
      expect(account).toBeTruthy()// verifica se tem algo, nao importa o que.toBeTruthy
      expect(account.id).toBeTruthy()// se ele tem um id
     })

    test('Should return null if loadByToken fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByToken(accessToken)
      expect(account).toBeFalsy()// verifica se tem algo, nao importa o que.toBeTruthy
    })
  })
})
