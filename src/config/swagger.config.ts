const config = {
  development: "localhost:3002",
  production: "localhost:3002",
  //   production: "https://simple-backend.onrender.com",
};

const currentEnv =
  process.env.NODE_ENV === "development" ? "development" : "production";

module.exports = config[currentEnv];
