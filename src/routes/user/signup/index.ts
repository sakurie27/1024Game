import type { RequestHandler } from '@builder.io/qwik-city';

export const onGet: RequestHandler = async ({ params, json }) => {
    
    json(200, {
        skuId: params.skuId,
        price: 123.45,
        description: `Description for ${params.skuId}`,
    });
};