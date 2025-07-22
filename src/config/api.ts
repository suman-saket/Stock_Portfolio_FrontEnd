const BASE_URL = "https://stock-portfolio-be.vercel.app";
const USER_ID = "64d1e82fb8f123abc4567890";

export const API_ENDPOINTS = {
    PORTFOLIO: {
        LIVE: `${BASE_URL}/portfolio/live/${USER_ID}`,
        ADD: `${BASE_URL}/portfolio/add`
    }
} as const;

export { USER_ID };
