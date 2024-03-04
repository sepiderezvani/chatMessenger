import {defineStore} from "pinia";
import axios from "axios";
import {computed, onMounted, ref} from "vue";
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
        let typingTimer = 0
        const route = useRoute()
        const chatId = ref(route.params.chatId)

        const getActiveChatId = (route) => {
            return route && route.params ? route.params.chatId : null
        }

        const fetchMessage = async () => {
            const currentChatId = getActiveChatId(route)
            if (currentChatId) {
                const url =
                    ApiEndpoints.CHAT_MESSAGE_URL.replace(Constants.CHAT_ID_PLACE_HOLDER,
                        currentChatId
                    ) + "?limit=20&offset=0"
            }
        }
        const chatUser = async () => {
            await axios.get(serverUrl.BASE_URL + `api/v1/users/${getUserId()}/chats`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }).then(response => {
                console.log(response)
            })
        }
        const chatContainer = document.getElementById('chatContainer')
        const scrollTop = () => {
            chatContainer.scrollTop = chatContainer.scrollHeight
        }

        //GET USER ID//
        const getUserId = () => {
            let token = localStorage.getItem('token')
            console.log(token)
            if (token) {
                let decodedToken = jwtDecode(token)
                return decodedToken.userId
            }
            return ''
        }
        // WEB SOCKET ///
        const initWebSocket = () => {
            socket.value = new WebSocket(`ws://localhost:8000/ws/users/${getUserId()}/chat/`);
            socket.value.onopen = onWebSocketOpen;
            socket.value.onmessage = onWebSocketMessage;
            socket.value.onerror = onWebSocketError;
            socket.value.onclose = onWebSocketClose;
            loadMessagesFromLocalStorage()
        };
        const onWebSocketOpen = (e) => {
            isConnected.value = true
            console.log('websocket is connected')
        };
        const onWebSocketMessage = (event) => {
            let data = JSON.parse(event.data)
            messages.value.push({from: 'other', message: data.message})
        };
        const sendMessage = () => {
            if (chatId !== null) {
                let to_send = {
                    from: signUp.value.firstName
                    , message: new_message.value
                    , action: SocketActions.MESSAGE
                    , user: getUserId(),
                    roomId: getActiveChatId(route)
                }
                socket.value.send(JSON.stringify(to_send)) ,
                    messages.value.push({from: 'me', message: new_message.value})
                saveMessagesToLocalStorage()
                new_message.value = ''
                scrollTop()
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

        // Save messages to local storage
        const saveMessagesToLocalStorage = () => {
            localStorage.setItem('messages', JSON.stringify(messages.value));
        };


        // Load messages from local storage
        const loadMessagesFromLocalStorage = () => {
            const storedMessages = localStorage.getItem('messages');
            if (storedMessages) {
                messages.value = JSON.parse(storedMessages);
            }
        };

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
                if (!isTypingSignalSent) {
                    sendTypingSignal(true);
                    isTypingSignalSent.value = true;
                }
                clearTimeout(typingTimer);
                typingTimer = setTimeout(() => {
                    sendTypingSignal(false);
                    isTypingSignalSent.value = false;
                }, 3000);
            } else {
                clearTimeout(typingTimer);
                isTypingSignalSent.value = false;
            }
        };

        //  cookie Utils  //

        const setCookie = (cookieName, cookieValue, expairydays = 30) => {
            const today = new Date();
            today.setTime(today.getTime() + expairydays * 24 * 60 * 60 * 1000);
            let expires = "expires=" + today.toUTCString();
            document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
        };

        const getCookie = (cookieName) => {
            let name = cookieName + "=";
            let decodedCookie = decodeURIComponent(document.cookie);
            let cookieList = decodedCookie.split(";");
            for (let i = 0; i < cookieList.length; i++) {
                let cookie = cookieList[i];
                while (cookie.charAt(0) === " ") {
                    cookie = cookie.substring(1);
                }
                if (cookie.indexOf(name) === 0) {
                    return cookie.substring(name.length, cookie.length);
                }
            }
            return null;
        };

        const deleteCookie = (cookieName) => {
            document.cookie =
                cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
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
                const token = res.data.token
                localStorage.setItem('token', token)
                await router.push('/login')
                success.value = true
            } catch (e) {
            }

        }
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
            saveMessagesToLocalStorage,
            loadMessagesFromLocalStorage,
            setCookie,
            getCookie,
            deleteCookie,
            getUserId,
            sendTypingSignal,
            chatMessageTypingHandler,
            scrollTop,
            fetchMessage,
            chatId,
            getActiveChatId,
            route,
            chatUser,
        }
    })
