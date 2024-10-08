import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'Artista' })
export class Artista {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;
}
