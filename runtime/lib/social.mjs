export function facebookPublishConfigured() {
  return Boolean(
    (process.env.META_PAGE_ACCESS_TOKEN || "").trim() &&
      ((process.env.META_PAGE_ID || "").trim() ||
        (process.env.META_PIXEL_ID || "").trim())
  );
}

export function youtubeConfigured() {
  return Boolean(
    (process.env.YOUTUBE_REFRESH_TOKEN || "").trim() ||
      ((process.env.YOUTUBE_API_KEY || "").trim() &&
        (process.env.YOUTUBE_CHANNEL_ID || "").trim())
  );
}

export function youtubeUploadConfigured() {
  return Boolean((process.env.YOUTUBE_REFRESH_TOKEN || "").trim());
}

export function socialStatus() {
  const pixel = Boolean((process.env.META_PIXEL_ID || "").trim());
  return {
    facebook: {
      pixel,
      publish: facebookPublishConfigured(),
      missing: facebookPublishConfigured()
        ? []
        : ["META_PAGE_ACCESS_TOKEN", "META_PAGE_ID"],
    },
    youtube: {
      read: youtubeConfigured(),
      upload: youtubeUploadConfigured(),
      missing: youtubeUploadConfigured()
        ? []
        : ["YOUTUBE_REFRESH_TOKEN"],
    },
    note: "Publish/upload still require an explicit founder yes.",
  };
}
