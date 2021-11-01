/* eslint-disable import/prefer-default-export */
import { QueryInterface, Sequelize } from 'sequelize'
import Campaign from '../models/campaign.model'
import { bool, string, uint, text } from './defaultTypes'

export const initCampaignModel = (sequelize: Sequelize) => {
  Campaign.init(
    {
      id: uint(true, { primaryKey: true }),
      campaign_address: string(true, {
        primaryKey: true,
        validate: { isLowercase: true },
      }),
      token_address: string(true, {
        unique: true,
        validate: { isLowercase: true },
      }),
      owner: string(true, {
        unique: true,
        validate: { isLowercase: true },
      }),
      kycVerified:bool(true),
      description: text(),
    },
    {
      modelName: 'campaign',
      sequelize,
      timestamps: true,
    },
  ) 
}
