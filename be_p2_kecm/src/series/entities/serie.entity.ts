import { Pais } from 'src/paises/entities/pais.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('series')
export class Serie {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('integer', { name: 'id_pais' })
  idPais: number;

  @Column('varchar', { length: 250 })
  titulo: string;

  @Column('varchar', { length: 5000 })
  sinopsis: string;

  @Column('varchar', { length: 100 })
  director: string;

  @Column('integer')
  temporadas: number;

  @Column('date', { name: 'fecha_estreno' })
  fechaEstreno: Date;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @ManyToOne(() => Pais)
  @JoinColumn({ name: 'id_pais' })
  pais: Pais;
}
