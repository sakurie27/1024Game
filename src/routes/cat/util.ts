import { server$ } from "@builder.io/qwik-city";
import { readdir } from "node:fs/promises";
import { join } from "node:path";
export const cats = ['general', 'food', 'dance', 'music'] as const
export type Cats = typeof cats[number]

export const isValidCat = (str: string): str is Cats => {
  return cats.includes(str as unknown as Cats)
}

export const getAllVideo = server$(async (cat: Cats) => {
  const paths = await readdir(join('/mnt/d/VideoBilibili', cat))
  const videos = paths.map(file => {
    const match = file.match(/(.*?)-([0-9a-zA-Z]+)\.mp4$/);
    return {
      bvid: match?.[2],
      title: match?.[1],
    }
  })

  return { length: paths.length, videos }
})
