import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, HasMany } from 'sequelize-typescript';

@Table({
  tableName: 'roles',
  timestamps: true,
})
export class Role extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare role_id: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  declare name: string;

  // Associations will be defined after all models are created
}