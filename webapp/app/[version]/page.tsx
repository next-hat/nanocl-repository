import { notFound } from "next/navigation";
import SearchableList from "../../components/SearchableList";

type PageProps = {
  params: Promise<{ version: string }>
  searchParams: Promise<{ data: string }>
}

export default async function VersionPage({ params, searchParams }: PageProps) {
  const { version } = await params;
  const sParams = await searchParams;
  if (!sParams.data) return notFound();
  const data = JSON.parse(sParams.data);
  if (!data) return (<div className="text-red-600">Version not found</div>);
  const list = Object.values(data.statefiles);
  return (
    <div className="space-y-6">
      <h1 className="text-4xl text-center font-semibold">Nanocl Registry</h1>
      <h2 className="text-2xl text-center font-medium">{version}</h2>
      <h3 className="text-lg text-center font-medium text-muted-foreground">
        Browse and deploy production-ready Statefiles for Nanocl
      </h3>
      <SearchableList items={list as any} version={version} />
    </div>
  );
}
