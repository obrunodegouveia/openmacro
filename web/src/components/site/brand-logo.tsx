import Image from "next/image";
import { cn } from "@/lib/utils";

/** The same outlined wordmark and native OM icon used by the mobile app. */
export function BrandLogo({ className }: { className?: string }) {
  return (
    <Image
      src="/brand/openmacro-lockup-dark.png"
      alt="OpenMacro"
      width={1284}
      height={208}
      className={cn("h-auto w-[174px] shrink-0", className)}
    />
  );
}
