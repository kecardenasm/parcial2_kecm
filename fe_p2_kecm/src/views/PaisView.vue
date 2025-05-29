<script setup lang="ts">
import PaisList from '@/components/pais/PaisList.vue'
import PaisSave from '@/components/pais/PaisSave.vue'
import Button from 'primevue/button'
import { ref } from 'vue'

const mostrarDialog = ref(false)
const paisListRef = ref<typeof PaisList | null>(null)
const paisEdit = ref<any>(null)

function handleCreate() {
  paisEdit.value = null
  mostrarDialog.value = true
}

function handleEdit(pais: any) {
  paisEdit.value = pais
  mostrarDialog.value = true
}

function handleCloseDialog() {
  mostrarDialog.value = false
}

function handleGuardar() {
  paisListRef.value?.obtenerLista()
}
</script>

<template>
  <div>
    <h2>Paises</h2>
    <Button label="Crear Nuevo" icon="pi pi-plus" @click="handleCreate" />
    <PaisList ref="paisListRef" @edit="handleEdit" />
    <PaisSave
      :mostrar="mostrarDialog"
      :pais="paisEdit"
      :modoEdicion="!!paisEdit"
      @guardar="handleGuardar"
      @close="handleCloseDialog"
    />
  </div>
</template>

<style scoped></style>
