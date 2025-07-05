import { RateLimiterMemory } from 'rate-limiter-flexible';

export const apiRateLimiter = new RateLimiterMemory({
    points: 5,    // 10 peticiones
    duration: 1,   // por segundo
    blockDuration: 30, // si se supera, bloquea 10s
});