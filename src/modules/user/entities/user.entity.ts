import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
@Entity('admin_user')
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    avatar: string;
    @Column()
    @Unique(['username'])
    username: string;
    @Column()
    password: string;
    @Column()
    role: string;
    @Column()
    nickname: string;
    @Column()
    active: number;
}
