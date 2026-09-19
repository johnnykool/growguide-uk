import CropVarietyGuide from "@/components/CropVarietyGuide";
import { SPRING_ONION_GUIDE, varietyMetadata } from "@/data/variety-guides";

export const metadata = varietyMetadata(SPRING_ONION_GUIDE);

export default function Page() {
  return <CropVarietyGuide guide={SPRING_ONION_GUIDE} />;
}
