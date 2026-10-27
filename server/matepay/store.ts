import fs from 'fs';
import path from 'path';

const DATA_DIR = path.resolve('data');

// Persistencia mínima en JSON: alcanza para devnet y sobrevive reinicios del server.
export class JsonStore<T> {
  private readonly file: string;
  private data: Record<string, T>;

  constructor(name: string, seed: Record<string, T> = {}) {
    this.file = path.join(DATA_DIR, `${name}.json`);
    this.data = fs.existsSync(this.file)
      ? { ...seed, ...JSON.parse(fs.readFileSync(this.file, 'utf8')) }
      : { ...seed };
  }

  get(key: string): T | undefined {
    return this.data[key];
  }

  values(): T[] {
    return Object.values(this.data);
  }

  set(key: string, value: T) {
    this.data[key] = value;
    this.save();
  }

  delete(key: string) {
    delete this.data[key];
    this.save();
  }

  private save() {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(this.file, JSON.stringify(this.data, null, 2));
  }
}
