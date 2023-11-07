export const cats = ['general', 'food', 'dance', 'music'] as const
export type Cats = typeof cats[number]

export const isValidCat = (str: string): str is Cats => {
  return cats.includes(str as unknown as Cats)
}
