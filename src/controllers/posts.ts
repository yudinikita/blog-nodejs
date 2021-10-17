import { Request, Response } from 'express'
import PostService from '../service/posts'
import { PostDocument, IPost } from '../models/Post'
import { Types } from 'mongoose'

export const getPosts = async (req: Request, res: Response): Promise<Response> => {
  try {
    const limit: number = 20
    const currentPage: number = parseInt(<string>req?.query?.page) || 1

    const count: number = await PostService.countDocuments()
    const totalPages: number = Math.ceil(count / limit)

    if (currentPage > totalPages) {
      return res.status(200).json({
        success: false,
        message: 'По вашему запросу ничего не найдено'
      })
    }

    const posts: Array<PostDocument> = await PostService.getPosts(currentPage, limit)

    return res.status(200).json({
      success: true,
      totalPages,
      currentPage,
      countPosts: posts.length,
      data: posts
    })
  } catch (e) {
    return res.status(500).json({
      error: e.message,
      success: false,
      message: 'Ошибка сервера при получении записей'
    })
  }
}

export const createPost = async (req: Request, res: Response): Promise<Response> => {
  try {
    const postData: IPost = req.body
    const files = req?.files || []
    // @ts-ignore
    const authorLogin: string = req.user.login

    const post: PostDocument = await PostService.createPost(authorLogin, postData, files)

    return res.status(200).json({
      success: true,
      data: post
    })
  } catch (e) {
    return res.status(500).json({
      error: e.message,
      success: false,
      message: 'Ошибка сервера при создании записи'
    })
  }
}

export const deletePost = async (req: Request, res: Response): Promise<Response> => {
  try {
    const postId: Types.ObjectId = req.body
    // @ts-ignore
    const authorLogin: string = req.user.login

    const deletedCount: object = await PostService.deletePost(authorLogin, postId)

    return res.status(200).json({
      success: true,
      data: deletedCount
    })
  } catch (e) {
    return res.status(500).json({
      error: e.message,
      success: false,
      message: 'Ошибка сервера при удалении записи'
    })
  }
}

export const putPost = async (req: Request, res: Response): Promise<Response> => {
  try {
    const postData: PostDocument = req.body
    // @ts-ignore
    const authorLogin: string = req.user.login

    const result: PostDocument = await PostService.putPost(authorLogin, postData)

    return res.status(200).json({
      success: true,
      data: result
    })
  } catch (e) {
    return res.status(500).json({
      error: e.message,
      success: false,
      message: 'Ошибка сервера при изменении записи'
    })
  }
}
