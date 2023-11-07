import type { Session } from '@auth/core/types';
import type { RequestHandler } from '@builder.io/qwik-city';
import { replaceUrl } from '~/library/util';
import { client } from '~/server';

export const onGet: RequestHandler = async (ev) => {
  const { json, params: { uid }, env } = ev;
  if (uid == '_') {
    json(200, {

    })
  }
  const session: Session | null = ev.sharedMap.get('session');
  if (!session || new Date(session.expires) < new Date()) {
    throw ev.redirect(302, `/api/auth/signin?callbackUrl=${ev.url.pathname}`);
  }

  const meta = client.db('data').collection<MetaSchema>('meta')

  const three = await meta.aggregate<MetaSchema>(
    [{ $sample: { size: 3 } }]
  ).toArray()

  json(200, {
    uid: uid,
    lastUpdate: new Date().toISOString(),
    msg: `Hi ${uid}`,
    suggest: three.map((record) => {
      // @ts-ignore
      delete record._id

      return {
        title: record.title,
        bvid: record.bvid,
        dash: `${env.get('NGINX_ORIGIN')!}/dash/videos/${bvid}.mp4/manifest.mpd`,
        aid: record.aid,
        cover: replaceUrl(record.cover),
        upname: record.upname,
        upavatar: replaceUrl(record.upavatar),
        desc: record.desc,
        cat: record.cat,
      }
    })
  });
};
