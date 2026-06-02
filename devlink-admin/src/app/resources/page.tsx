import { Hammer } from "lucide-react";

export default function ResourcesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Resources</h1>
        <p className="text-text-muted mt-1">Host shared assets, brand kits, and document templates.</p>
      </div>
      <div className="glass-panel p-12 flex flex-col items-center justify-center text-center mt-8">
        <Hammer className="w-12 h-12 text-primary mb-4 animate-pulse" />
        <h3 className="text-lg font-semibold text-text-primary mb-2">Under Construction</h3>
        <p className="text-text-muted max-w-sm">We are actively building this feature. Check back soon for updates!</p>
      </div>
    </div>
  );
}
