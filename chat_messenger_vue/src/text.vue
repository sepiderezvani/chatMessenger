    // const props = defineProps(['onlineUserList'])
        // const getChatListWithOnlineUser = () => {
        //     let updatedChatList = chats.value.map((user) => {
        //         if (props.onlineUserList.includes(user.id)) {
        //             user.isOnline = true;
        //         } else {
        //             user.isOnline = false;
        //         }
        //         return user;
        //     });
        //     return updatedChatList;
        // };
        // const onlineUsers = computed(() => {
        //     return chats.value.map((item) => {
        //         if (onlineUser.value.includes(item.id.value)) {
        //             return `${item.id} is online`;
        //         } else {
        //             return `${item.id} is offline`;
        //         }
        //     });
        // });

        // const online = computed(() => {
        //     return chats.value.map((item) => {
        //         if (onlineUser.value.includes(item.id)) {
        //             return `${item.id} is online`;
        //         } else {
        //             return `${item.id} is offline`;
        //         }
        //     });
        // });
        // const chatsWithOnlineStatus = computed(() => {
        //    chats.value.map((chat) => {
        //         if (onlineUser.value.includes(chat.id)){
        //      return onlineUser.value
        //     }
        //    });
        // });

        // const online=computed((user)=>{
        //     if (onlineUser.value){
        //         user.isOnline = true
        //     }else {
        //         user.isOnline = false
        //     }
        // })
        // const online=computed((user)=> {
        //     onlineUser.value.forEach((user) => {
        //         if (onlineUser.value.includes(user.id)) {
        //             return user.isOnline = true
        //         } else {
        //             return user.isOnline = false
        //         }
        //     })
        // })
        // const online = computed(()=>{
        //     onlineUser.value.forEach((userId)=>{
        //         return `${userId} is online`
        //     })
        // })

        // const onlineUsersOf = () => {
        //     onlineUser.value.forEach(user => {
        //         user.online = onlineUser.value.includes(onlineUserId => onlineUserId === user.id);
        //         console.log(user.online , 'ok' )
        //     });
        //
        // };

        // const onlineUsersOf = () => {
        //     onlineUser.value.forEach(user => {
        //         user.online = onlineUser.value.includes(user.id);
        //         console.log(user.online)
        //         if (onlineUser){
        //             user.online = true
        //         }else {
        //             user.online = false
        //         }
        //     });
        // };
// const props = defineProps(['onlineUserList']);
//
// const updatedChatList = computed(() => {
//   return chats.value.map((user) => {
//     if (props.onlineUserList.includes(user.id)) {
//       user.isOnline = true;
//     } else {
//       user.isOnline = false;
//     }
//     return user;
//   });
// });
