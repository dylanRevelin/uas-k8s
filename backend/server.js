const express = require('express');
const redis = require('redis');
const cors = require('cors');
const app = express();

app.use(cors());

// Koneksi ke Redis di Kubernetes
const client = redis.createClient({ url: 'redis://redis-service:6379' });
client.connect().catch(console.error);

app.get('/current', async (req, res) => {
    const count = await client.get('queue_count') || 0;
    res.send({ current: count });
});

app.post('/next', async (req, res) => {
    const nextCount = await client.incr('queue_count');
    res.send({ your_number: nextCount });
});

app.listen(3000, () => console.log('Backend on port 3000'));