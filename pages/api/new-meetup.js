import { MongoClient } from "mongodb";

//functions for server side
// /api/new-meetup
// POST /api/new-meetup

export default async function handler(req, res) {
  if (req.method === "POST") {
    const data = req.body;

    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db();

    const meetupsCollection = db.collection("meetups");
    const result = await meetupsCollection.insertOne({ data });

    console.log(result, "RESULT");

    client.close();

    res.status(201).json({ message: "Meetup inserted!" });
  }
}
