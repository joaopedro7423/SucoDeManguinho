import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'
import { mockAddAccountParams, mockAddSurveyParams } from '@/domain/test'
import { Collection } from 'mongodb'
import env from '@/main/config/env'
// import faker from 'faker'
import FakeObjectID from 'bson-objectid'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const mockAccountId = async (): Promise<string> => {
  const res = await accountCollection.insertOne(mockAddAccountParams())
  return res.ops[0]._id
}

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

describe('SurveyMongoRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})

    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})

    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('add()', () => {
    test('Should add a survey on success', async () => {
      const sut = makeSut()
      await sut.add(mockAddSurveyParams())
      const count = await surveyCollection.countDocuments()
      expect(count).toBe(1)
    })
  })

  describe('loadAll()', () => {
    test('Should load All survey on success', async () => {
      const accountId = await mockAccountId()
      const addSurveyModels = [mockAddSurveyParams(), mockAddSurveyParams()]
      const result = await surveyCollection.insertMany(addSurveyModels)
      const survey = result.ops[0]
      await surveyResultCollection.insertOne({
        surveyId: survey._id,
        accountId,
        answer: survey.answers[0].answer,
        date: new Date()
      })
      const sut = makeSut()
      const surveys = await sut.loadAll(accountId)
      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].question).toBe(addSurveyModels[0].question)
      expect(surveys[0].didAnswer).toBe(true)
      expect(surveys[1].question).toBe(addSurveyModels[1].question)
      expect(surveys[1].didAnswer).toBe(false)
    })

    test('Should load empty list', async () => {
      const accountId = await mockAccountId()
      const sut = makeSut()
      const surveys = await sut.loadAll(accountId)
      expect(surveys.length).toBe(0)
    })
  })

  describe('loadById()', () => {
    test('Should load survey by id on success', async () => {
      const res = await surveyCollection.insertOne(mockAddSurveyParams())
      const sut = makeSut()
      const survey = await sut.loadById(res.ops[0]._id)
      expect(survey).toBeTruthy()
      expect(survey.id).toBeTruthy()
    })

    test('Should return null if survey does not exists', async () => {
      const sut = makeSut()
      const survey = await sut.loadById(FakeObjectID.generate())
      expect(survey).toBeFalsy()
    })
  })

  describe('loadAnswers()', () => {
    test('Should load answers on success', async () => {
      const res = await surveyCollection.insertOne(mockAddSurveyParams())
      const survey = res.ops[0]
      const sut = makeSut()
      const answers = await sut.loadAnswers(survey._id)
      expect(answers).toEqual([
        survey.answers[0].answer,
        survey.answers[1].answer])
    })

    test('Should return empty array if survey does not exists', async () => {
      const sut = makeSut()
      const answers = await sut.loadAnswers(FakeObjectID.generate())
      expect(answers).toEqual([])
    })
  })

  describe('checkById()', () => {
    test('Should return true if survey exists', async () => {
      const res = await surveyCollection.insertOne(mockAddSurveyParams())
      const sut = makeSut()
      const exists = await sut.checkById(res.ops[0]._id)
      expect(exists).toBeTruthy()
    })
// teste do manguinho para verificar se o survey existe. ta bugado por causa do objectId vou pular para depois voltar , mas confia ta funfando

    test('Should return false if survey exists', async () => {
      const sut = makeSut()
      const exists = await sut.checkById(FakeObjectID.generate())
      expect(exists).toBeFalsy()
    })
  })
})
