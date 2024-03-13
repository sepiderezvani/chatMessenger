<template>
  <v-container-fluid>
    <div v-if="profileOfUserId">
      <v-col class="d-inline-flex pb-0 pt-0 mb-0 mt-0"
             style="border-bottom:1px solid #9999">
        <img class="mr-6 mb-3" width="50" height="50" style="border-radius: 50%" :src="profileOfUserId.image" alt="">
        <p class="mr-10 mt-3">{{ profileOfUserId.username }}</p>
      </v-col>
    </div>
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
        <div class="ml-5" v-if="typingUsersMessage">
          <div class="typing">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
          </div>
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
import {onMounted, toRefs, watch, ref, nextTick, computed} from "vue";
const {initWebSocket , sendMessage,chatMessageTypingHandler , getTimeFromDate, chatUser, messageOfUser,getChatMessageClassName,scrollToBottom ,getUserId,getActiveChatId } = chatStore
const { new_message , socket , userId ,chatMessages ,reversChatMessage,isUserTyping , typingUserName , usersTyping,chats,profileOfUserId } = toRefs(chatStore)

onMounted(()=>{
 initWebSocket()
  messageOfUser(route.params.roomId)
  scrollToBottom()
  handleTypingUsersChange()
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
const roomActive = getActiveChatId(route)
const myUserId = getUserId(); // Replace this with your actual user ID
const typingUsersMessage = computed(() => {
  // Filter out your own user ID
  const otherTypingUsers = usersTyping.value.filter(userId => userId !== myUserId);

  if (otherTypingUsers.length === 0) {
    return ''; // No one else is typing
  } else if (otherTypingUsers.length === 1) {
    return `${otherTypingUsers[0]} is typing...`; // One other user typing
  } else {
    return 'Several people are typing...'; // Multiple other users typing
  }
});
const handleTypingUsersChange = () => {
  console.log('Typing users:', usersTyping.value);
  // Add any other logic you need to handle the change
};

// Set up the watcher
watch(usersTyping, () => {
  handleTypingUsersChange();
}, { deep: true });

</script>
<style scoped>
.typing {
  align-items: center;
  display: flex;
  height: 17px;
}
.typing .dot {
  animation: mercuryTypingAnimation 1s infinite ease-in-out;
  background-color: #fff0c0;
  border-radius: 50%;
  height: 7px;
  margin-right: 4px;
  vertical-align: middle;
  width: 7px;
  display: inline-block;
}
.typing .dot:nth-child(1) {
  animation-delay: 200ms;
}
.typing .dot:nth-child(2) {
  animation-delay: 300ms;
}
.typing .dot:nth-child(3) {
  animation-delay: 400ms;
}
.typing .dot:last-child {
  margin-right: 0;
}

@keyframes mercuryTypingAnimation {
  0% {
    transform: translateY(0px);
    background-color: #134157;
  }
  28% {
    transform: translateY(-7px);
    background-color: #1e688a;
  }
  44% {
    transform: translateY(0px);
    background-color: #3793c4;
  }
}

</style>
