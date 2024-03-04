<template>
  <Form @submit.prevent="handleSubmit(onSubmit)" :validation-schema="schema" v-slot="{errors}" class="pa-7"
        style="box-shadow: 1px 2px 5px #333;border-radius: 25px">
    <v-alert
        v-if="success"
        type="success"
        text="Your account has been created successfully. Please login."
        variant="outlined"
    ></v-alert>
    <div class='v-col-12 pa-0 mb-3' style=""><h2 class="mx-auto v-col-3 pa-1" style=""> login</h2></div>
    <Field name="email" as="v-text-field" v-model="login.email" label="Email"
           variant="outlined"
           placeholder="Email"
    />
    <span style="color: red;font-size: .8rem;position:relative;top: -20px">{{ errors['email'] }}</span>
    <Field name="password" as="v-text-field" v-model="login.password" label="password"
           variant="outlined"
           placeholder="Password"
           type="password"
    />
    <span style="color: red;font-size: .8rem;position:relative;top: -20px">{{ errors['password'] }}</span>

    <v-btn type="submit" @click="onSubmit" class="v-btn--block mb-4">submit</v-btn>
    <span class="pa-1">Don't have any account! <router-link
        :to="{name:'signup'}"> Click here </router-link> to singup.</span>
  </Form>
</template>
<script setup>
import {useChatStore} from "@/store/chat-store.js";
import {ref} from "vue";
import {toRefs} from "vue";

const chatStore = useChatStore()
const {login, success} = toRefs(chatStore)
const {send_request_login, send_request_signUp} = chatStore
import {Field, Form, useForm} from "vee-validate";
import * as yup from 'yup'

const schema = yup.object().shape({
  email: yup.string().email('email is invalid').required('email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
})
const {handleSubmit, errors} = useForm({
  validationSchema: schema,
});

function onSubmit() {
  send_request_login()
}
</script>
