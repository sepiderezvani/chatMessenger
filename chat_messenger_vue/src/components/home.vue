<template>
  <v-container class="v-col-12" style="box-shadow: 1px 2px 5px #2c3e50;width: 100vw;overflow: hidden">
  <v-layout>
   <v-col class="v-col-xl-2 v-col-sm-2 v-col-md-2" style="border: 1px solid #9999 ">
     <side-bar/>
   </v-col>
    <v-col class="v-col-xl-10 v-col-sm-10 v-col-md-10" style=";border: 1px solid #9999">
      <chat-body/>
    </v-col>
  </v-layout>
  </v-container>
</template>
<script setup>
import ChatBody from '@/components/chatBody.vue'
import SideBar from '@/components/sideBar.vue'
import {useChatStore} from "@/store/chat-store.js";
import {toRefs} from "vue";
const chatStore = useChatStore()
const {chatMessages}=toRefs(chatStore)
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#app{
  margin: 0;
  padding: 0;
}
html{
  overflow: hidden;
}
</style>
