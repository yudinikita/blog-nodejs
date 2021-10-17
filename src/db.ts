import mongoose from 'mongoose'

export = async (): Promise<void> => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI)
    console.log(`Connected to MongoDB: ${connect.connection.host}`)
  } catch (e) {
    console.log(`Error connection to MongoDB: ${e.message}`)
    process.exit(1)
  }
}
