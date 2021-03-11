import { AccountMongoRepository } from './account-mongo-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import env from '@/main/config/env'
import { Collection } from 'mongodb'

let accountCollection: Collection

describe('Account Mongo Repository', () => {
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
    test('Should return an account on add success', async () => {
      const sut = makeSut()
      const account = await sut.add({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      })
      expect(account).toBeTruthy()// verifica se tem algo, nao importa o que.toBeTruthy
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('any_password')
    })
  })

  describe('loadByEmail()',() => {
    test('Should return an account on loadbyEmail success', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      })
      const account = await sut.loadByEmail('any_email@mail.com')
      expect(account).toBeTruthy()// verifica se tem algo, nao importa o que.toBeTruthy
      expect(account.id).toBeTruthy()// se ele tem um id
      expect(account.name).toBe('any_name') // se tem um nome igual ao tobe
      expect(account.email).toBe('any_email@mail.com') // se tem um email igual ao tobe
      expect(account.password).toBe('any_password') // se tem um password igual ao tobe
    })

    test('Should return null if loadbyEmail fails', async () => {
      const sut = makeSut()

      const account = await sut.loadByEmail('any_email@mail.com')
      expect(account).toBeFalsy()// verifica se tem algo, nao importa o que.toBeTruthy
    })
  })

  describe('UpdateAccessToken()',() => {
    test('Should update the account accessToken on updateAccessToken success', async () => {
      const sut = makeSut()
      const res = await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      })
      const fakeAccount = res.ops[0]
      expect(fakeAccount.accessToken).toBeFalsy()
      await sut.updateAccessToken(fakeAccount._id, 'any_token')
      const account = await accountCollection.findOne({ _id: fakeAccount._id })
      expect(account).toBeTruthy()// verifica se tem algo, nao importa o que.toBeTruthy
      // se tem um email igual ao tobe
      expect(account.accessToken).toBe('any_token') // se tem um password igual ao tobe
    })
  })

  describe('loadByToken()',() => {
    test('Should return an account on loadByToken without role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        accessToken: 'any_token'

      })
      const account = await sut.loadByToken('any_token')
      expect(account).toBeTruthy()// verifica se tem algo, nao importa o que.toBeTruthy
      expect(account.id).toBeTruthy()// se ele tem um id
      expect(account.name).toBe('any_name') // se tem um nome igual ao tobe
      expect(account.email).toBe('any_email@mail.com') // se tem um email igual ao tobe
      expect(account.password).toBe('any_password') // se tem um password igual ao tobe
    })

    test('Should return an account on loadByToken with admin role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        accessToken: 'any_token',
        role: 'admin'
      })
      const account = await sut.loadByToken('any_token', 'admin')
      expect(account).toBeTruthy()// verifica se tem algo, nao importa o que.toBeTruthy
      expect(account.id).toBeTruthy()// se ele tem um id
      expect(account.name).toBe('any_name') // se tem um nome igual ao tobe
      expect(account.email).toBe('any_email@mail.com') // se tem um email igual ao tobe
      expect(account.password).toBe('any_password') // se tem um password igual ao tobe
    })

    test('Should return null if loadByToken fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByToken('any_token')
      expect(account).toBeFalsy()// verifica se tem algo, nao importa o que.toBeTruthy
    })

    test('Should return null on loadByToken with invalid role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        accessToken: 'any_token'

      })
      const account = await sut.loadByToken('any_token', 'admin')
      expect(account).toBeFalsy()// verifica se tem algo, nao importa o que.toBeTruthy
    })

    test('Should return an account on loadByToken with if user is admin', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        accessToken: 'any_token',
        role: 'admin'
      })
      const account = await sut.loadByToken('any_token')
      expect(account).toBeTruthy()// verifica se tem algo, nao importa o que.toBeTruthy
      expect(account.id).toBeTruthy()// se ele tem um id
      expect(account.name).toBe('any_name') // se tem um nome igual ao tobe
      expect(account.email).toBe('any_email@mail.com') // se tem um email igual ao tobe
      expect(account.password).toBe('any_password') // se tem um password igual ao tobe
    })
  })
})
