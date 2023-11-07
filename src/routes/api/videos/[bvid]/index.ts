import { type RequestHandler } from "@builder.io/qwik-city";
import { replaceUrl } from "~/library/util";
import { client } from "~/server";

export const onGet: RequestHandler = async ({env, params, json }) => {
  const { bvid } = params

  // const serverPath = join(NGINX_VOD_ROOT, 'videos', bvid + '.mp4')
  const meta = client.db('data').collection<MetaSchema>('meta')

  const record = await meta.findOne({ bvid })
  if (record) {
    // @ts-ignore
    delete record._id

    json(200, {
      title: record.title,
      bvid: record.bvid,
      dash: `${env.get('NGINX_ORIGIN')!}/dash/videos/${bvid}.mp4/manifest.mpd`,
      aid: record.aid,
      cover: replaceUrl(record.cover),
      upname: record.upname,
      upavatar: replaceUrl(record.upavatar),
      desc: record.desc,
      cat: record.cat,
    })
  } else {
    json(404, {
      msg: 'bvid not exist'
    })
  }
}