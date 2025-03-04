import amqp from "amqplib";
import dotenv from 'dotenv';

dotenv.config();

let channel;

export const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    console.log("Connected to RabbitMQ");
  } catch (error) {
    console.error("Error connecting to RabbitMQ:", error);
  }
};

const getQueueName = (conversation_id) => `chat.conversation.${conversation_id}`;

export const sendToQueue = async (message) => {
  if (!channel) {
    console.error("Connection error to RabbitMQ");
    return;
  }

  const queueName = getQueueName(message.conversation_id);
  await channel.assertQueue(queueName, { durable: true });

  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });
  console.log(`Message sended: ${queueName}`, message);
};
