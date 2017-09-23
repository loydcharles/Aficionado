module.exports = function(sequelize, Sequelize) {
    var User = sequelize.define("user", {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                len: [3, 15],
                is: /\b[a-z]/i
            }
        }
    });

    User.associate = function(models) {
        // We're saying that a User should belong to an Author
        // A User can't be created without an Author due to the foreign key constraint
        User.hasOne(models.password, {
        });
      };    

    return User;
};