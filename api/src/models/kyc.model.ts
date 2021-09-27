import { Model } from 'sequelize'

export default class KYC extends Model {
  public user_address!: string
  public KYC_key!: string
}
