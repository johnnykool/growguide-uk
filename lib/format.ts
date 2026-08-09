export function formatCropCount(count: number): string {
  return `${count} ${count === 1 ? "crop" : "crops"}`;
}
