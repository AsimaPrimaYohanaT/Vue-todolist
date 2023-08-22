<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import BaseInput from '@/components/BaseInput.vue'

const router = useRouter()
const auth = d$auth()

const initialInput = {
  username: '',
  email:'',
  password: ''
}

const input = ref({ ...initialInput })

const resetForm = () => Object.assign(input.value, initialInput)

const submitForm = async () => {
  try {
    await auth.login(input.value)

    auth.setUser()

    resetForm()

    router.replace({
      name: 'Authenticated',
      params: { id: auth.g$user.id }
    })
  } catch (error) {
    console.log(error)
    alert(error)
  }
}
</script>

<template>
  <div>
    <h1>Register</h1>

    <!-- conditional rendering using v-if directive -->
    <form
      v-if="!auth.getUsername"
      method="post"
      @submit.prevent="() => submitForm()"
      @reset="() => resetForm()"
    >
      <base-input
        name="username"
        v-model="input.username"
        placeholder="input username"
        required
      />
      <base-input
        name="email"
        v-model="input.email"
        placeholder="input email"
        required
      />
      <base-input
        name="password"
        v-model="input.password"
        placeholder="input password"
        type="password"
        required
      />
      <button type="submit">Register</button>
    </form>

    <h3 v-else>{{ auth.getUsername }}</h3>
  </div>
</template>