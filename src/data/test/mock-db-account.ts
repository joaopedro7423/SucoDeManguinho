import { AddAccountRepository } from '@/data/protocols/db/account/add-account-repository'
import { LoadAccountByEmailRepository } from '../protocols/db/account/load-account-by-email-repository'
import { LoadAccountByTokenRepository } from '../protocols/db/account/load-account-by-token-repository'
import { UpdateAccessTokenRepository } from '../protocols/db/account/update-access-token-repository'
import faker from 'faker'
import { CheckAccountByEmailRepository } from '../protocols/db/account'

export class AddAccountRepositorySpy implements AddAccountRepository {
    result = true
    addAccountParams: AddAccountRepository.Params

  async add (data: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
    this.addAccountParams = data
    return this.result
    }
  }

export class LoadAccountByEmailRepositorySpy implements LoadAccountByEmailRepository {
  result = {
    id: faker.random.uuid(),
    name: faker.name.findName(),
    password: faker.internet.password()
  }

  email: string

  async loadByEmail (email: string): Promise<LoadAccountByEmailRepository.Result> {
     this.email = email
    return Promise.resolve(this.result)
    }
  }

export class CheckAccountByEmailRepositorySpy implements CheckAccountByEmailRepository {
  result = false
  email: string

  async checkByEmail (email: string): Promise<CheckAccountByEmailRepository.Result> {
     this.email = email
    return Promise.resolve(this.result)
    }
  }

export class LoadAccountByTokenRepositorySpy implements LoadAccountByTokenRepository {
  accountModel = { id: faker.random.uuid() }
  token: string
  role: string

  async loadByToken (token: string, role?: string): Promise<LoadAccountByTokenRepository.Result> {
     this.token = token
     this.role = role
    return Promise.resolve(this.accountModel)
    }
  }

export class UpdateAccessTokenRepositorySpy implements UpdateAccessTokenRepository {
  id: string
  token: string

  async updateAccessToken (id: string, token: string): Promise<void> {
  this.id = id
  this.token = token
    return Promise.resolve()
    }
  }
