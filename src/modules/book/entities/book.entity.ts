import { Entity, Column, Unique, PrimaryGeneratedColumn } from 'typeorm';

@Entity('book')
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Unique(['fileName'])
  fileName: string;

  @Column()
  cover: string;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  publisher: string;

  @Column()
  bookId: string;

  @Column()
  category: number;

  @Column()
  categoryText: string;

  @Column()
  language: string;

  @Column()
  rootFile: string;
}
