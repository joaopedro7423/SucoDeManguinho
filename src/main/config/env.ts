import env from 'dotenv'
env.config()

export default {
  MONGO_URL: process.env.MONGO_URL ?? process.env.MONGO_DATABASE
}
