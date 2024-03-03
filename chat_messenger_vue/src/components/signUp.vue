<template>
  <v-container class="v-col-12" style="width: 1200px">
    <v-sheet width="380" class="mx-auto">
      <Form @submit.prevent="handleSubmit(onSubmit)" :validation-schema="schema" v-slot="{errors}" class="pa-8" style="box-shadow: 1px 2px 5px #333;border-radius: 25px">
        <div class='v-col-12 pa-0' style=""><h2 class="mx-auto v-col-4 pa-1 mb-3" style="">sign Up</h2></div>
        <div>
          <Field name="firstName" as="v-text-field" v-model="signUp.firstName" label="First Name"
                 variant="outlined"
                 placeholder="First name"
          />
          <span class="pa-0" style="color: red;font-size: .8rem;position:relative;top: -20px;">{{
              errors['firstName']
            }}</span>
        </div>

        <Field name="lastName" as="v-text-field" v-model="signUp.lastName" label="last Name"
               variant="outlined"
               placeholder="last name"
        />
        <span style="color: red;font-size: .8rem;position:relative;top: -20px">{{ errors['lastName'] }}</span>

        <Field name="Email" as="v-text-field" v-model="signUp.Email" label="Email"
               variant="outlined"
               placeholder="Email"
        />
        <span style="color: red;font-size: .8rem;position:relative;top: -20px">{{ errors['Email'] }}</span>

        <v-file-input
            clearable
            label="File input"
            variant="outlined"
            @change="fileInputChange"
        ></v-file-input>
        <span></span>
        <Field name="password" as="v-text-field" v-model="signUp.password" label="password"
               variant="outlined"
               placeholder="Password"
               type="password"
        />
        <span style="color: red;font-size: .8rem;position:relative;top: -20px">{{ errors['password'] }}</span>

        <Field name="confirm_password" as="v-text-field" v-model="signUp.confirm_password" label="confirm_password"
               variant="outlined"
               placeholder="confirm_password"
               type="password"
        />
        <span style="color: red;font-size: .8rem;position:relative;top: -20px">{{ errors['confirm_password'] }}</span>

        <v-btn type="submit" class="v-btn--block mb-4" @click="onSubmit"> submit</v-btn>
        <span class="">Already have an account. <router-link to="/login">Click here</router-link> to login.</span>
      </Form>
    </v-sheet>
  </v-container>
</template>
<script setup>
import {useChatStore} from "@/store/chat-store.js";
import {toRefs} from "vue";
const chatStore = useChatStore()
const {signUp} =toRefs(chatStore)
const{fileInputChange,send_request_signUp}=chatStore

import {Form ,Field, useForm} from "vee-validate";
import * as yup from 'yup'

const schema = yup.object().shape({
  firstName : yup.string().required('first Name is required'),
  lastName :  yup.string().required('last Name is required'),
  Email :  yup.string().email('email is invalid').required('email is required'),
  image :yup.string().required('file is required'),
  password :  yup.string().min(6,'Password must be at least 6 characters').required('Password is required'),
  confirm_password :yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').min(6).required('Confirm Password is required'),
})
const { handleSubmit, errors } = useForm({
  validationSchema: schema,
});
function onSubmit (){
  send_request_signUp()
}
</script>
