/* eslint-disable import/prefer-default-export */
import { Sequelize } from 'sequelize'
import Campaign from '../models/campaign.model'
import { string, uint } from './defaultTypes'

export const initCampaignModel = (sequelize: Sequelize) => {
  Campaign.init(
    {
      id: uint(true, { primaryKey: true }),
      campaign_address: string(true, {
        primaryKey: true,
        validate: { isLowercase: true },
      }),
      token_name: string(),
      token_address: string(true, {
        unique: true,
        validate: { isLowercase: true },
      }),
      owner: string(true, {
        unique: true,
        validate: { isLowercase: true },
      }),
      description: string(),
    },
    {
      modelName: 'campaign',
      sequelize,
      timestamps: true,
    },
  )
}
