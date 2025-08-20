import exprerss from 'express'
import userAuth from '../middlewares/userAuth.js';
import { getUserData } from '../controllers/user.controller.js';

const userRouter = exprerss.Router();

userRouter.get('/data',  userAuth, getUserData);

export default userRouter;