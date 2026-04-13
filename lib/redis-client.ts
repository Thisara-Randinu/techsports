import { Redis } from "@upstash/redis";

function getRedisClient() {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (upstashUrl && upstashToken) {
    return new Redis({ url: upstashUrl, token: upstashToken });
  }

  const kvUrl = process.env.KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN;
  if (kvUrl && kvToken) {
    return new Redis({ url: kvUrl, token: kvToken });
  }

  return null;
}

export const redis = getRedisClient();
