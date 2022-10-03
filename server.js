const express = require('express')
const path = require('path')

const app = express()
const server = require('http').createServer(app) // servidor com protocolo http
const io = require('socket.io')(server) // servidor com protocolo wss (websocket)

// Definindo q o front end vai ficar na pasta public
app.use(express.static(path.join(__dirname, 'public')))

// E aceitando html ao inves de ejs q é o padrão font end do node
app.set('views', path.join(__dirname, 'public'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html');

app.use('/', (req, res) => {
    res.render('index.html')
})

// Configurando o websocket ------------

// Para armazenar as mensagens substituindo um banco de dados
const messages = []

// Criando a conexão
io.on('connection', (socket) => {
    console.log(`Sockect conectado ${socket.id}`);    

    // Assim q alguem é conectado é enviado todas as mensagens anteriores
    socket.emit('previousMessages', messages)

    // Ouvindo/recebendo os dados q vem do front, oq vem do front vem no 'data'
    socket.on('sendMessage', (data) => {
        messages.push(data)

        // Enviando para todos os sockects conectados a aplicação
        socket.broadcast.emit('receivedMessage', data)
    })
})

server.listen(3000)