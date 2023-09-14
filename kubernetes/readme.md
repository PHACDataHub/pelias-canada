# set up kubernetes in GCP via Pulumi

```bash
mkdir pelias-can && cd pelias-can
pulumi new kubernetes-gcp-python

#source .env to access environment variable to use kompose to convert docker compose yaml to kubernetes resources
set -a
source .env
```
<!---
Translate a Docker Compose File to Kubernetes Resources

docker-compose config > docker-compose-resolved.yaml && kompose convert -f docker-compose-resolved.yaml --volumes hostPath

kubectl apply -f all-the-yaml-files

For more information, follow this link: https://kubernetes.io/docs/tasks/configure-pod-container/translate-compose-kubernetes/

--->


