"use client";
import { NewMap } from "@/components/new-map";

export default function Page() {
  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <NewMap onPlaceSelect={() => {}} />
    </div>
  );
}
