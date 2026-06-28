const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME || 'admin_reportes_db',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'postgres',
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: false,
    }
);

const AuditLogModel = sequelize.define('AuditLog', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
    },
    adminId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    targetId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    details: {
        type: DataTypes.JSONB,
        allowNull: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
}, {
    tableName: 'audit_logs',
    timestamps: false
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Postgres connected via Sequelize');
        await sequelize.sync(); // Auto create tables for now
        console.log('Database synced');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

module.exports = {
    sequelize,
    AuditLogModel,
    connectDB
};
