import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('menu')
export class Menu {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    path: string;

    @Column()
    @Unique(['name'])
    name: string;

    @Column({ default: '' })
    redirect: string;

    @Column()
    meta: string;

    @Column()
    pid: number;

    // 1-可用, 0-不可用
    @Column({ default: 1 })
    active: number;
}
