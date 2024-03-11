<template>
  <v-container>
      <v-col style="">
        <v-btn class="v-btn--block mb-8">Add people</v-btn>
        <ul>
          <li v-for="chat in chats" :key="chat.id" style="border-bottom: 1px solid #9999;" class="mb-2">
            <router-link class="user font-weight-bold d-inline-block" style="color: #181818;" :to="{name : 'user' , params : {roomId : chat.roomId}}">
              <div class="d-flex mb-3">
                <img width="45px" height="45px" style="border-radius: 50%;" :src="chat.image" alt="Member Image"/>
                <h3 style="font-size: .9rem;" class="mt-3 pl-2 font-weight-medium">{{ chat.name }}</h3>
              </div>
            </router-link>
          </li>
        </ul>
      </v-col>
    <v-btn class="v-btn--block" style="margin-top: 50px;color: #da2e2e;border:1px solid #da2e2e" @click="logOutUser">log out</v-btn>
  </v-container>

</template>
<script setup>
import {useChatStore} from "@/store/chat-store.js";
import {onMounted, ref, toRefs, watch} from "vue";
const loading = ref(false)
const chatStore = useChatStore()
const {chats , messageOfUser,chatMessages,messages ,logOutUser} =chatStore
onMounted(()=>{
  messageOfUser()
})
</script>
<style>
ul,li{
  list-style-type: none;
}
.user:hover{
  background-color: transparent;
}
</style>
