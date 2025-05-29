import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePaisDto } from './dto/create-pais.dto';
import { UpdatePaisDto } from './dto/update-pais.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pais } from './entities/pais.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PaisesService {
  constructor(
    @InjectRepository(Pais) private paisesRepository: Repository<Pais>,
  ) {}

  async create(createPaisDto: CreatePaisDto): Promise<Pais> {
    const existe = await this.paisesRepository.findOneBy({
      descripcion: createPaisDto.descripcion.trim(),
    });

    if (existe) throw new ConflictException('El pais ya existe');

    const pais = new Pais();
    pais.descripcion = createPaisDto.descripcion.trim();
    return this.paisesRepository.save(pais);
  }

  async findAll() {
    return this.paisesRepository.find({ order: { descripcion: 'ASC' } });
  }

  async findOne(id: number): Promise<Pais> {
    const pais = await this.paisesRepository.findOneBy({ id });
    if (!pais) throw new NotFoundException('El pais no existe');
    return pais;
  }

  async update(id: number, updateArtistaDto: UpdatePaisDto) {
    const pais = await this.findOne(id);
    const artistaUpdate = Object.assign(pais, updateArtistaDto);
    return this.paisesRepository.save(artistaUpdate);
  }

  async remove(id: number) {
    const pais = await this.findOne(id);
    if (pais) return this.paisesRepository.softRemove(pais);
  }
}
