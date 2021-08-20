import { Model } from "sequelize";

export default class Comment extends Model {
  public id!: number;
  public token_name!: string;
  public token_symbol!: string;
  public token_address!: string;
  public initialSupply?: number;
  public maxSupply?: number;
  public mintable?: boolean;
  public burnable?: boolean;
}
