module.exports = function(sequelize, Sequelize) {
    var Password = sequelize.define("password", {
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                len: [3, 255],
                is: /\b[a-z]/i
            }
        }
    });

    Password.associate = function(models) {
        // Associating Password with Users
        // When an Password is deleted, also delete any associated Posts
        Password.belongsTo(models.user, {
            foreignKey: {
                allowNull: false
              }
        });
      };

    return Password;
};