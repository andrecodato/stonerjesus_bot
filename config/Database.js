const mongoose = require('mongoose');
require('dotenv').config();

class Database {
    constructor() {
        this.connection = null;
    }

    connect () {
        console.log('Conectando a database...');
        
        mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(() => {
            console.log('Conectado a database!');
            this.connection = mongoose.connection;
        }).catch(err => {
            console.log('Erro ao conectar a database: ', err);
        });
    }
}

module.exports = Database;