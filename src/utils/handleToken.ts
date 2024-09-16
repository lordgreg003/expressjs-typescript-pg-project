import jwt, { JwtPayload } from "jsonwebtoken";

interface TokenHandler {
  generateToken: (
    fieldToSecure: string | object,
    duration?: string | number
  ) => string;
  decodeToken: (token: string) => string | JwtPayload;
}

const tokenHandler: TokenHandler = {
  generateToken: (fieldToSecure, duration) => {
    try {
      const secret = process.env.JWT_SECRET_KEY as string;
      if (!secret) throw new Error("JWT secret key is missing");

      console.log("JWT Secret Key for signing:", secret);

      return jwt.sign({ fieldToSecure }, secret, {
        expiresIn: duration ? duration : "30d",
      });
    } catch (error: any) {
      throw new Error(`Error generating token: ${error.message}`);
    }
  },

  decodeToken: (token) => {
    try {
      const secret = process.env.JWT_SECRET_KEY as string;
      if (!secret) throw new Error("JWT secret key is missing");
      ("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaWVsZFRvU2VjdXJlIjp7ImlkIjoxOX0sImlhdCI6MTcyNjI0NjkzNCwiZXhwIjoxNzI2MzMzMzM0fQ.94o5fVJdr4XHU2MImkMix6-k8JD2E9qEH8KOpLtNvK4");

      console.log("JWT Secret Key for verifying:", secret);

      return jwt.verify(token, secret);
    } catch (error: any) {
      throw new Error(`Error decoding token: ${error.message}`);
    }
  },
};

export default tokenHandler;
