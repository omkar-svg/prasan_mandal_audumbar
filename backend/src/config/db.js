const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    dialectModule: require('pg'),
    logging: false,

    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Supabase PostgreSQL connected successfully.');
  } catch (error) {
    console.error('Unable to connect to Supabase PostgreSQL:');
    console.error(error.message);
    throw error;
  }
};

module.exports = {
  sequelize,
  connectDB,
};