## Nanocl Registry – Next.js + Express

A simple registry browser for Nanocl statefiles. Serves HTML for browsers and raw YAML for Nanocl clients (based on User-Agent).

### Run locally

1. Install dependencies
2. Start the custom Express server

Args or environment variables:
- argv[2] or NANOCL_REGISTRY_PATH: path to base folder (default: /folder)
- argv[3] or NANOCL_LATEST_VERSION: latest Nanocl version (default: v0.17)

Routes
- / -> redirects to /{latest}
- /v0.xx -> version list page
- /v0.xx/{state} -> documentation page (Nanocl UA gets raw YAML)
- /tag/{tag} -> tag page (latest version by default)

Expected folder structure
```
/folder/{nanocl_version}/{statefilename}/{statefile_version}/
	.metadata.json                 # { "latest_version": "0.1.0" }
	{statefile_version}.yml        # YAML with Metadata: { Name, Tags, About, LongAbout }
```

Notes
- Data is loaded once at server startup and cached in memory per version.
