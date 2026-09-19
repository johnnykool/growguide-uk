import CropVarietyGuide from "@/components/CropVarietyGuide";
import { CUCUMBER_GUIDE, varietyMetadata } from "@/data/variety-guides";

export const metadata = varietyMetadata(CUCUMBER_GUIDE);

export default function Page() {
  return <CropVarietyGuide guide={CUCUMBER_GUIDE} />;
}
