import { Model } from 'sequelize'

export default class Campaign extends Model {
  public id!: number
  public campaign_address!: string
  public token_address!: string
  public token_name!: string
  public owner!: string
  public description?: string
}
