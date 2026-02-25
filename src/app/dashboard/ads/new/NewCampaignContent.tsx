"use client";

import { useSearchParams } from "next/navigation";
import CampaignForm from "../CampaignForm";

export default function NewCampaignContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || undefined;

  return <CampaignForm defaultPlan={plan} />;
}
