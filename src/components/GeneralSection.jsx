"use client";

import { useCustomization } from "@/context/CustomizationContext";
import GeneralInterface from "./GeneralInterface";
import { useEffect } from "react";

export default function GeneralSection({ models }) {
  const { setVans, vans } = useCustomization();

  useEffect(() => {
    if (setVans) {
      setVans(models);
    }
  }, [setVans]);

  if (!vans || vans.length === 0) return null;

  return vans && <GeneralInterface />;
}
