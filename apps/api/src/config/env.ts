export const env = {
  PORT: process.env.PORT || 4000,
  NODE_ENV: process.env.NODE_ENV || "development",
  JWT_SECRET: process.env.JWT_SECRET || "zii_pos_super_secret_jwt_key_2026",
  PAYMENT_GATEWAY_SERVER_KEY:
    process.env.PAYMENT_GATEWAY_SERVER_KEY ||
    "SB-Mid-server-zii-pos-secret-key",
};
