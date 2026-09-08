import { isFounderPcAvailable } from "./pc-availability.mjs";
import { sshConfigured } from "./ssh-chemicloud.mjs";
import { gmailReadConfigured } from "./gmail-read.mjs";
import { emailConfigured } from "./mail.mjs";
import { geminiConfigured } from "./gemini.mjs";
import { socialStatus } from "./social.mjs";
import { linearConfigured } from "./linear-tasks.mjs";
import { telegramConfigured } from "./telegram.mjs";
import { llmConfigured } from "./llm.mjs";
import { cloudConfigured } from "../../hq/lib/cloud-work.mjs";

export function capabilitiesSnapshot() {
  const social = socialStatus();
  return {
    telegram: telegramConfigured(),
    linear: linearConfigured(),
    openai: llmConfigured(),
    gemini: geminiConfigured(),
    gmailSend: emailConfigured(),
    gmailRead: gmailReadConfigured(),
    githubViaCursor: Boolean((process.env.CURSOR_API_KEY || "").trim()),
    cloudProduct: cloudConfigured(),
    pcWhenOn: isFounderPcAvailable(),
    serverSsh: sshConfigured(),
    facebookPixel: social.facebook.pixel,
    facebookPublish: social.facebook.publish,
    youtubeRead: social.youtube.read,
    youtubeUpload: social.youtube.upload,
  };
}
