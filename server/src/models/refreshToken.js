const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RefreshToken extends Model {
    static associate(models) {
      RefreshToken.belongsTo(models.User);
    }
  }
  RefreshToken.init(
    {
      value: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: { notEmpty: true, notNull: true },
      },
      userId: {
        field: 'user_id',
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'RefreshToken',
      tableName: 'refresh_tokens',
      underscored: true,
    },
  );
  return RefreshToken;
};
