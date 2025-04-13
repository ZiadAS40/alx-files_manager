import { createClient } from "redis";



class RedisClient {
    constructor () {
        this.client =  createClient();
        this.alive = false;

        this.client.on("error", (error) => {
            this.alive = false;
            console.log(error)
        });

        this.client.on("connect", () => {
            this.alive = true;
        });

        this.client.connect().catch((error) => {
            console.error('Failed to connect to Redis server:', error);
          });
    }

    isAlive() {
        return this.alive;
    }

    async get(key) {
        return await this.client.get(key);
    }

    async set(key, value, duration) {
        const rep = await this.client.set(key, value, {
            EX: duration 
        });
    }

    async del(key) {
        await this.client.del(key)
    }
}

const redisClient = new RedisClient();

export default redisClient;
