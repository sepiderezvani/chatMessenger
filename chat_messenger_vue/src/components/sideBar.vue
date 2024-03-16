<template>
  <v-container>
      <v-col style="height: 780px;overflow: auto">
        <v-btn class="v-btn--block mb-8">Add people</v-btn>
        <ul>
          <li v-for="chat in chats"  :key="chat.id" style="border-bottom: 1px solid #9999;" class="mb-2">
            <router-link class="user font-weight-bold d-inline-block" style="color: #181818;" :to="{name : 'user' , params : {roomId : chat.roomId}}">
              <div class="d-flex mb-3">
                <img width="40px" height="40px" style="border-radius: 50%;" :src="chat.image" alt="Member Image"/>
                <h3 style="font-size: .8rem;" class="mt-3 pl-2 font-weight-medium">{{ chat.name }}</h3>
                <span v-if="updatedChatList" style="margin-left: 10px; color: green;">{{ onlineUsers }}</span>
              </div>
            </router-link>
          </li>
        </ul>
      </v-col>
    <v-btn class="v-btn--block" style="margin-top: 10px;color: #da2e2e;border:1px solid #da2e2e" @click="logOutUser">log out</v-btn>
  </v-container>
</template>
<script setup>
import {useChatStore} from "@/store/chat-store.js";
import {computed, onMounted, ref, toRefs, watch} from "vue";
const loading = ref(false)
const chatStore = useChatStore()
const {onlineUser} =toRefs(chatStore)
const {chats , messageOfUser,chatMessages,messages ,logOutUser,chatUser,onlineUsersOf , online,chatsWithOnlineStatus,onlineUsers,updatedChatList} =chatStore
onMounted(()=>{
  chatUser()
})
// const getChatListWithOnlineUser = computed(() => {
//   return chats.value.map((user) => {
//     return {
//       id: user.id,
//       message: user.message,
//       isOnline: onlineUser.value.includes(user.id),
//     };
//   });
// });


// const onlineUsers = computed(() => {
//   return onlineUser.value
// });

// watch(onlineUser, () => {
//   onlineUsersOf();
// });
//
// const computedOnlineUsers = computed(() => {
//   return onlineUser.value.filter(user => user.online);
// });
// const getChatListWithOnlineUser = () => {
//   let updatedChatList = onlineUser.value.map((user) => {
//     if (onlineUser.value.includes(user.id)) {
//       user.online = true;
//     } else {
//       user.online = false;
//     }
//   });
//   console.log(updatedChatList)
//
// };

// const isUserOnline = computed(() => {
//   return (userId) => {
//     return onlineUser.value.includes(userId)
//   }
// })
// const onlineUsersOf=()=>{
//   let update = onlineUser.value.map((user)=>{
//     if(onlineUser.includes(user.id)){
//       user.isOnline = true
//     }else{
//       user.isOnline = false
//     }
//     console.log(update , 'update')
//   })
// }
// watch(() => onlineUser, (online) => {
//   onlineUsersOf(online);
// });
// console.log(onlineUsersOf())
// const isUserOnline = (userId) => {
//   return onlineUser.value.includes(userId);
// };

// Update the `isOnline` property of each chat object based on online status
// const offline=computed(()=>{
//   chats.value.forEach((chat) => {
//     chat.isOnline = isUserOnline(chat.id);
//   });
// })

// watch(onlineUser, () => {
//   onlineUsersOf();
// });
// const props = defineProps(['onlineUser'])
</script>
<style>
ul,li{
  list-style-type: none;
}
.user:hover{
  background-color: transparent;
}
</style>
