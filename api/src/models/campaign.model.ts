import { Model } from 'sequelize'

export default class Campaign extends Model {
  public id!: number
  public campaign_address!: string
  public token_address!: string
  public owner!: string
  public kycVerified!:boolean
  public description?: string
}
