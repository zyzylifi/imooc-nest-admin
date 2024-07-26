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
    roles: string;
    @Column()
    realName: string;
    @Column()
    active: number;
}
