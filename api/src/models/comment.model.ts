import { Model } from "sequelize";
import { User } from "@passive-income/psi-api";

export default class Comment extends Model {
  public id!: number;
  public user_id!: string;
  public message!: string;
  public campaign_address?: string;
  public user?: User;
}
