import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const Students = sequelize.define("Student", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
});