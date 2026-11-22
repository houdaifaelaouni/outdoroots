import { MongoClient, Collection } from "mongodb";

// Booking persistence. Uses MongoDB when MONGO_URL is set; otherwise falls
// back to an in-memory list (fine for local dev, wiped on every restart).

export interface BookingStore {
  list(): Promise<any[]>;
  get(id: string): Promise<any | null>;
  insert(doc: any): Promise<void>;
  update(id: string, changes: Record<string, any>): Promise<void>;
  kind: "mongodb" | "memory";
}

class MemoryStore implements BookingStore {
  kind = "memory" as const;
  constructor(private items: any[]) {}
  async list() {
    return [...this.items].sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
  }
  async get(id: string) {
    return this.items.find((b) => b.id === id) || null;
  }
  async insert(doc: any) {
    this.items.unshift(doc);
  }
  async update(id: string, changes: Record<string, any>) {
    const b = this.items.find((x) => x.id === id);
    if (b) Object.assign(b, changes);
  }
}

class MongoStore implements BookingStore {
  kind = "mongodb" as const;
  constructor(private col: Collection) {}
  async list() {
    return this.col.find({}, { projection: { _id: 0 } }).sort({ created_at: -1 }).toArray();
  }
  async get(id: string) {
    return this.col.findOne({ id }, { projection: { _id: 0 } });
  }
  async insert(doc: any) {
    await this.col.insertOne({ ...doc });
  }
  async update(id: string, changes: Record<string, any>) {
    const { _id, id: _ignored, ...safe } = changes;
    await this.col.updateOne({ id }, { $set: safe });
  }
}

export async function createBookingStore(seed: any[]): Promise<BookingStore> {
  const url = process.env.MONGO_URL;
  if (!url) {
    console.warn("MONGO_URL not set — bookings are kept in memory and lost on restart.");
    return new MemoryStore(seed);
  }
  const client = new MongoClient(url);
  await client.connect();
  const col = client.db(process.env.DB_NAME || "outdooroots").collection("bookings");
  await col.createIndex({ id: 1 }, { unique: true });
  await col.createIndex({ created_at: -1 });
  console.log("Connected to MongoDB for booking storage.");
  return new MongoStore(col);
}
