import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  analysis: defineTable({
    proteinFileId: v.id("_storage"),
    ligandFileId: v.id("_storage"),
    proteinFileName: v.string(),
    ligandFileName: v.string(),
    jobName: v.optional(v.string()),
    resultData: v.optional(v.string()),
  }),
});
