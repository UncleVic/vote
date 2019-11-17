import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  name: string;

  @Column('int')
  votes: number;
}
