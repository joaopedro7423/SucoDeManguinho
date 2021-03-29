import setupMiddlewares from './middlewares'
import setupRoutes from './routes'
import express from 'express'
import setupStaticFiles from './static-files'

const app = express()
setupStaticFiles(app)
setupMiddlewares(app)
setupRoutes(app)
export default app
