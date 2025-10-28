export interface Deal {
  ID: string;
  TITLE: string;
  ASSIGNED_BY_NAME: string;
  STAGE_ID?: string;
  OPPORTUNITY?: string | number;
  PROBABILITY?: string | number;
  DATE_MODIFY?: string;
}
