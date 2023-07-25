export type ParseWorker = {
  parse(file: File): Promise<void>
} & ServiceWorker

export default {} as ParseWorker