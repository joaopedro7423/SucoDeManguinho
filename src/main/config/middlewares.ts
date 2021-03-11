import { bodyParser, cors, contentType } from '../middlewares'
import { Express } from 'express'

export default (app: Express): void => {
  app.use(bodyParser)// definindo um midware
  app.use(cors)
  app.use(contentType)
}
