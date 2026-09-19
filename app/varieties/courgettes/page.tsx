import CropVarietyGuide from "@/components/CropVarietyGuide";
import { COURGETTE_GUIDE, varietyMetadata } from "@/data/variety-guides";

export const metadata = varietyMetadata(COURGETTE_GUIDE);

export default function Page() {
  return <CropVarietyGuide guide={COURGETTE_GUIDE} />;
}
