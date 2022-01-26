const amqp = require('amqplib');
const { v4: uuidv4 } = require('uuid');

const config = require('../config');
const logger = require('../logger/logger');

const connect = async () => {
    amqp.connect(config.RABBITMQ_URL)
        .then((connection) => {
            logger.info(`[AMQP] Connected to RabbitMQ at ${config.RABBITMQ_URL}`);
            return connection;
        })
        .catch((error) => {
            logger.error(`[AMQP] Connection to RabbitMQ failed: ${error.message}`);
        });
};

const sendMessageToQueue = async (queueName, queueOptions, consumeOptions, message) => {
    const connection = await connect();
    let responseMessageContent = null;
    if (connection) {
        const channel = await connection.createChannel();
        await channel.assertQueue(queueName, queueOptions);
        const assertQueue = await channel.assertQueue('', { exclusive: true });
        const correlationId = uuidv4();
        await channel.sendToQueue(queueName, Buffer.from(message ? JSON.stringify(message) : ''), { replyTo: assertQueue.queue, correlationId });
        channel.consume(assertQueue.queue, async (consumeMessage) => {
            if (consumeMessage.properties.correlationId === correlationId) {
                await connection.close();
                responseMessageContent = JSON.parse(consumeMessage.content.toString());
            }
        }, consumeOptions);
        await channel.close();
        await connection.close();
        logger.info(`[AMQP] Message sent to ${queueName}`);
    }
    return responseMessageContent;
};

module.exports = {
    connect,
    sendMessageToQueue,
};
