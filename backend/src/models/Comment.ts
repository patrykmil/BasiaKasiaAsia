import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Thread } from './Thread';
import { User } from './User';

@Table({
  tableName: 'comments',
  timestamps: true,
})
export class Comment extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare comment_id: number;

  @ForeignKey(() => Thread)
  @Column(DataType.INTEGER)
  declare thread_id?: number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  declare user_id?: number;

  @ForeignKey(() => Comment)
  @Column(DataType.INTEGER)
  declare parent_comment_id?: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare content: string;

  // Associations
  @BelongsTo(() => Thread)
  declare thread: Thread;

  @BelongsTo(() => User)
  declare user: User;

  @BelongsTo(() => Comment, { foreignKey: 'parent_comment_id' })
  declare parentComment: Comment;

  @HasMany(() => Comment, { foreignKey: 'parent_comment_id' })
  declare replies: Comment[];
}