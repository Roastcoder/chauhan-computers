import dellInspiron from "@/assets/products/dell-inspiron.jpg";
import hpPavilion from "@/assets/products/hp-pavilion.jpg";
import lenovoIdeapad from "@/assets/products/lenovo-ideapad.jpg";
import macbookAir from "@/assets/products/macbook-air.jpg";
import dellOptiplex from "@/assets/products/dell-optiplex.jpg";
import hpProdesk from "@/assets/products/hp-prodesk.jpg";
import hpLaserjet from "@/assets/products/hp-laserjet.jpg";
import canonPixma from "@/assets/products/canon-pixma.jpg";
import gamingKeyboard from "@/assets/products/gaming-keyboard.jpg";
import logitechCombo from "@/assets/products/logitech-combo.jpg";
import samsungMonitor from "@/assets/products/samsung-monitor.jpg";
import tplinkRouter from "@/assets/products/tplink-router.jpg";
import wdPassport from "@/assets/products/wd-passport.jpg";
import apcUps from "@/assets/products/apc-ups.jpg";
import hikvisionCctv from "@/assets/products/hikvision-cctv.jpg";

// Map product names to local fallback images
const productImageMap: Record<string, string> = {
  "Dell Inspiron 15 3520": dellInspiron,
  "HP Pavilion x360 14": hpPavilion,
  "Lenovo IdeaPad Slim 3": lenovoIdeapad,
  "MacBook Air M2": macbookAir,
  "Dell OptiPlex 3000": dellOptiplex,
  "HP ProDesk 400 G9": hpProdesk,
  "HP LaserJet Pro M404dn": hpLaserjet,
  "Canon PIXMA G3060": canonPixma,
  "Cosmic Byte CB-GK-18 Keyboard": gamingKeyboard,
  "Logitech MK270 Combo": logitechCombo,
  'Samsung 24" Monitor': samsungMonitor,
  "TP-Link Archer C6": tplinkRouter,
  "WD My Passport 1TB": wdPassport,
  "APC Back-UPS 600VA": apcUps,
  "Hikvision 4 Channel DVR Kit": hikvisionCctv,
};

export function getProductFallbackImage(productName: string): string {
  return productImageMap[productName] || "";
}
