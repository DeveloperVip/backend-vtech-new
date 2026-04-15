const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Demo',
            version: '1.0.0',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        servers: [
            {
                url: `${process.env.API_URL || 'http://localhost:5000'}/api/v1`,
            },
        ],

    },
    apis: ['./src/routes/*.js'], // đọc comment trong routes
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;