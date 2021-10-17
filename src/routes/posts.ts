import Router from 'express'
import { auth } from '../middleware/auth'
import { getPosts, createPost, deletePost, putPost } from '../controllers/posts'

const router = Router()

router
  .route('/')
  .get(getPosts)
  .post(auth, createPost)
  .delete(auth, deletePost)
  .put(auth, putPost)

export default router
