import type { Pais } from './pais'

export interface Serie {
  id: number
  idPais: number
  titulo: string
  sinopsis: string
  director: string
  temporadas: number
  fechaEstreno: string | Date
  pais: Pais
  tipoClasificacion: string
}
