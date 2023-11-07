import { type RequestHandler } from '@builder.io/qwik-city';
import { client } from '~/server';

const db = client.db('data');
const meta = db.collection('meta');

export const onGet: RequestHandler = async ({ params, json, redirect }) => {

  const category = params['cat'];

  const documents = await meta.find({ cat: category}).toArray();

  json(200, [...documents]);
};
