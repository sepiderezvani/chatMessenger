<template>
  <v-container-fluid>
    <v-col class="d-inline-flex pb-0 pt-0 mb-0 mt-0" style="border-bottom:1px solid #9999">
      <img class="mr-6 mb-3" width="50" height="50" style="border-radius: 50%" src="../wp6390510.png" alt="">
      <p class="mr-10 mt-3">sepideh rezvani</p>
    </v-col>
    <v-row style="" class="mt-1 ml-1">
      <v-col class="messages flex-wrap-reverse" ref="messagesContainer" style="overflow: auto;height: 635px">
        <div class="d-flex" v-for="(m , idx) in reversChatMessage"  :key="idx - 1" style='' id="chatContainer" :class="getChatMessageClassName(m.user)">
          <div class="d-block flex-column" >
            <img width="50px" height="50px" style="border-radius: 50%;padding: 2px;" class="mt-1 float-right" :src="m.image"/>
            <span class="d-block" style="padding: 2px;margin-top: -5px;">{{ getTimeFromDate(m.time) }}</span>
          </div>
<p class="ml-3" style="background-color: #b8ccb8;display: inline-block;padding: 12px;border-radius: 20px;margin-bottom: 40px;">
  <span class="d-block font-weight-bold">{{m.userName}}</span>
{{m.message}}
</p>
        </div>
      </v-col>
    </v-row>

      <div class="v-col-12 d-inline-flex">
      <v-text-field class="v-col-11 mt-6 pl-0" type="text" variant="outlined" @keyup="chatMessageTypingHandler" v-model="new_message" @keyup.enter="sendMessage" placeholder="enter your message"></v-text-field>
      <v-btn class="v-col-1 mt-10 align-content-center pa-6" @click="sendMessage" variant="outlined">send</v-btn>
      </div>
  </v-container-fluid>
</template>
<script setup>

import {useChatStore} from "@/store/chat-store.js";
import {useRoute} from 'vue-router'
const route = useRoute()
const chatStore = useChatStore()
import {onMounted, toRefs , watch , ref , nextTick} from "vue";
const {initWebSocket , sendMessage,chatMessageTypingHandler , getTimeFromDate, chatUser, messageOfUser,getChatMessageClassName} = chatStore
const { new_message , socket , userId ,chatMessages ,reversChatMessage } = toRefs(chatStore)

const messagesContainer = ref(null)
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};
onMounted(()=>{
 initWebSocket()
 chatUser()
  messageOfUser(route.params.roomId)
  scrollToBottom()
})
watch(() => route.params.roomId, (newRoomId) => {
  messageOfUser(newRoomId);
});
watch(() => new_message, (lastMsg) => {
  messageOfUser(lastMsg);
});
watch(chatMessages, (newVal, oldVal) => {
  if (newVal.length > oldVal.length) {
    scrollToBottom()
  }
}, { deep: true });
watch(new_message, () => {
  scrollToBottom();
});
</script>
<style>

</style>
