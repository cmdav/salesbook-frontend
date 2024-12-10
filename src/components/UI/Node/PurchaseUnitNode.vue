<template>
  <div class="purchase-unit-node" :class="{ 'has-children': unit.sub_purchase_units.length > 0 }">
    <div class="unit-content">
      <div class="unit-header">
        <div class="unit-info">
          <h4 class="unit-name capitalize">{{ unit.purchase_unit_name }}</h4>
          <span v-if="unit.unit > 0" class="unit-ratio">
            {{ unit.unit }} units
          </span>
        </div>
        <div class="unit-actions">
          <button
          v-if="unit.sub_purchase_units.length === 0"
            class="action-button"
            @click="handleAddSubUnit"
            title="Add Sub-Unit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          </button>
          <button
            class="action-button edit"
            @click="handleEditUnit"
            title="Edit Unit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
              />
            </svg>
          </button>
          <button
            class="action-button delete"
            @click="handleDeleteUnit"
            title="Delete Unit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div v-if="unit.sub_purchase_units.length > 0" class="sub-units">
      <div v-for="subUnit in unit.sub_purchase_units" :key="subUnit.id" class="sub-unit-branch">
        <div class="branch-line"></div>
        <PurchaseUnitNode
          :unit="subUnit"
          :groupId="groupId"
          @add-sub-unit="handleSubUnitAdd"
          @edit-unit="handleSubUnitEdit"
          @delete-unit="$emit('delete-unit', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  unit: {
    type: Object,
    required: true
  },
  groupId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['add-sub-unit', 'edit-unit', 'delete-unit'])

// Handler for adding a sub-unit to the current unit
const handleAddSubUnit = () => {
  emit('add-sub-unit', props.groupId, props.unit.id)
}

// Handler for editing the current unit
const handleEditUnit = () => {
  emit('edit-unit', props.groupId, props.unit)
}

// Handler for deleting the current unit
const handleDeleteUnit = () => {
  emit('delete-unit', props.unit.id)
}

// Handler for adding a sub-unit to a child unit
const handleSubUnitAdd = (groupId, subUnitId) => {
  emit('add-sub-unit', groupId, subUnitId)
}

// Handler for editing a child unit
const handleSubUnitEdit = (groupId, unit) => {
  emit('edit-unit', groupId, unit)
}
</script>

<style scoped>
.purchase-unit-node {
  position: relative;
  padding-left: 1.5rem;
}

.unit-content {
  background-color: white;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #c35214;
}

.unit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.unit-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.unit-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a202c;
}

.unit-ratio {
  font-size: 0.9rem;
  color: #718096;
  background-color: #f7fafc;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
}

.unit-actions {
  display: flex;
  gap: 0.5rem;
}

.action-button {
  padding: 0.25rem;
  border-radius: 0.25rem;
  color: #4a5568;
  background-color: transparent;
  transition: all 0.2s;
}

.action-button:hover {
  background-color: #edf2f7;
}

.action-button.edit:hover {
  color: #c35214;
}

.action-button.delete:hover {
  color: #e53e3e;
}

.sub-units {
  position: relative;
  margin-left: 1rem;
}

.sub-unit-branch {
  position: relative;
}

.branch-line {
  position: absolute;
  left: -1.5rem;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #e2e8f0;
}

.sub-unit-branch:last-child .branch-line {
  height: 1.5rem;
}

.sub-unit-branch::before {
  content: '';
  position: absolute;
  left: -1.5rem;
  top: 1.5rem;
  width: 1rem;
  height: 2px;
  background-color: #e2e8f0;
}

.has-children::after {
  content: '';
  position: absolute;
  left: 0;
  top: 4rem;
  bottom: 0;
  width: 2px;
  background-color: #e2e8f0;
}
</style>