const Redis=require('ioredis');
const dotenv=require('dotenv');
dotenv.config();

const REDIS_URL=process.env.REDIS_URL || 'redis://localhost:6379';

function createRedis(){
    const client=new Redis(REDIS_URL,{
        maxRetryPerRequest : null,
        enableReadyCheck : true
    });

    client.on('error',(err)=>{
        console.log('[redis] error:',err.message);
    });

    client.on('connect',()=>{
        console.log('[redis] connected');
    });

    client.on('ready',()=>{
        console.log('[redis] ready');
    });

    return client;
}

module.exports={createRedis};