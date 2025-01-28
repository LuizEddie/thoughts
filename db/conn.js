const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('thoughts', 'root', 'root', {
    host: 'host.docker.internal',
    dialect: 'mysql'
});

try{
    sequelize.authenticate();
    console.log('Conectado com sucesso!');
}catch(e){
    console.log(`Não foi possível conectar; ${e}`);
}

module.exports = sequelize;