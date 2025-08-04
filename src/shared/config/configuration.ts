export default () => ({
  isTest: process.env.NODE_ENV === 'test',
  isProduction: process.env.NODE_ENV === 'production',
  isDev: !process.env.NODE_ENV || process.env.NODE_ENV === 'development',
  port: process.env.PORT ? parseInt(process.env.PORT) : 4000,
  database: {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT) : 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    databaseName: process.env.POSTGRES_NAME,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
  },
  s3: {
    region: process.env.AWS_S3_REGION,
    accessKeyId: process.env.AWS_S3_KEY,
    secretAccessKey: process.env.AWS_S3_SECRET,
    assetsBucket: process.env.AWS_S3_ASSETS_BUCKET,
  },
  sqs: {
    prefix: process.env.AWS_SQS_PREFIX,
    region: process.env.AWS_SQS_REGION,
    accessKeyId: process.env.AWS_SQS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SQS_SECRET_ACCESS_KEY,
  },
  crypto: {
    key: process.env.CRYPTO_KEY,
  },
  newRelic: {
    appName: process.env.NEW_RELIC_APP_NAME,
    key: process.env.NEW_RELIC_LICENSE_KEY,
    logUrl: process.env.NEW_RELIC_LOG_URL,
  },
});
