import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Role } from './Role';
import { Thread } from './Thread';
import { Comment } from './Comment';

@Table({
  tableName: 'users',
  timestamps: true,
})
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare user_id: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
  })
  declare username: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare password_hash: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare date_of_birth?: Date;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
  })
  declare gender?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare bio?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare is_banned: boolean;

  @ForeignKey(() => Role)
  @Column(DataType.INTEGER)
  declare role_id?: number;

  // Associations
  @BelongsTo(() => Role)
  declare role: Role;

  @HasMany(() => Thread)
  declare threads: Thread[];

  @HasMany(() => Comment)
  declare comments: Comment[];
}