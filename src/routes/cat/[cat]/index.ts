import { type RequestHandler } from "@builder.io/qwik-city";
import { isValidCat, getAllVideo } from "../util";


export const onGet: RequestHandler = async (ev) => {
  if (isValidCat(ev.params.cat)) {
    ev.json(200, await getAllVideo(ev.params.cat))
  }
}