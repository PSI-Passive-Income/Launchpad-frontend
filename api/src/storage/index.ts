import { Sequelize } from 'sequelize'
import fs from 'fs'
import appRoot from 'app-root-path'
import { storageSettings } from '@passive-income/psi-api'
import { initCampaignModel } from './campaigns.table'
import { initCommentModel } from './comments.table'

let sequelize: Sequelize | null = null
// eslint-disable-next-line import/prefer-default-export
export const initSequelize = async (): Promise<Sequelize> => {
  if (sequelize !== null) return sequelize

  const certificate = fs.readFileSync(`${appRoot.path}/ssl/${storageSettings.certificate}`)
  sequelize = new Sequelize({
    database: storageSettings.database,
    username: storageSettings.username,
    password: storageSettings.password,
    host: storageSettings.host,
    port: 3306,
    logging: false,
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: true,
        ca: certificate,
      },
    },
    pool: {
      max: 5,
      idle: 30000,
      acquire: 60000,
    },
  })

  initCampaignModel(sequelize)
  initCommentModel(sequelize)

  // Create new tables
  await sequelize.sync()

  return sequelize
}
