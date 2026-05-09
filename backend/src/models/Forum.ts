import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Thread } from './Thread';
import { User } from './User';

@Table({
  tableName: 'forums',
  timestamps: true,
})
export class Forum extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare forum_id: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description?: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'created_by'
  })
  declare created_by: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'created_at'
  })
  declare created_at: Date;

  @BelongsTo(() => User, 'created_by')
  declare creator: User;

  @HasMany(() => Thread)
  declare threads: Thread[];
}