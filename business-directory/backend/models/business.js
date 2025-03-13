'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Business extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Business.init({
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    category: DataTypes.STRING,
    website: DataTypes.STRING,
    operating_hours: DataTypes.TEXT,
    facebook: DataTypes.STRING,
    instagram: DataTypes.STRING,
    twitter: DataTypes.STRING,
    latitude: DataTypes.DECIMAL,
    longtitude: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'Business',
  });
  return Business;
};