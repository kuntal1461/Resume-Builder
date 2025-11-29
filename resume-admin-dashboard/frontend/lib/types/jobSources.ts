export type EnumOptionRecord = {
  code: number;
  label: string;
};

export type JobSourceMetadataResponse = {
  sources: EnumOptionRecord[];
  scrapeTypes: EnumOptionRecord[];
  scrapeCadences: EnumOptionRecord[];
};

export type JobSourceQueueEntryPayload = {
  company?: string | null;
  sourceType?: string | null;
  sourceNameId?: number | null;
  scrapeType?: string | null;
  scrapeTypeId?: number | null;
  cadence?: string | null;
  cadenceId?: number | null;
  url: string;
  enabledForScrapping: boolean;
  apiEndpoint?: string | null;
  apiKey?: string | null;
};

export type JobSourceQueueRequest = {
  entries: JobSourceQueueEntryPayload[];
};

export type ScrapperJobSourceRecord = {
  id: number;
  companyName: string | null;
  sourceNameId: number;
  sourceName: string;
  sourceUrl?: string | null;
  enabledForScrapping: boolean;
  scrapeTypeId?: number | null;
  scrapeType?: string | null;
  scrapingScheduleId?: number | null;
  scrapingSchedule?: string | null;
  apiEndpoint?: string | null;
  apiKey?: string | null;
};

export type JobSourceQueueResponse = {
  success: boolean;
  queuedCount: number;
  scrapperSources: ScrapperJobSourceRecord[];
};
