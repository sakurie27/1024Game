import type { Session } from '@auth/core/types';
import type { RequestHandler } from '@builder.io/qwik-city';

export const onGet: RequestHandler = async (ev) => {
    const { json, params: { uid } } = ev;
    if (uid == '_') {
        json(200, {

        })
    }
    const session: Session | null = ev.sharedMap.get('session');
    if (!session || new Date(session.expires) < new Date()) {
        throw ev.redirect(302, `/api/auth/signin?callbackUrl=${ev.url.pathname}`);
    }
    json(200, {
        uid: uid,
        lastUpdate: new Date().toISOString(),
        msg: `Hi ${uid}`,
        suggest: []
    });
};