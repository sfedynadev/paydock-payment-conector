import {createClient} from '@commercetools/sdk-client';
import {createAuthMiddlewareForClientCredentialsFlow} from '@commercetools/sdk-middleware-auth';
import {createHttpMiddleware} from '@commercetools/sdk-middleware-http';
import {createApiBuilderFromCtpClient} from '@commercetools/typescript-sdk';
import {getConfig} from "../config/config";

const config = getConfig();
const projectKey = config.projectKey;
const clientId = config.clientId;
const clientSecret = config.clientSecret;
const authUrl = config.authUrl;
const apiUrl = config.apiUrl;

const client = createClient({
    middlewares: [
        createAuthMiddlewareForClientCredentialsFlow({
            host: authUrl,
            projectKey,
            credentials: {clientId, clientSecret},
            scopes: [`manage_project:${projectKey}`],
        }),
        createHttpMiddleware({host: apiUrl}),
    ],
});

const apiRoot = createApiBuilderFromCtpClient(client).withProjectKey({projectKey});

export async function checkAndCreatePaydockPayExtension() {
    let paydockPaymentCustomType;
    try {
        paydockPaymentCustomType = await apiRoot.extensions().withKey({key: 'paydock-extension'}).get().execute();

    } catch (error) {
        let url = "https://api.paydock-commercetool-app.jetsoftpro.dev/paydock-extension/create-payment";
        //let url = "http://localhost:3003/paydock-extension/create-payment";

        paydockPaymentCustomType = await apiRoot.extensions().post({
            body: {
                key: 'paydock-extension',
                destination: {
                    type: "HTTP",
                    url: url
                },
                triggers: [
                    {
                        resourceTypeId: "payment",
                        actions: ["Create", "Update"]
                    }
                ]
            }
        }).execute();
    }
    return paydockPaymentCustomType;
}

export async function checkAndCreatePaydockTypeForPaymentMethod() {
    let paydockPaymentCustomType;
    try {
        paydockPaymentCustomType = await apiRoot.types().withKey({key: 'paydock-payment-type'}).get().execute();
    } catch (error) {
        paydockPaymentCustomType = await apiRoot.types().post({
            body: {
                key: 'paydock-payment-type',
                name: {
                    en: 'Paydock payment',
                },
                description: {
                    en: `Paydock payment`,
                },
                resourceTypeIds: ['payment'],
                fieldDefinitions: [
                    {
                        name: 'PaydockPaymentStatus',
                        label: {
                            en: 'Paydock payment status'
                        },
                        required: false,
                        type: {
                            name: 'Enum',
                            values: [
                                {
                                    "key": "paydock-pending",
                                    "label": "Pending via Paydock"
                                },
                                {
                                    "key": "paydock-paid",
                                    "label": "Paid via Paydock"
                                },
                                {
                                    "key": "paydock-authorize",
                                    "label": "Authorized via Paydock"
                                },
                                {
                                    "key": "paydock-cancelled",
                                    "label": "Cancelled authorize via Paydock"
                                },
                                {
                                    "key": "paydock-refunded",
                                    "label": "Refunded via Paydock"
                                },
                                {
                                    "key": "paydock-p-refund",
                                    "label": "Partial refunded via Paydock"
                                },
                                {
                                    "key": "paydock-requested",
                                    "label": "Requested via Paydock"
                                },
                                {
                                    "key": "paydock-failed",
                                    "label": "Fail via Paydock"
                                }
                            ]
                        },
                        inputHint: 'SingleLine'
                    },
                    {
                        name: 'PaydockTransactionId',
                        label: {en: 'Paydock transaction ID'},
                        required: false,
                        type: {name: 'String'},
                        inputHint: 'SingleLine'
                    }
                ]
            }
        }).execute();
    }
    return paydockPaymentCustomType;
}
