import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('auth')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Unique(['key'])
  key: string;

  @Column()
  name: string;

  @Column()
  remark: string;
}
