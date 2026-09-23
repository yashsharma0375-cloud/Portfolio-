// Populates the database with a few sample projects.
// Run with: npm run seed  (after setting MONGO_URI in .env)
require("dotenv").config();
const mongoose = require("mongoose");
const Project = require("./models/Project");

const sample = [
  {
    title: "Ledger — real-time payments ledger",
    description: "Event-sourced ledger handling millions of transactions/day with fast reconciliation.",
    stack: "Node.js · Postgres · Kafka",
    year: "2026",
    order: 1
  },
  {
    title: "Pathfinder — internal deploy tool",
    description: "Cut deploy time significantly by parallelizing build and migration steps.",
    stack: "Go · Docker · AWS",
    year: "2025",
    order: 2
  },
  {
    title: "Signal — anomaly alerting service",
    description: "Statistical alerting layer on top of metrics pipelines to cut false pages.",
    stack: "Python · Redis · gRPC",
    year: "2024",
    order: 3
  }
];

async function seed() {
  if (!process.env.MONGO_URI) {
    console.error("Set MONGO_URI in .env first.");
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URI);
  await Project.deleteMany({});
  await Project.insertMany(sample);
  console.log(`Seeded ${sample.length} projects.`);
  await mongoose.disconnect();
}

seed();
