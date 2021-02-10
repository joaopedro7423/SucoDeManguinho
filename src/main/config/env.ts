import env from 'dotenv'
env.config()

export default {
  // MONGO_URL: process.env.MONGO_URL ?? process.env.MONGO_DATABASE,
  mongoUrl: process.env.MONGO_URL ?? 'mongodb://localhost:27017/clean-node-api',
  port: process.env.PORT ?? 5050
}
