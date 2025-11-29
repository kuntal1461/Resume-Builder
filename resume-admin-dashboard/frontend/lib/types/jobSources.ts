export type EnumOptionRecord = {
  code: number;
  label: string;
};

export type JobSourceMetadataResponse = {
  sources: EnumOptionRecord[];
  scrapeTypes: EnumOptionRecord[];
  scrapeCadences: EnumOptionRecord[];
};
