import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity({ name: 'Cliente' })
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  sobrenome: string;

  @Column()
  email: string;

  @Column()
  telefone: string;

  @Column()
  senha: string;

  @Column()
  cpf: string;

  @Column()
  cep: string;

  @Column({ type: 'date', nullable: true })
  dataNascimento: Date;

}
