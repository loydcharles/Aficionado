module.exports = function(sequelize, Sequelize) {
    var User = sequelize.define("user", {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                len: [1, 11],
                is: /\b[a-z]/i
            }
        }
    });
    return User;
};