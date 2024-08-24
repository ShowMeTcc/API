import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity({ name: 'Empresa' })
export class Empresa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cnpj: string;

  @Column()
  nome: string;

  @Column()
  email: string;

  @Column()
  telefone: string;

  @Column()
  senha: string;

}