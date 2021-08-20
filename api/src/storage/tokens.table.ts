/* eslint-disable import/prefer-default-export */
import { Sequelize } from "sequelize";
import Token from "../models/token.model";
import { bool, string, uint } from "./defaultTypes";

export const initTokenModel = (sequelize: Sequelize) => {
  Token.init(
    {
      id: uint(true, { primaryKey: true }),
      token_name: string(),
      token_symbol: string(),
      token_address: string(true, {
        unique: true,
        validate: { isLowercase: true },
      }),
      initialSupply: uint(),
      maxSupply: uint(),
      mintable: bool(),
      burnable: bool(),
    },
    {
      modelName: "token",
      sequelize,
      timestamps: true,
    }
  );
};
