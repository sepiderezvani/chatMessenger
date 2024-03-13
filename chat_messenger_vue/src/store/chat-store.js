import {defineStore} from "pinia";
import axios from "axios";
import {computed, nextTick, onMounted,ref} from "vue";
import router from "@/router/index.js";
import {jwtDecode} from "jwt-decode";
import {useRoute} from "vue-router";
import {watch} from "vue";

export const useChatStore = defineStore('chat',
    () => {
        const login = ref({
            email: '',
            password: ''
        })
        const signUp = ref({
            firstName: '',
            lastName: '',
            Email: '',
            password: '',
            image: null,
            confirm_password: ''
        })
        const serverUrl = {
            BASE_URL: "http://127.0.0.1:8000/",
            WS_BASE_URL: "ws://127.0.0.1:8000/",
        };
        const ApiEndpoints = {
            SIGN_UP_URL: "api/v1/signup",
            LOGIN_URL: "api/v1/login",
            USER_URL: "api/v1/users",
            CHAT_URL: "api/v1/chats",
            USER_CHAT_URL: "api/v1/users/<userId>/chats",
            CHAT_MESSAGE_URL: "api/v1/chats/<chatId>/messages",
        };
        const Constants = {
            ACCESS_PROPERTY: "access",
            REFRESH_PROPERTY: "refresh",
            USER_ID_PLACE_HOLDER: "<userId>",
            CHAT_ID_PLACE_HOLDER: "<chatId>",
            ENTER_KEY_CODE: 13,
        }
        const SocketActions = {
            MESSAGE: "message",
            TYPING: "typing",
            ONLINE_USER: "onlineUser",
        };
        const AppPaths = {
            HOME: "/",
            CHAT_ROOM: "/c/:chatId",
            LOGIN: "/login",
            SIGN_UP: "/signup",
        };

        const returnUrl = null
        const success = ref(false)

        ///websocket

        const socket = ref(null)
        const isConnected = ref(false)
        const messages = ref([])
        const new_message = ref('')
        const roomInput = ref([])
        const userId = ref(null)
        const isTypingSignalSent = ref(false)
        const typingTimer = ref(null)
        const route = useRoute()
        const chatId = ref(route.params.chatId)
        const chats = ref([])
        const chatMessages = ref([])
        const usersTyping = ref([])
        const onlineUser = ref([])


        const getActiveChatId = (route) => {
            return route && route.params ? route.params.roomId : null
        }
        const profileOfUserId = computed(() => {
            const activeChatId = getActiveChatId(route);

            const rooms = chats.value.find(room=> room.roomId === activeChatId);
            if (rooms) {
                return {
                    username: rooms.name,
                    image: rooms.image
                };
            }
        });
        const chatUser = async () => {
            const response = await axios.get(serverUrl.BASE_URL + `api/v1/users/${getUserId()}/chats`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            const userId = getUserId()
            const uniqueRoomIds = new Set()
            let newResult = null
            response.data.forEach((item) => {
                if (item.type === "DM" || item.type === "SELF" && !uniqueRoomIds.has(item.roomId)) {
                    newResult = {
                        roomId: item.roomId,
                        name: '',
                        image: '',
                        id: ''
                    }
                    let member = item.member.find(user => user.id !== userId || item.type === "SELF");
                    if (member) {
                        newResult.name = member.first_name + " " + member.last_name;
                        newResult.image = member.image;
                        newResult.id = member.id;
                        newResult.isOnline = onlineUser.value?.includes(member.id)
                    }
                }
                chats.value.push(newResult)
            })
        }

        const messageOfUser = async () => {
            const chatRoomId = getActiveChatId(route);
            try {
                const res = await axios.get(serverUrl.BASE_URL + `api/v1/chats/${chatRoomId}/messages`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                chatMessages.value = res.data.map(item => ({
                    roomId: chatRoomId,
                    message: item.message,
                    time: item.timestamp,
                    user: item.user,
                    image: item.userImage,
                    userName: item.userName,
                    isOnline : item.isOnline
                }));
                console.log(chats.value)
            } catch (error) {
                console.error("Error fetching chat messages:", error);
                // Handle error appropriately
            }
        }
        const reversChatMessage =computed(()=>{
            return [...chatMessages.value].reverse()
        })
        //GET USER ID//
        const getUserId = () => {
            const token = localStorage.getItem('token')
            if (token) {
                let decodedToken = jwtDecode(token)
                return decodedToken.userId
            }
            return ''
        }
        const messagesContainer = ref(null)
        const scrollToBottom =async () => {
           await nextTick(() => {
                if (messagesContainer.value) {
                    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
                }
            });
        };
        const loggedInUserId = getUserId();
        const getChatMessageClassName = (userId) => {
            return loggedInUserId === userId
                ? "text-right justify-end"
                : "";
        };
        //// get time ///
        const is_date = (date) => {
            if (Object.prototype.toString.call(date) === "[object Date]") {
                return true;
            }
            return false;
        };
        const getTimeFromDate = (date) => {
            let dateObj = is_date(date) ? date : new Date(date);
            let hour = dateObj.getHours();
            let minute = dateObj.getMinutes();
            let meridian = "am";
            if (hour > 12) {
                hour -= 12;
                meridian = "pm";
            }
            if (hour === 0) {
                hour = 12;
            }
            if (minute < 10) {
                minute = "0" + minute;
            }
            return hour + ":" + minute + " " + meridian;
        };
   const onlineUsers =computed(()=>{
       let online = chats.value.map()
   })
        // WEB SOCKET ///
        const initWebSocket = () => {
            socket.value = new WebSocket(`ws://localhost:8000/ws/users/${getUserId()}/chat/`);
            socket.value.onopen = onWebSocketOpen;
            socket.value.onmessage = onWebSocketMessage;
            socket.value.onerror = onWebSocketError;
            socket.value.onclose = onWebSocketClose;
            // loadMessagesFromLocalStorage()
        };
        const onWebSocketOpen = (e) => {
            isConnected.value = true
            console.log('websocket is connected')
            socket.value.send(JSON.stringify({action: 'subscribe', roomId: getActiveChatId(route)}))
        };
        const onWebSocketMessage = (event) => {
            const newMessage = JSON.parse(event.data)
            const userImageUrl = messageOfUser().image
            if (newMessage.action === SocketActions.MESSAGE) {
                chatMessages.value.push({
                    message: newMessage.message,
                    user: newMessage.user,
                    time: newMessage.timestamp,
                    userImage: JSON.stringify(userImageUrl),
                    userName: newMessage.userName
                });
            }
            if (newMessage.action === SocketActions.TYPING && newMessage.user !== userId) {
                if (newMessage.typing && !usersTyping.value.includes(newMessage.user)) {
                    usersTyping.value.push(newMessage.user);
                } else if (!newMessage.typing) {
                    usersTyping.value = usersTyping.value.filter((userId) => userId !== newMessage.user);
                }
            }
        }
        const sendMessage = () => {
            const activeChatId = getActiveChatId(route)
            if (activeChatId !== null) {
                let currentDateTime = new Date()
                let userImageUrl = messageOfUser().image
                let username = messageOfUser().userName
                let to_send = {
                    message: new_message.value
                    , action: SocketActions.MESSAGE
                    , user: getUserId(),
                    roomId: activeChatId,
                    // timestamp: currentDateTime.toISOString(),
                    // userImage: userImageUrl,
                    // userName: username
                }
                socket.value.send(JSON.stringify(to_send))
                // chatMessages.value.push({
                //     roomId: activeChatId,
                //     message: new_message.value,
                //     user: getUserId(),
                //     time: to_send.timestamp,
                //     image: to_send.userImage,
                //     userName: to_send.username
                // })
                new_message.value = ''
            } else {
                console.log('error dari')
            }
        }
        const onWebSocketError = (error) => {
            isConnected.value = false
            console.log('websocket error', error)
        }
        const onWebSocketClose = (event) => {
            isConnected.value = false
            console.log('websocket is disconnect', event)
        }
        const logOutUser = async () => {
            localStorage.removeItem('token')
            await router.push('auth/login')
        }


        //      ACTION ////

        const sendTypingSignal = (typing) => {
            socket.value.send(
                JSON.stringify({
                    action: SocketActions.TYPING,
                    typing: typing,
                    user: getUserId(),
                    roomId: getActiveChatId(route),
                })
            );
        }
        const chatMessageTypingHandler = (event) => {
            if (event.keyCode !== Constants.ENTER_KEY_CODE) {
                if (!isTypingSignalSent.value) {
                    sendTypingSignal(true);
                    isTypingSignalSent.value = true;
                }
                clearTimeout(typingTimer.value);
                typingTimer.value = setTimeout(() => {
                    sendTypingSignal(false);
                    isTypingSignalSent.value = false;
                }, 3000);
            } else {
                clearTimeout(typingTimer.value);
                sendTypingSignal(false)
                isTypingSignalSent.value = false;
            }
        };
        const fileInputChange = computed(() => {
            return (fileInput) => {
                let files = fileInput.target.files || fileInput.dataTransfer.files;
                const selectedFile = files[0];
                signUp.value.image = selectedFile
                console.log(signUp.value.image)
            }
        })

        const send_request_login = async () => {
            const res = await axios.post(`${serverUrl.BASE_URL}${ApiEndpoints.LOGIN_URL}`, {
                    username: login.value.email,
                    password: login.value.password
                },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                })
            const token = res.data.access
            const refresh = res.data.refresh
            localStorage.setItem('token', token)
            localStorage.setItem('refresh', refresh)
            await router.push('/')
        }

        const send_request_signUp = async () => {
            try {
                const formData = new FormData();
                formData.append('first_name', signUp.value.firstName);
                formData.append('last_name', signUp.value.lastName);
                formData.append('email', signUp.value.Email);
                formData.append('password', signUp.value.password);
                formData.append('image', signUp.value.image);
                formData.append('passwordTwo', signUp.value.confirm_password);

                const res = await axios.post(`${serverUrl.BASE_URL}${ApiEndpoints.SIGN_UP_URL}`, formData,
                )
                const token = res.data.access
                localStorage.setItem('token', token)
                await router.push('/auth/login')
                success.value = true
            } catch (e) {
            }

        }
        // const addFriend= async (memberId)=>{
        //   const userId = getUserId()
        //     let requestBody = {
        //         members: [memberId, userId],
        //         type: "DM",
        //     };
        //     try {
        //         const response = await axios.get("http://localhost:8000/api/v1/chats", // The request body
        //             {
        //                 headers: {
        //                     Authorization: `Bearer ${localStorage.getItem('token')}`
        //                 }
        //             }
        //         );
        //         console.log('Response data:', response.data);
        //         // Additional logic after successful request (e.g., update state, show message)
        //     } catch (error) {
        //         console.error('Error adding friend:', error);
        //         // Error handling logic (e.g., show error message)
        //     }
        // }
        return {
            login,
            signUp,
            serverUrl,
            fileInputChange,
            ApiEndpoints,
            returnUrl,
            success,
            send_request_login,
            send_request_signUp,
            socket,
            initWebSocket,
            sendMessage,
            messages,
            isConnected,
            new_message,
            roomInput,
            onWebSocketMessage,
            onWebSocketOpen,
            Constants,
            userId,
            SocketActions,
            getUserId,
            sendTypingSignal,
            chatMessageTypingHandler,
            chatId,
            getActiveChatId,
            route,
            chatUser,
            AppPaths,
            chats,
            messageOfUser,
            chatMessages,
            usersTyping,
            getTimeFromDate,
            is_date,
            logOutUser,
            getChatMessageClassName,
            reversChatMessage,
            scrollToBottom,
            messagesContainer,
profileOfUserId
        }
    })
