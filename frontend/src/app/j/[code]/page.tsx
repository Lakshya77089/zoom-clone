"use client";

import { useParams } from "next/navigation";
import { PreJoinScreen } from "@/components/prejoin/PreJoinScreen";

export default function JoinByLinkPage() {
  const { code } = useParams<{ code: string }>();
  return <PreJoinScreen code={code} />;
}
