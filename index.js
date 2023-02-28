const TelegramApi = require('node-telegram-bot-api')

const {gameOptions, againOptions} = require('./options')

const token = '6128015834:AAEf1dx_8YfRH6lDME7bIWwyaPFv5QXzHuY'

const bot = new TelegramApi(token, { polling: true })

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `I will guess a number from 0 to 9, and you have to guess this number`)
    const randomNumber = Math.floor(Math.random()*10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Try to quess!', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Initial greeting'},
        {command: '/info', description: 'Take info about user'},
        {command: '/game', description: 'Game "Guess Number"'},
    ])
    
    bot.on('message',  async msg =>{
        const text = msg.text;
        const chatId = msg.chat.id;
        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/594/5b4/5945b408-5516-4af5-8ba2-e54f8372959c/1.webp')
            return bot.sendMessage(chatId, `Welcome to  telegram bot Mido`);
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `your name ${msg.from.first_name} ${msg.from.last_name}`);
        }
        if (text === '/game'){
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, 'I don`t understand you :( Try again!')
    })

    bot.on('callback_query', async msg =>{
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if(data === '/again') {
            return startGame(chatId)
        }
        if(data === chats[chatId]) {
            return bot.sendMessage(chatId, `Good! you guess ${chats[chatId]}`, againOptions)
        } else {
            return bot.sendMessage(chatId, `Unfortunately you didn't guess, bot quess number ${chats[chatId]}`, againOptions)
        }
    })
}

start()