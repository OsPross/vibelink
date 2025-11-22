"use server";

export async function getLatestVideoId(channelUrl: string): Promise<string | null> {
  try {
    // 1. Sprawdź czy to link do kanału
    if (!channelUrl.includes("youtube.com")) return null;

    // 2. Musimy zdobyć Channel ID (zaczyna się od UC...)
    // Jeśli użytkownik podał link typu /channel/UC..., mamy go od razu.
    // Jeśli podał /@nazwa, musimy pobrać stronę i znaleźć ID w źródle.
    
    let channelId = "";

    if (channelUrl.includes("/channel/")) {
      const parts = channelUrl.split("/channel/");
      channelId = parts[1]?.split("/")[0]?.split("?")[0];
    } else {
      // Scrapujemy ID kanału ze strony (działa dla linków @handle)
      const response = await fetch(channelUrl, { cache: 'no-store' });
      const html = await response.text();
      
      // Szukamy meta tagu z channelId
      const match = html.match(/<meta itemprop="identifier" content="(UC[\w-]+)"/);
      if (match && match[1]) {
        channelId = match[1];
      }
    }

    if (!channelId.startsWith("UC")) return null;

    // 3. Pobieramy RSS Feed dla tego kanału
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    const rssResponse = await fetch(rssUrl, { next: { revalidate: 3600 } }); // Cache na 1h
    const xml = await rssResponse.text();

    // 4. Wyciągamy ID najnowszego filmu (znajduje się w tagu <yt:videoId>)
    const videoMatch = xml.match(/<yt:videoId>(.*?)<\/yt:videoId>/);
    
    if (videoMatch && videoMatch[1]) {
      return videoMatch[1];
    }

    return null;

  } catch (error) {
    console.error("Błąd pobierania kanału YouTube:", error);
    return null;
  }
}