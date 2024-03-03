<template>
  <v-container>
    <v-row style="border: 2px solid blue;height: 800px;width: 800px;position:relative;" ref="chatWindow">
      <v-col class="messages v-col-12" style="border: 1px solid green;position:absolute;overflow: auto;width: 100%;height: 100%" id="">
        <div v-for="(m , idx) in messages" :key="'m-' + idx"style="clear: both" id="chatContainer">
<div style="background-color: darkseagreen;display: inline" :class="{'msg-from-me' :m.from='me' , 'msg-from-other' : m.from ='other'}">
{{m.message}}
</div>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <input class="v-col-8" type="text" @keyup="chatMessageTypingHandler" v-model="new_message" @keyup.enter="sendMessage"/>
      <button @click="sendMessage">send</button>
    </v-row>
  </v-container>
</template>
<script setup>

import {useChatStore} from "@/store/chat-store.js";
const chatStore = useChatStore()
import {onMounted, onUnmounted, toRefs} from "vue";
const {initWebSocket , sendMessage,chatMessageTypingHandler,getActiveChatId , chatUser,fetchMessage} = chatStore
const {messages , new_message , socket , userId} = toRefs(chatStore)
onMounted(()=>{
 initWebSocket()
 chatUser()
})

</script>
<style>

</style>
