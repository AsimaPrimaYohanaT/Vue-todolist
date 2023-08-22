<script setup>
import { ref } from 'vue'
import { useListStore } from '@/stores/lists'
import BaseInput from '@/components/BaseInput.vue'

const store = useListStore()

const defaultInput = {
  name: '',
  hobby: '',
  description: '',
  completed: false
}


const input = ref({ ...defaultInput })
const editing = ref(false)

const resetForm = () => {
  Object.assign(input.value, defaultInput)

  editing.value = false
}

function onSubmit() {
  const data = { ...input.value }

  if (editing.value === false) {
    store.addList(data)
  } else {
    store.editList(editing.value, data)
  }

  resetForm()
}

function detailList(index) {
  const detail = store.getDetail(index)

  input.value = { ...detail.value }

  editing.value = index
}
function toggleComplete(index) {
  const detail = store.getDetail(index)

  store.editList(index, {
    ...detail.value,
    completed: !detail.value.completed
  })
}
</script>

<template>
  <div class="container">
    <h1>Todo List {{ $route.params?.id }}</h1>

    <form class="form" @submit.prevent="onSubmit" @reset="resetForm">
      <BaseInput v-model="input.name" name="name" placeholder="John" required />
      <BaseInput v-model="input.hobby" name="hobby" placeholder="Gaming" required />
      <BaseInput v-model="input.description" name="description" placeholder="Everyday" />
      <div class="checkbox">
        <input type="checkbox" v-model="input.completed" name="completed"> Completed
      </div>
      <button type="reset">Cancel</button>
      <button type="submit">{{ editing !== false ? 'Save' : 'Submit' }}</button>
    </form>

    <h4>Tasks</h4>
    <ol class="list">
      <template v-for="(item, index) in store.getList" :key="index">
        <li :class="{ strike: item?.completed }" @dblclick="toggleComplete(index)">
          <button class="red" @click="() => store.removeList(index)" :disabled="editing !== false">&times;</button>
          <button class="orange" @click="() => detailList(index)" :disabled="editing !== false">&#9998;</button>
          {{ item?.name }} ({{ item?.hobby }}) -
          {{ !!item?.description ? item.description : 'description?' }}
        </li>
      </template>
    </ol>
  </div>
</template>

<style scoped lang="scss">
.form {
  margin-block-end: 2rem;
}
.list {
  padding-block: 1rem;

  & > .strike {
    text-decoration: line-through;
  }
}

.checkbox {
  width: 100%;
}

button {
  .red {
    color: red;
  }
  .orange {
    color: orange;
  }
}
</style>