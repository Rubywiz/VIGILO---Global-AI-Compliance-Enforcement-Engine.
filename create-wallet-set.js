import dotenv from "dotenv";
dotenv.config();

import {
  initiateDeveloperControlledWalletsClient,
} from "@circle-fin/developer-controlled-wallets";

const client = initiateDeveloperControlledWalletsClient({
  apiKey: process.env.CIRCLE_API_KEY,
  entitySecret: process.env.CIRCLE_ENTITY_SECRET,
});

async function main() {
  try {
    const response = await client.createWalletSet({
      name: "vigilo-escrow-wallet-set",
    });

    console.log("\n✅ Wallet Set Created");
    console.log("Wallet Set ID:");
    console.log(response.data.walletSet.id);
  } catch (error) {
    console.error("\n❌ Error creating wallet set:");
    console.error(error);
  }
}

main();
