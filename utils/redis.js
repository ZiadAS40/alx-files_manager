import { createClient } from "redis";
import { promisify } from 'util';



class RedisClient {
    constructor () {
        this.client =  createClient();
        this.alive = true;

        this.client.on("error", (error) => {
            this.alive = false;
            console.log(error)
        });

        this.client.on("connect", () => {
            this.alive = true;
        });

    }

    isAlive() {
        return this.alive;
    }

    async get(key) {
        return await promisify(this.client.GET).bind(this.client)(key);
    }

    async set(key, value, duration) {
        this.client.set(key, value, "EX", duration, (err, rep) => {
            if (err) {
                console.log(err);
            }
        });
    }

    async del(key) {
        await this.client.del(key)
    }
}

const redisClient = new RedisClient();

export default redisClient;
