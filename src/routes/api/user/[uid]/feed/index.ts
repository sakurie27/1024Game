import type { Session } from '@auth/core/types';
import type { RequestHandler } from '@builder.io/qwik-city';
import { getUserFeed } from '../../getUserFeed';

export interface DashMeta extends MetaSchema {
  dash: string
}
export interface FeedResultSuceess {
  [whatever: string]: unknown
  suggest: DashMeta[]
}

export const onGet: RequestHandler = async (ev) => {
  const { json, params: { uid }, signal } = ev;
  if (uid !== '_') {
    const session: Session | null = ev.sharedMap.get('session');
    if (!session || new Date(session.expires) < new Date()) {
      throw ev.redirect(302, `/api/auth/signin?callbackUrl=${ev.url.pathname}`);
    }
  }

  json(200, {
    uid: uid,
    lastUpdate: new Date().toISOString(),
    msg: `Hi ${uid}`,
    suggest: await getUserFeed(signal, uid, 3),
  } satisfies FeedResultSuceess);
};
