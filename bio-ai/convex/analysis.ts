import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const create = mutation({
  args: {
    proteinFileId: v.id("_storage"),
    ligandFileId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const analysisId = await ctx.db.insert("analysis", {
      proteinFileId: args.proteinFileId,
      ligandFileId: args.ligandFileId,
    });
    return analysisId;
  },
});

export const get = query({
  args: { id: v.id("analysis") },
  handler: async (ctx, args) => {
    const analysis = await ctx.db.get(args.id);
    if (analysis) {
      const proteinUrl = await ctx.storage.getUrl(analysis.proteinFileId);
      const ligandUrl = await ctx.storage.getUrl(analysis.ligandFileId);
      return { ...analysis, proteinUrl, ligandUrl };
    }
    return null;
  },
});

export const getAll = query({ 
  handler: async (ctx) => {
    return await ctx.db.query("analysis").collect();
  },
});
