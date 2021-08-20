import { ModelAttributeColumnOptions, INTEGER, STRING, BOOLEAN } from "sequelize";

export const string = (allowNull: boolean = false, attributes?: Partial<ModelAttributeColumnOptions<any>>) => {
  return {
    allowNull: allowNull,
    type: STRING,
    ...attributes
  }
}

export const int = (allowNull: boolean = false, attributes?: Partial<ModelAttributeColumnOptions<any>>) => {
  return {
    allowNull: allowNull,
    type: INTEGER,
    ...attributes
  }
}

export const uint = (allowNull: boolean = false, attributes?: Partial<ModelAttributeColumnOptions<any>>) => {
  return {
    allowNull: allowNull,
    type: INTEGER.UNSIGNED,
    ...attributes
  }
}

export const bool = (allowNull: boolean = false, attributes?: Partial<ModelAttributeColumnOptions<any>>) => {
  return {
    allowNull: allowNull,
    type: BOOLEAN,
    ...attributes
  }
}