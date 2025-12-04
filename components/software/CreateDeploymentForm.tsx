"use client";

import { DeploymentRolloutStrategy, Package, DeviceGroup } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState, useTransition, FormEvent } from "react";

type Props = {
  packages: Package[];
  deviceGroups: DeviceGroup[];
};

export function CreateDeploymentForm({ packages, deviceGroups }: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [packageId, setPackageId] = useState(packages[0]?.id ?? "");
  const [deviceGroupId, setDeviceGroupId] = useState(deviceGroups[0]?.id ?? "");
  const [rolloutStrategy, setRolloutStrategy] = useState<DeploymentRolloutStrategy>("all_at_once");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const canSubmit = name && packageId && deviceGroupId;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;
    setError("");
    startTransition(async () => {
      const res = await fetch("/api/deployments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, packageId, deviceGroupId, rolloutStrategy }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Deployment konnte nicht angelegt werden.");
        return;
      }
      setName("");
      router.refresh();
    });
  };

  return (
    <form
      onSubmit={submit}
      className="flex flex-wrap items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
    >
      <input
        required
        placeholder="Deployment Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="min-w-[200px] flex-1 bg-transparent px-2 py-1 text-sm text-zinc-100 outline-none"
      />
      <select
        value={packageId}
        onChange={(e) => setPackageId(e.target.value)}
        className="rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs"
      >
        {packages.map((pkg) => (
          <option key={pkg.id} value={pkg.id}>
            {pkg.name} ({pkg.version})
          </option>
        ))}
      </select>
      <select
        value={deviceGroupId}
        onChange={(e) => setDeviceGroupId(e.target.value)}
        className="rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs"
      >
        {deviceGroups.map((group) => (
          <option key={group.id} value={group.id}>
            {group.name}
          </option>
        ))}
      </select>
      <select
        value={rolloutStrategy}
        onChange={(e) => setRolloutStrategy(e.target.value as DeploymentRolloutStrategy)}
        className="rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs"
      >
        <option value="all_at_once">all_at_once</option>
        <option value="ring">ring</option>
        <option value="scheduled">scheduled</option>
      </select>
      <button
        type="submit"
        disabled={pending || !canSubmit}
        className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-emerald-950 hover:bg-emerald-400 disabled:opacity-60"
      >
        Deploy
      </button>
      {error && <span className="text-[11px] text-rose-400">{error}</span>}
    </form>
  );
}
