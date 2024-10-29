export default () => ({
  JWT_SECRET: process.env.JWT_SECRET || 'your_default_secret_key',
});
