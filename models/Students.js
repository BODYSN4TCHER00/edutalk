import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const Students = sequelize.define("Student", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        references: {
            model: "Users",
            key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    }
}, {
    timestamps: false,
    tableName: "students"
});

export default Students;