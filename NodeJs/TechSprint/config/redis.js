import { Redis } from "ioredis";

const redisClient = new Redis({
  port: 12977,
  host: "redis-12977.c264.ap-south-1-1.ec2.redns.redis-cloud.com",
  username: "default",
  password: "45nRcYgME3lchFtQ1bq8kVhjWniT3IvH",
  db: 0,
});

export default redisClient;
