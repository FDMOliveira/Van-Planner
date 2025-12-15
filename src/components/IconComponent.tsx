import { RiFlowerLine } from "react-icons/ri";
import { LuSofa } from "react-icons/lu";
import { MdOutlineTableRestaurant } from "react-icons/md";
import { PiChairDuotone } from "react-icons/pi";
import React from "react";
import classNames from "classnames";

export interface ShellIconProps {
  name: string;
  className?: string;
}

export default function IconComponent({ name, className }: ShellIconProps) {
  const icons: Record<string, any> = {
    chair: PiChairDuotone,
    table: MdOutlineTableRestaurant,
    sofa: LuSofa,
    flower: RiFlowerLine,
  };

  const icon = icons[name];
  if (typeof icon !== "undefined") {
    return React.createElement(icon, {
      className: classNames(className, "w-6 h-6"),
    });
  } else {
    return <></>;
  }
}
