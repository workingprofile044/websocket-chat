import './styles.css';

const ws = new WebSocket('wss://websocket-chat-ep8y.onrender.com');

const loginPopup = document.getElementById('login-popup');
const chatRoom = document.getElementById('chat-room');
const nicknameInput = document.getElementById('nickname');
const joinBtn = document.getElementById('join-btn');
const errorMsg = document.getElementById('error-msg');
const usersList = document.getElementById('users-list');
const messagesContainer = document.getElementById('messages-container');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');

let nickname = '';

joinBtn.addEventListener('click', () => {
    nickname = nicknameInput.value.trim();
    if (nickname) {
        ws.send(JSON.stringify({ type: 'login', name: nickname }));
    }
});

sendBtn.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message) {
        ws.send(JSON.stringify({ type: 'message', name: nickname, message }));
        addMessage(message, true);
        messageInput.value = '';
    }
});

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    switch (data.type) {
        case 'login':
            if (data.success) {
                loginPopup.style.display = 'none';
                chatRoom.style.display = 'block';
            } else {
                errorMsg.textContent = 'Nickname is taken, please choose another one.';
            }
            break;
        case 'userlist':
            updateUsersList(data.users);
            break;
        case 'message':
            if (data.name !== nickname) {
                addMessage(`${data.name}: ${data.message}`, false);
            }
            break;
    }
};

function updateUsersList(users) {
    usersList.innerHTML = users.map(user => `<div>${user}</div>`).join('');
}

function addMessage(message, isMine) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.className = isMine ? 'message-right' : 'message-left';
    messagesContainer.appendChild(messageElement);
}
