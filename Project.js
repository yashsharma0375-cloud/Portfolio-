const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    stack: { type: String, default: "" },   // e.g. "Node.js · Postgres · Kafka"
    year: { type: String, default: "" },
    url: { type: String, default: "" },     // link to live project or repo
    order: { type: Number, default: 0 }     // lower = shown first
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
