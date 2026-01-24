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

        <!-- Two columns: remove Temperature, keep Target Output full width -->
        <div class="row-2">
          <div class="field">
            <label class="label-text">Target Output</label>
            <input v-model.number="form.target" class="form-input" type="number" min="0" />
          </div>
        </div>

        <!-- Footer buttons (updated to show loading/disable) -->
        <div class="actions">
          <button class="btn-secondary" @click="close" :disabled="loading || toast.visible">Cancel</button>
          <button class="btn-primary" @click="submit" :disabled="loading || toast.visible">
            <span v-if="loading">Adding...</span>
            <span v-else>Add Machine</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- toast popup -->
  <div v-if="toast.visible" class="toast">{{ toast.message }}</div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '../firebase'

const emit = defineEmits(['close', 'added'])

const machineTypes = [
  'CNC Mill',
  'Press',
  'Assembly Line',
  'Welder',
  'Quality Check',
  'Boiler'
]

const statuses = ['Total', 'Running', 'Idle', 'Errors']

const form = reactive({
  name: '',
  type: '',
  status: 'Idle',
  target: 1000
})

const loading = ref(false)

// add toast state for popup
const toast = reactive({ visible: false, message: '' })

function close() {
  emit('close')
}

async function submit() {
  if (!form.name || !form.name.trim()) {
    alert('Add Machine Name')
    return
  }
  if (!form.type) {
    alert('Select type of Machine Type')
    return
  }

  loading.value = true
  try {
    console.debug('Add to Firestore', form)
    const payload = {
      name: form.name,
      type: form.type,
      status: form.status,
      temp: null,
      target: Number(form.target || 0),
      createdAt: new Date().toISOString()
    }
    const docRef = await addDoc(collection(db, 'machines'), payload)
    const created = { id: docRef.id, ...payload }
    console.debug('Created', created)

    // show popup toast first
    toast.message = 'Machine added successfully'
    toast.visible = true

    // keep toast visible for a short period, then emit and close
    await new Promise(resolve => setTimeout(resolve, 1300))

    // emit so parent can update list and then close modal
    emit('added', created)
    toast.visible = false
    emit('close')
  } catch (e) {
    console.error('Add machine failed:', e)
    const errorMessage = e instanceof Error ? e.message : 'network error'
    alert('Failed to add machine: ' + errorMessage)
  } finally {
    loading.value = false
  }
}
</script>

<script lang="ts">
export default { name: 'AddMachine' }
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
  grid-template-columns: 1fr;
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

/* toast popup */
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #ecfdf5;
  color: #065f46;
  border: 1px solid #bbf7d0;
  padding: 10px 14px;
  border-radius: 8px;
  font-weight: 600;
  box-shadow: 0 6px 18px rgba(6,95,70,0.12);
  z-index: 10010;
  transition: opacity 200ms ease;
}
</style>