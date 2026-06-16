/** GPS coordinate embedded inside a driving Session */
export interface IGpsPoint {
  lat: number;
  lng: number;
  speed?: number;
  heading?: number;
  recordedAt: Date;
}

/** Plain Session document shape */
export interface ISession {
  _id: string;
  userId: string;
  km: number;
  points: number;
  startedAt: Date;
  endedAt?: Date;
  gpsPoints: IGpsPoint[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
