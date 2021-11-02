import { DataTypes, Sequelize } from 'sequelize'
import fs from 'fs'
import appRoot from 'app-root-path'
import { storageSettings } from '@passive-income/psi-api'
import { initCampaignModel } from './campaigns.table'
import { initCommentModel } from './comments.table'
import { initKycModel } from './kyc.table'

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
      max: 15,
      min: 5,
      idle: 5000,
      evict: 15000,
      acquire: 30000
    },
  })

  initCampaignModel(sequelize)
  initCommentModel(sequelize)
  initKycModel(sequelize)


  // const table = await sequelize.query('SHOW Tables')
  // console.log('table', table)


//   const queryInterface = await sequelize.getQueryInterface().addColumn('campaigns','kycVerified', {
//     type: DataTypes.BOOLEAN // after option is only supported by MySQL
//  })

  // Create new tables
  await sequelize.sync()

  return sequelize
}
