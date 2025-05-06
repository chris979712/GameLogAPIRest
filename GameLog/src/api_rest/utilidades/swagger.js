import swaggerAutogen from 'swagger-autogen';

const OutputFile = '../../../swagger.json';
const EndPointsFiles = ['../../server.js'];

const Doc = {
    info: {
        title: 'API de GameLOG',
        description: 'Esta API contiene los servicios de usuarios, seguidores, reseñas, juegos y favoritos para la mejora de reseñas sobre videojuegos.',
    },
    host: 'localhost:1234',
    schemes: ['http']
}

swaggerAutogen()(OutputFile,EndPointsFiles,Doc);