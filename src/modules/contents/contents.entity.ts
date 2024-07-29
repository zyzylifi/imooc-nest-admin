import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('contents')
export class Contents {
  @PrimaryColumn()
  fileName: string;

  @Column()
  id: string;

  @Column()
  href: string;

  @Column()
  order: number;

  @Column()
  level: number;

  @Column()
  text: string;

  @Column()
  label: string;

  @Column()
  pid: string;

  @PrimaryColumn()
  @Column()
  navId: string;
}
