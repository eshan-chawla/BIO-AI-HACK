'use server';

import { action, mutation } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";

// Helper function to upload a single file to Tamarind
async function uploadFileToTamarind(apiKey: string, fileContent: string, fileName: string) {
  const uploadUrl = `https://app.tamarind.bio/api/upload/${fileName}`;
  console.log(`Uploading ${fileName} to ${uploadUrl}...`);

  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "x-api-key": apiKey,
      "Content-Type": "application/octet-stream",
    },
    body: new TextEncoder().encode(fileContent),
  });

  if (response.status !== 200) {
    const errorText = await response.text();
    throw new Error(`Failed to upload ${fileName}. Status: ${response.status}, Message: ${errorText}`);
  }
  
  console.log(`Successfully uploaded ${fileName}.`);
}

export const predictAlternateLigands = action({
  args: {
    proteinFileContent: v.string(),
    proteinFileName: v.string(),
    ligandFileContent: v.string(),
    ligandFileName: v.string(),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.TAMARIND_API_KEY;

    if (!apiKey) {
      throw new Error("TAMARIND_API_KEY is not set in your Convex project's environment variables.");
    }

    try {
      await Promise.all([
        uploadFileToTamarind(apiKey, args.proteinFileContent, args.proteinFileName),
        uploadFileToTamarind(apiKey, args.ligandFileContent, args.ligandFileName),
      ]);

      const jobNameToSubmit = `bio-ai-job-${Date.now()}`;
      const response = await fetch("https://app.tamarind.bio/api/submit-job", {
        method: "POST",
        headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
        body: JSON.stringify({
          jobName: jobNameToSubmit,
          type: "drugflow",
          settings: {
            pdbFile: args.proteinFileName,
            referenceLigandFile: args.ligandFileName,
            numSamples: 5,
            numBatches: 1,
            distCutoff: 8,
          },
        }),
      });

      if (!response.ok) throw new Error(`Tamarind API request failed: ${await response.text()}`);

      const responseText = await response.text();
      const jobName = responseText.split(' ')[0]; // Extract only the job name
      return jobName;

    } catch (error) {
      console.error("Tamarind process failed:", error);
      throw new Error(`Tamarind process failed: ${(error as Error).message}`);
    }
  },
});

export const retrieveResults = action({
  args: { analysisId: v.id("analysis"), jobName: v.string(), ligandFileName: v.string() },
  handler: async (ctx, args) => {
    const apiKey = process.env.TAMARIND_API_KEY;
    const jobEmail = process.env.TAMARIND_EMAIL;

    if (!apiKey || !jobEmail) {
      throw new Error("TAMARIND_API_KEY and TAMARIND_EMAIL must be set in your Convex project's environment variables.");
    }

    const resultFileName = "samples.sdf";

    const response = await fetch("https://app.tamarind.bio/api/result", {
      method: "POST",
      headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        jobName: args.jobName,
        fileName: resultFileName,
        jobEmail: jobEmail,
      }),
    });

    if (!response.ok) throw new Error(`Failed to retrieve results: ${await response.text()}`);

    const resultUrl = await response.text();
    const resultsResponse = await fetch(resultUrl.replace(/"/g, ''));
    if (!resultsResponse.ok) throw new Error(`Failed to download results: ${await resultsResponse.text()}`);

    const resultData = await resultsResponse.text();
    await ctx.runMutation(api.analysis.addResultDataToAnalysis, { 
      analysisId: args.analysisId, 
      resultData 
    });

    return { success: true, message: "Results retrieved and saved." };
  },
});
