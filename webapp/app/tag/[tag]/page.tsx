import { notFound } from "next/navigation";

import SearchableList from "@/components/SearchableList";

export default async function TagPage({ params, searchParams }: { params: { tag: string }, searchParams: any }) {
  const { tag } = await params;
  const sParams = await searchParams;
  if (!sParams.data) return notFound();
  const list = JSON.parse(sParams.data);
  return (
    <div className="space-y-6">
    <h1 className="text-4xl text-center font-semibold">Nanocl Registry</h1>
      <h2 className="text-2xl text-center font-medium">{sParams.version}</h2>
      <h3 className="text-lg text-center font-medium text-muted-foreground">
        {tag}
      </h3>
      <SearchableList items={list as any} version={sParams.version} />
    </div>
  );
}
