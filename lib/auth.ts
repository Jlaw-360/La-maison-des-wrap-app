import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { dash } from "@better-auth/infra";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [
    dash(),
  ],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 6,
  },
  user: {
    additionalFields: {
      phone: {
        type: "string",
        required: true,
        defaultValue: "",
      },
      address: {
        type: "string",
        required: true,
        defaultValue: "1450 Rue Saint-Pierre, Drummondville, QC",
      },
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
      },
      points: {
        type: "number",
        required: false,
        defaultValue: 50,
      },
    },
  },
});
