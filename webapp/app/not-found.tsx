import Link from "next/link";

export default async function NotFound() {
	return (
		<div className="flex min-h-[60vh] items-center justify-center">
			<div className="mx-auto w-full max-w-2xl text-center">
				<div className="mb-6 inline-flex items-center gap-3 rounded-full border px-3 py-1 text-xs text-muted-foreground">
					<span className="inline-block h-2 w-2 rounded-full bg-destructive" aria-hidden />
					404 · Page not found
				</div>
				<h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
					We couldn't find that page
				</h1>
				<p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
					The link may be broken or the page might have moved. Try heading back
					home or browse the latest Nanocl registry.
				</p>

				<div className="mt-6 flex flex-wrap items-center justify-center gap-3">
					<Link
						href="/"
						className="inline-flex items-center justify-center rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
					>
						Go to homepage
					</Link>
				</div>
				<p className="mt-10 text-xs text-muted-foreground">
					Tip: Press <kbd className="rounded bg-muted px-1">Ctrl</kbd>+<kbd className="rounded bg-muted px-1">K</kbd> to search anywhere.
				</p>
			</div>
		</div>
	);
}

