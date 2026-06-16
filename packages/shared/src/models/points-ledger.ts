import type { PointsLedgerType } from "../index.js";

/** Plain PointsLedger document shape */
export interface IPointsLedger {
  _id: string;
  userId: string;
  type: PointsLedgerType;
  amount: number;
  balanceAfter: number;
  reference?: {
    model: string;
    id: string;
  };
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
