/*
npm install typescript ts-node
npm install @commercetools/sdk-client @commercetools/sdk-auth
npx ts-node src/connectors/post-deploy.ts
*/
import {
  checkAndCreatePaydockPaymentMethod,
  checkAndCreatePaydockTypeForPaymentMethod
} from "../utils/create-paydock-payment-method";

async function postDeploy(properties: any) {
  if (properties) {

  }
}

async function runPostDeployScripts() {
  try {
    const properties = new Map(Object.entries(process.env));
    await postDeploy(properties);
    checkAndCreatePaydockTypeForPaymentMethod();
    console.log('Post-deploy script executed successfully.');
  } catch (error) {
    if (error instanceof Error) {
      process.stderr.write(`Post-deploy failed: ${error.message}\n`);
    }
    process.exitCode = 1;
  }
}

runPostDeployScripts();
