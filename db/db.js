const mongoose = require('mongoose');
const url =`mongodb+srv://Bot:Bot228@social-network-uwo8u.mongodb.net/GitMon?retryWrites=true&w=majority`;

// устанавливаем соиденения по умолчанию
mongoose.connect(url,{ useNewUrlParser: true, useCreateIndex: true});

//Позволит mongoose  использовать глобальную библиотеку промисов
mongoose.Promise = global.Promise;

// Получение подключения по умолчанию
const db = mongoose.connection;

// Привязать подключение к событию ошибки  (получать сообщения об ошибках подключения)
db.on('error', console.error.bind(console, 'MongoDB connection error'));

// db.on('open', console.log('MongoDB is connected'));