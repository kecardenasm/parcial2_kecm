import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSerieDto } from './dto/create-serie.dto';
import { UpdateSerieDto } from './dto/update-serie.dto';
import { Serie } from './entities/serie.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SeriesService {
  constructor(
    @InjectRepository(Serie) private seriesRepository: Repository<Serie>,
  ) {}

  async create(createSerieDto: CreateSerieDto): Promise<Serie> {
    const existe = await this.seriesRepository.findOneBy({
      titulo: createSerieDto.titulo.trim(),
      idPais: createSerieDto.idPais,
    });

    if (existe) throw new ConflictException('La serie ya existe');

    const serie = new Serie();
    serie.idPais = createSerieDto.idPais;
    serie.titulo = createSerieDto.titulo.trim();
    serie.sinopsis = createSerieDto.sinopsis.trim();
    serie.director = createSerieDto.director.trim();
    serie.temporadas = createSerieDto.temporadas;
    serie.fechaEstreno = createSerieDto.fechaEstreno;
    serie.tipoClasificacion = createSerieDto.tipoClasificacion.trim();
    return this.seriesRepository.save(serie);
  }

  async findAll(): Promise<Serie[]> {
    return this.seriesRepository.find({
      relations: { pais: true },
      select: {
        id: true,
        titulo: true,
        sinopsis: true,
        director: true,
        temporadas: true,
        fechaEstreno: true,
        tipoClasificacion: true,
        pais: { id: true, descripcion: true },
      },
      order: { titulo: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Serie> {
    const serie = await this.seriesRepository.findOne({
      where: { id },
      relations: { pais: true },
    });

    if (!serie) throw new NotFoundException('La serie no existe');

    return serie;
  }

  async update(id: number, updateSerieDto: UpdateSerieDto): Promise<Serie> {
    // console.log('UpdateSerieDto recibido:', updateSerieDto);

    // Buscar la serie sin relaciones para evitar conflictos
    const serie = await this.seriesRepository.findOne({
      where: { id },
    });

    if (!serie) throw new NotFoundException('La serie no existe');

    // Crear un objeto limpio con solo los campos a actualizar
    const camposActualizar: Partial<Serie> = {};

    if (updateSerieDto.titulo !== undefined) {
      camposActualizar.titulo = updateSerieDto.titulo.trim();
    }
    if (updateSerieDto.sinopsis !== undefined) {
      camposActualizar.sinopsis = updateSerieDto.sinopsis.trim();
    }
    if (updateSerieDto.director !== undefined) {
      camposActualizar.director = updateSerieDto.director.trim();
    }
    if (updateSerieDto.temporadas !== undefined) {
      camposActualizar.temporadas = updateSerieDto.temporadas;
    }
    if (updateSerieDto.fechaEstreno !== undefined) {
      camposActualizar.fechaEstreno = updateSerieDto.fechaEstreno;
    }
    if (updateSerieDto.tipoClasificacion !== undefined) {
      camposActualizar.tipoClasificacion =
        updateSerieDto.tipoClasificacion.trim();
    }
    if (updateSerieDto.idPais !== undefined) {
      // console.log('Actualizando idPais a:', updateSerieDto.idPais);
      camposActualizar.idPais = updateSerieDto.idPais;
    }

    // console.log('Campos a actualizar:', camposActualizar);

    // Usar update en lugar de save para una actualización más directa
    await this.seriesRepository.update(id, camposActualizar);

    // Retornar la serie actualizada con la relación
    const serieActualizada = await this.seriesRepository.findOne({
      where: { id },
      relations: { pais: true },
    });

    if (!serieActualizada) {
      throw new NotFoundException('Error al recuperar la serie actualizada');
    }

    return serieActualizada;
  }

  // async update(id: number, updateSerieDto: UpdateSerieDto): Promise<Serie> {
  //   const serie = await this.findOne(id);
  //   Object.assign(serie, updateSerieDto);
  //   return this.seriesRepository.save(serie);
  // }

  async remove(id: number) {
    const serie = await this.findOne(id);
    return this.seriesRepository.softRemove(serie);
  }
}
