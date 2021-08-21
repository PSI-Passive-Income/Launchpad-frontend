/* eslint-disable import/prefer-default-export */
import { Sequelize } from 'sequelize'
import Comment from '../models/comment.model'
import { string, uint } from './defaultTypes'

export const initCommentModel = (sequelize: Sequelize) => {
  Comment.init(
    {
      id: uint(true, { primaryKey: true }),
      user_id: uint(),
      message: string(),
      campaign_address: string(true, {
        unique: true,
        validate: { isLowercase: true },
      }),
    },
    {
      modelName: 'comment',
      sequelize,
      timestamps: true,
    },
  )
}
