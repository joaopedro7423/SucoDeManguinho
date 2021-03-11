import { Express, Router } from 'express'
import { readdirSync } from 'fs'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  const path = require('path')
  const test = path.join(`${__dirname}`,'/../routes')
  readdirSync(test).map(async file => {
    if (!file.includes('.test.') && !file.endsWith('.map')) {
      (await import(`../routes/${file}`)).default(router)
      console.log(file)
    }
  })
}
