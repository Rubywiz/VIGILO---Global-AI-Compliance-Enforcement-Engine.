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
    const response = await client.createWallets({
      walletSetId: process.env.CIRCLE_ESCROW_WALLET_SET_ID,
      blockchains: ["MATIC-AMOY"], // Circle sandbox chain
      count: 1,
    });

    const wallet = response.data.wallets[0];

    console.log("\n✅ Escrow Source Wallet Created");
    console.log("Wallet ID:");
    console.log(wallet.id);

    console.log("\nWallet Address:");
    console.log(wallet.address);
  } catch (error) {
    console.error("\n❌ Error creating source wallet:");
    console.error(error);
  }
}

main();