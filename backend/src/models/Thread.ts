import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Forum } from './Forum';
import { User } from './User';
import { Comment } from './Comment';

@Table({
  tableName: 'threads',
  timestamps: true,
})
export class Thread extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare thread_id: number;

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

  @ForeignKey(() => Forum)
  @Column(DataType.INTEGER)
  declare forum_id?: number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  declare user_id?: number;

  // Associations
  @BelongsTo(() => Forum)
  declare forum: Forum;

  @BelongsTo(() => User)
  declare user: User;

  @HasMany(() => Comment)
  declare comments: Comment[];
}