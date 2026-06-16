import type { Geofence, PartnerPlan } from "../index.js";

/** Plain Partner document shape */
export interface IPartner {
  _id: string;
  name: string;
  slug: string;
  email: string;
  phone?: string;
  address: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  geofence: Geofence;
  plan: PartnerPlan;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  commissionRate: number;
  ownerId: string;
  staffIds: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
