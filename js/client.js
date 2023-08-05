const socket = io('https://online-chatingapp-84zw.onrender.com', { transports : ['websocket'] });
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");
var audio=new Audio('pikachu.mp3');

const append=(message,position)=>{
    const messageElement=document.createElement('div'); 
    messageElement.innerText=message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position=='left'){
        audio.play();
    }
    //to auto scroll
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message=messageInput.value;
    append(`You: ${message}`,'right');
    socket.emit('send',message);
    messageInput.value='';
})

function isValidName(name) {
    // Check if the name contains at least one letter (non-empty)
    return /[A-Za-z]/.test(name.trim());
}

let name = prompt("Enter your name to join");
while (!name || !isValidName(name)) {
    name = prompt("Name is required and should contain at least one letter. Please enter your name to join");
}

// let name = prompt("Enter your name to join");
// while (!name) {
//     name = prompt("Name is required. Please enter your name to join");
// }
//const name = prompt("Enter you name to join");

socket.emit('new-user-joined', name);

socket.on('user-joined',name=>{
    append(`${name} joined the chat`, 'right');
})
socket.on('receive',data=>{
    append(`${data.name}: ${data.message}`,'left');
})
socket.on('left',name=>{
    append(`${name} left the chat`,'left');
})
