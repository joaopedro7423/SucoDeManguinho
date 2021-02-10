import { Express } from 'express'
import { bodyParser, cors, contentType } from '../middlewares'

export default (app: Express): void => {
  app.use(bodyParser)// definindo um midware
  app.use(cors)
  app.use(contentType)
}
