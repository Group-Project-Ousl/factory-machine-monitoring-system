<template>
  <!-- Overlay -->
  <div class="modal-overlay" @click.self="close">
    <!-- Modal -->
    <div class="modal-box machine-card">
      <div class="modal-head">
        <h2 class="modal-title">Add New Machine</h2>
        <button class="x-btn" @click="close" aria-label="Close">✕</button>
      </div>

      <div class="form">
        <!-- Machine Name -->
        <div class="field">
          <label class="label-text">Machine Name</label>
          <input
            v-model="form.name"
            class="form-input"
            type="text"
            placeholder="e.g., Machine 9"
          />
        </div>

        <!-- Machine Type -->
        <div class="field">
          <label class="label-text">Machine Type</label>
          <select v-model="form.type" class="form-input">
            <option disabled value="">Select machine type</option>
            <option v-for="t in machineTypes" :key="t" :value="t">{{ t }}</option>
          </select>
        </div>

        <!-- Initial Status -->
        <div class="field">
          <label class="label-text">Initial Status</label>
          <select v-model="form.status" class="form-input">
            <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
          </select>
        </div>

        <!-- Two columns like sample -->
        <div class="row-2">
          <div class="field">
            <label class="label-text">Temperature (°C)</label>
            <input v-model.number="form.temp" class="form-input" type="number" min="0" />
          </div>

          <div class="field">
            <label class="label-text">Target Output</label>
            <input v-model.number="form.target" class="form-input" type="number" min="0" />
          </div>
        </div>

        <!-- Footer buttons -->
        <div class="actions">
          <button class="btn-secondary" @click="close">Cancel</button>
          <button class="btn-primary" @click="submit">Add Machine</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const emit = defineEmits(['close', 'added'])

const machineTypes = [
  'CNC Mill',
  'Press',
  'Assembly Line',
  'Welder',
  'Quality Check',          
  'Boiler'
]

//statuses you said
const statuses = ['Total', 'Running', 'Idle', 'Errors']

const form = reactive({
  name: '',
  type: '',
  status: 'Idle',
  temp: 25,
  target: 1000
})

function close() {
  emit('close')
}

function submit() {
  if (!form.name.trim()) {
    alert(' Add Machine Name ')
    return
  }
  if (!form.type) {
    alert('Selecr type of Machine Type')
    return
  }

  //send data back to dashboard
  emit('added', { ...form })
  emit('close')
}
</script>

<style scoped>
/* Uses your main.css modal-overlay + modal-content idea, but we keep scoped for layout */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(2px);
  display: grid;
  place-items: center;
  z-index: 9999;
  padding: 18px;
}

.modal-box {
  width: 780px;
  max-width: 95vw;
  border-radius: 16px;
  padding: 22px 22px 18px;
  background: #fff;
}

/* header */
.modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.modal-title {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 800;
  color: #0f1724;
}

.x-btn {
  border: none;
  background: transparent;
  font-size: 20px;
  cursor: pointer;
  color: #64748b;
  padding: 6px 10px;
  border-radius: 10px;
}
.x-btn:hover {
  background: #f1f5f9;
}

.field { margin-top: 14px; }

.row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-top: 6px;
}

@media (max-width: 700px) {
  .row-2 { grid-template-columns: 1fr; }
}

.actions {
  margin-top: 18px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
/* FIX: stop inputs going out of modal */
.modal-box,
.modal-box * {
  box-sizing: border-box;
}

/* extra safety */
.form-input {
  width: 100%;
  max-width: 100%;
}
</style>