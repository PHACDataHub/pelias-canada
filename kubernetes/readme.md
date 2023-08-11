# set up kubernetes in GCP via Pulumi

```bash
mkdir pelias-can && cd pelias-can
pulumi new kubernetes-gcp-python

#source .env to access environment variable to use kompose to convert docker compose yaml to kubernetes resources
set -a
source .env
```
