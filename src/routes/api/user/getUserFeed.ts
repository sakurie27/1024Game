import { server$ } from "@builder.io/qwik-city";
import { replaceUrl } from "~/library/util";
import { client } from "~/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getUserFeed = server$(async function (_uid: string, size = 3) {
  const meta = client.db('data').collection<MetaSchema>('meta')

  const three = await meta.aggregate<MetaSchema>(
    [{ $sample: { size } }]
  ).toArray()

  const assetServer = process.env['NGINX_ORIGIN'] + '/'

  return three.map((record) => {
    // @ts-ignore
    delete record._id

    return {
      title: record.title,
      bvid: record.bvid,
      aid: record.aid,
      // fixme: Qwik Bug [https://github.com/BuilderIO/qwik/issues/4417]
      dash: `${process.env['NGINX_ORIGIN']!}/dash/videos/${record.bvid}.mp4/manifest.mpd`,
      // dash: `${this.env.get('NGINX_ORIGIN')!}/dash/videos/${record.bvid}.mp4/manifest.mpd`,
      cover: replaceUrl(record.cover, assetServer),
      upname: record.upname,
      upavatar: replaceUrl(record.upavatar, assetServer),
      desc: record.desc,
      cat: record.cat,
    }
  })

})