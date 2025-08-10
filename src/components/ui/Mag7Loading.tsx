import { useRive } from "@rive-app/react-canvas";

const mag7Loading = "/rive/mag7-loading.riv";

export function Mag7Loading({ className }: { className: string }) {
  const { RiveComponent } = useRive({
    src: mag7Loading,
    autoplay: true,
  });
  return <RiveComponent className={className} />;
}
