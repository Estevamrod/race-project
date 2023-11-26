import http from 'http';
import app from './src/app';
import dotenv from 'dotenv';
dotenv.config();

const server = http.createServer(app);
const PORT = process.env.PORT;

server.listen(PORT,() => {
    console.log(`running on http://localhost:${PORT}`);
})