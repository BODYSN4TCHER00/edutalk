import amqp from "amqplib";

let channel;

export const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost"); // Cambia la URL si es necesario
    channel = await connection.createChannel();
    await channel.assertQueue("messages_queue", { durable: true });
    console.log("Connected to RabbitMQ");
  } catch (error) {
    console.error("Error connecting to RabbitMQ:", error);
  }
};

export const sendToQueue = async (message) => {
  if (!channel) {
    console.error("Connection error to RabbitMQ");
    return;
  }
  channel.sendToQueue("messages_queue", Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });
  console.log("Message sended:", message);
};
