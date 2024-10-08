import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Artista } from './artista.entity';

@Entity({ name: 'Show' })
export class Show {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  idArtista: number;

  @Column()
  nome: string;

  @Column()
  localCep: string;

  @Column({ type: 'date', nullable: true })
  dataShow: Date;

  @ManyToOne(() => Artista)
  @JoinColumn({ name: 'idArtista' })
  artista: Artista;
}
