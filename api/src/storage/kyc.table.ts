/* eslint-disable import/prefer-default-export */
import { Sequelize } from 'sequelize'
import Kyc from '../models/kyc.model'
import { string } from './defaultTypes'

export const initKycModel = (sequelize: Sequelize) => {
  Kyc.init(
    {
      user_address: string(false, {
        primaryKey: true,
        validate: { isLowercase: true },
      }),
      KYC_key: string(false, {
        unique: true,
        validate: { isLowercase: true },
      }),
    },
    {
      modelName: 'kyc_users',
      sequelize,
      timestamps: true,
      freezeTableName: false,
    },
  )
}
