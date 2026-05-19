import dotenv from "dotenv";
dotenv.config();

import {
  registerEntitySecretCiphertext,
} from "@circle-fin/developer-controlled-wallets";

async function main() {
  try {
    const response = await registerEntitySecretCiphertext({
      apiKey: process.env.CIRCLE_API_KEY,
      entitySecret: process.env.CIRCLE_ENTITY_SECRET,
    });

    console.log("\n✅ Entity secret registered");
    console.log("Recovery file:");
    console.log(response.data?.recoveryFile);
  } catch (error) {
    console.error("\n❌ Registration failed:");
    console.error(error);
  }
}

main();
