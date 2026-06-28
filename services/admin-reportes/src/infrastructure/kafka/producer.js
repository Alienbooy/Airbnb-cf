const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'admin-service',
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
});

const producer = kafka.producer();

const connectKafka = async () => {
    try {
        await producer.connect();
        console.log('Kafka Producer connected');
    } catch (error) {
        console.error('Error connecting Kafka Producer:', error);
    }
};

const publishEvent = async (topic, eventName, payload) => {
    try {
        await producer.send({
            topic,
            messages: [
                {
                    value: JSON.stringify({
                        event: eventName,
                        payload,
                        timestamp: new Date().toISOString()
                    })
                }
            ],
        });
        console.log(`Event ${eventName} published to ${topic}`);
    } catch (error) {
        console.error(`Error publishing event ${eventName}:`, error);
    }
};

module.exports = {
    connectKafka,
    publishEvent
};
