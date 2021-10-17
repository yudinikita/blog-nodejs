import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

export interface IPost {
  message: string
  author: object
  media: Array<object>
}

export type PostDocument = IPost & mongoose.Document

const PostSchema = new mongoose.Schema<PostDocument>({
  message: {
    type: String,
    required: [true, 'Введите сообщение поста']
  },
  author: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  media: {
    type: [String],
    required: false
  }
}, { timestamps: true })

PostSchema.plugin(mongoosePaginate)

export default mongoose.model<PostDocument>('Post', PostSchema)
