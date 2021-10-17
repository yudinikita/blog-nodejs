import PostModel, { IPost, PostDocument } from '../models/Post'
import UserModel from '../models/User'
import { Types } from 'mongoose'
import FileService from './files'

class PostService {
  async getPosts (page: number, limit: number): Promise<Array<PostDocument>> {
    return PostModel.find()
      .limit(limit)
      .skip((page - 1) * limit)
      .exec()
  }

  async countDocuments (): Promise<number> {
    return PostModel.countDocuments()
  }

  async createPost (authorLogin: string, postData: IPost, files): Promise<PostDocument> {
    const filesMedia = files?.media || []
    const media: Array<string> = await FileService.getMediaPath(filesMedia)

    let author = await UserModel.findOne({ login: authorLogin })
    author = author._id

    const newPost: PostDocument = new PostModel({ ...postData, media, author })
    return await newPost.save()
  }

  async deletePost (authorLogin: string, _id: Types.ObjectId): Promise<object> {
    let author = await UserModel.findOne({ login: authorLogin })
    author = author._id

    return PostModel.deleteOne({ author, _id })
  }

  async putPost (authorLogin: string, postData: PostDocument): Promise<PostDocument> {
    let author = await UserModel.findOne({ login: authorLogin })
    author = author._id

    return PostModel.findOneAndUpdate(
      { author, _id: postData._id },
      {
        $set: {
          message: postData.message
        }
      },
      { returnOriginal: false }
    )
  }
}

export default new PostService()
