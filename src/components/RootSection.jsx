"use client";

import { CustomizationProvider } from "@/context/CustomizationContext";
import GeneralSection from "./GeneralSection";

export default function RootSection({ models }) {
  return (
    <CustomizationProvider>
      <GeneralSection models={models} />
    </CustomizationProvider>
  );
}
