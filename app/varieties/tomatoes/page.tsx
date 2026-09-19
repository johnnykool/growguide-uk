import CropVarietyGuide from "@/components/CropVarietyGuide";
import { TOMATO_GUIDE, varietyMetadata } from "@/data/variety-guides";

export const metadata = varietyMetadata(TOMATO_GUIDE);

export default function Page() {
  return <CropVarietyGuide guide={TOMATO_GUIDE} />;
}
