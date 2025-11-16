import Link from "next/link";
// import logoSvg from "@/assets/whop-logo.svg";
import { cn } from "@/lib/utils";

interface LogoProps {
  url?: string;
  showText?: boolean;
  imgClass?: string;
  textClass?: string;
}

const Logo = ({
  url = "/",
  showText = true,
  imgClass = "w-8 h-8",
  textClass,
}: LogoProps) => (
  <Link href={url} className="flex items-center gap-2 w-fit">
    {/* <img src={logoSvg} alt="Whop" className={cn(imgClass)} /> */}
    {showText && (
      <span className={cn("font-semibold text-lg leading-tight", textClass)}>
        Whop.
      </span>
    )}
  </Link>
);

export default Logo;
