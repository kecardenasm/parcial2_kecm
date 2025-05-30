<script setup lang="ts">
import type { Pais } from '@/models/pais'
import type { Serie } from '@/models/serie'
import http from '@/plugins/axios'
import { InputMask, Select } from 'primevue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import { computed, ref, watch } from 'vue'
import InputNumber from 'primevue/inputnumber'

const ENDPOINT = 'series'
const props = defineProps({
  mostrar: Boolean,
  serie: {
    type: Object as () => Serie,
    default: () => ({}) as Serie,
  },
  modoEdicion: Boolean,
})
const emit = defineEmits(['guardar', 'close'])

const paises = ref<Pais[]>([])

const dialogVisible = computed({
  get: () => props.mostrar,
  set: (value) => {
    if (!value) emit('close')
  },
})

const tiposClasificacion = ref([
  { label: 'A', value: 'A' },
  { label: 'B', value: 'B' },
  { label: 'B15', value: 'B15' },
  { label: 'X', value: 'X' },
])

// const pais = ref<Pais>({} as Pais)
const serie = ref<Serie>({ ...props.serie })

async function obtenerPaises() {
  paises.value = await http.get('paises').then((response) => response.data)
}

async function handleSave() {
  try {
    // Convertir fecha a formato "yyyy-MM-dd"
    let fecha: string | undefined
    if (serie.value.fechaEstreno) {
      if (typeof serie.value.fechaEstreno === 'string') {
        // Es string, verificar si está en formato dd/MM/yyyy
        if (serie.value.fechaEstreno.includes('/')) {
          const [dia, mes, anio] = serie.value.fechaEstreno.split('/')
          fecha = `${anio}-${mes}-${dia}`
        } else {
          fecha = serie.value.fechaEstreno // Ya está en formato correcto
        }
      } else {
        // Es Date, convertir a string
        fecha = serie.value.fechaEstreno.toISOString().split('T')[0]
      }
    }
    const body = {
      idPais: serie.value.idPais,
      titulo: serie.value.titulo,
      sinopsis: serie.value.sinopsis,
      director: serie.value.director,
      temporadas: serie.value.temporadas,
      fechaEstreno: fecha,
      tipoClasificacion: serie.value.tipoClasificacion,
    }
    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${serie.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }
    emit('guardar')
    serie.value = {} as Serie
    dialogVisible.value = false
  } catch (error: any) {
    alert(error?.response?.data?.message)
  }
}

watch(
  () => props.mostrar,
  (nuevoValor) => {
    if (nuevoValor) {
      obtenerPaises()
      if (props.serie?.id) {
        // Copia los datos y convierte la fecha si es necesario
        let fecha = props.serie.fechaEstreno

        // Verificar que sea string antes de usar métodos de string
        if (fecha && typeof fecha === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
          // yyyy-MM-dd -> dd/MM/yyyy
          const [anio, mes, dia] = fecha.split('-')
          fecha = `${dia}/${mes}/${anio}`
        } else if (fecha instanceof Date) {
          // Si es Date, convertir a dd/MM/yyyy
          const dia = fecha.getDate().toString().padStart(2, '0')
          const mes = (fecha.getMonth() + 1).toString().padStart(2, '0')
          const anio = fecha.getFullYear()
          fecha = `${dia}/${mes}/${anio}`
        }

        serie.value = { ...props.serie, idPais: props.serie.pais?.id, fechaEstreno: fecha }
      } else {
        serie.value = {} as Serie
      }
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="card flex justify-center">
    <Dialog
      v-model:visible="dialogVisible"
      :header="(props.modoEdicion ? 'Editar' : 'Crear') + ' Serie'"
      style="width: 25rem"
    >
      <div class="flex items-center gap-4 mb-4">
        <label for="pais" class="font-semibold w-3">Pais</label>
        <Select
          id="pais"
          v-model="serie.idPais"
          :options="paises"
          optionLabel="descripcion"
          optionValue="id"
          class="flex-auto"
          autofocus
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="titulo" class="font-semibold w-3">Título</label>
        <InputText
          id="titulo"
          v-model="serie.titulo"
          class="flex-auto"
          autocomplete="off"
          maxlength="40"
          autofocus
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="sinopsis" class="font-semibold w-3">Sinopsis</label>
        <InputText
          id="sinopsis"
          v-model="serie.sinopsis"
          class="flex-auto"
          autocomplete="off"
          maxlength="250"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="director" class="font-semibold w-3">Director</label>
        <InputText
          id="director"
          v-model="serie.director"
          class="flex-auto"
          autocomplete="off"
          maxlength="40"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="temporadas" class="font-semibold w-3">Temporadas</label>
        <InputNumber
          id="temporadas"
          v-model="serie.temporadas"
          mode="decimal"
          :useGrouping="false"
          class="flex-auto"
          autocomplete="off"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="fechaEstreno" class="font-semibold w-3">Fecha de Estreno</label>
        <InputMask
          id="fechaEstreno"
          v-model="serie.fechaEstreno as string"
          mask="99/99/9999"
          class="flex-auto"
          autocomplete="off"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="tipoClasificacion" class="font-semibold w-3">Tipo de Clasificación</label>
        <Select
          id="tipoClasificacion"
          v-model="serie.tipoClasificacion"
          :options="tiposClasificacion"
          optionLabel="label"
          optionValue="value"
          placeholder="Seleccione una clasificación"
          class="flex-auto"
        />
      </div>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancelar"
          icon="pi pi-times"
          severity="secondary"
          @click="dialogVisible = false"
        ></Button>
        <Button type="button" label="Guardar" icon="pi pi-save" @click="handleSave"></Button>
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>
