import { Construction } from "lucide-react";

export default function Placeholder({ title }: { title: string }) {
  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-96 gap-3 text-gray-400">
      <Construction className="w-10 h-10" />
      <div className="text-lg font-medium">{title}</div>
      <div className="text-sm">화면 구현 예정</div>
    </div>
  );
}
