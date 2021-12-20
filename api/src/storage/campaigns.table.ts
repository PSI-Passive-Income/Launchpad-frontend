/* eslint-disable import/prefer-default-export */
import { Sequelize } from 'sequelize'
import Campaign from '../models/campaign.model'
import { bool, string, uint, text } from './defaultTypes'

export const initCampaignModel = (sequelize: Sequelize) => {
  Campaign.init(
    {
      id: uint(false, { primaryKey: true }),
      campaign_address: string(false, {
        primaryKey: true,
        validate: { isLowercase: true },
      }),
      token_address: string(false, {
        validate: { isLowercase: true },
      }),
      owner: string(false, {
        validate: { isLowercase: true },
      }),
      kycVerified: bool(true),
      description: text(true),
    },
    {
      modelName: 'campaign',
      sequelize,
      timestamps: true,
    },
  ) 
}
