# Pelias Geocoding Services

This repository contains files for an in-house instance of Pelias Geocoder, hosted entirely on Kubernetes. Pelias Geocoder resolves human-readable civic addresses and anchors them to precise locations on Earth.  
&nbsp;&nbsp;&nbsp;&nbsp;**Think**: Putting pins on maps from your Excel sheet, but way faster than you can look them up one-by-one.

This is facilitated by a frontend interface for easy uploading of Excel files and retrieval of geolocations.

An in-house instance helps avoid per-use costs that are incurred with third party services. There are no privacy risks or breach of data provider agrements when geolocating point addresses.

## Directory structure

```cmd
├── Taskfile.yaml      # Defines tasks for setting up infrastructure and configuring services
├── dashboard          # Web App for Showing a Summary of Documents and Elasticsearch (ES) Cluster Details, Including Status
│   └── ...
├── frontend           # Web App for Geolocation Fetching
│   └── ...
├── k8s                # Kubernetes Configurations for Hosting Architecture and Data Importing
│   └── ...
```

## Getting Started

Before you get started with this project, modify the environment variables in the Taskfile.yaml to match the project and other configurations as required. It is also assumed that you have gcloud installed and setup with the associated GCP account.
To get started, follow these steps:

1. **Set Up a Kubernetes Cluster**: Use a cloud provider like Google Cloud Platform (GCP) to create a Kubernetes cluster.

```cmd
task infra-up
```

2. Connect to the Cluster: Once the cluster is created, you'll need to connect to it using kubectl. Ensure you have kubectl configured to interact with your cluster.

```cmd
gcloud container clusters get-credentials <cluster-name> --zone=<zone>
```

3. Install anthos service mesh on the cluster for istio.

```cmd
task install-asm
```

4. Install Flux

```cmd
task install-flux
```

This step assumes that you have ssh setup on your machine. The key generated (and saved in the kubernetes cluster) will be printed on the screen. This will have to added as an deploy key in the repo used for project.

While flux will reconcile and bring up the apis and the elasticsearch operator and cluster, data importer jobs have to be run for the services to be green and ready. Since the apis depend on the same data volume, we've created two new volume claims and sync between teh two through a job in k8s/geocoder/data-importers/volume-cm/volume-copy-job.yaml. It would just be easier to deploy the elastic operator and elasticsearch cluster, and run the data-importers before bringing up the apis. This can be done with the following.  
**Note:** If you don't have `kustomize` installed, use `kubectl kustomize`.

```cmd
kustomize build k8s/elastic-operator/crds | kubectl apply -f
kustomize build k8s/elastic-operator | kubectl apply -f

kustomize build k8s/geocoder/elasticsearch | kubectl apply -f
```

Flux can then be installed to start syncing with the repo. (The apis still won't start without importing data).

## Importing Data

The manifest for the data importers and related jobs can be found in the path k8s/geocoder/data-importers

### Pre-Import Steps

1. **Volumes Configuration**

   - **Pelias ConfigMap**: Creates a ConfigMap containing Pelias configuration.
   - **Pelias Persistent Volume Claim (PVC)**: Defines the data volume to be used for Pelias.

2. **Volume Synchronization Job**

   - **Volume Copy Job**: Creates two new volumes and syncs data from the Pelias PVC volume called data-volume so that multiple pods can use the same volume.

3. **Pre-Import Steps**
   - **Schema Job**: Creates the Pelias index on Elasticsearch. This step prepares the Elasticsearch index for importing data by defining its schema and structure.

### Data Importers (in order)

1. **WhosOnFirst Importer**

   - Downloads data from the WhosOnFirst source and writes it to Elasticsearch to index Pelias.

2. **OpenStreetMap Importer**

   - Downloads data from OpenStreetMap and writes it to Elasticsearch to index Pelias.

3. **OpenAddresses Importer**

   - Downloads data from OpenAddresses and writes it to Elasticsearch to index Pelias.

4. **Polylines Importer**
   - Creates a file with polylines and writes it to Elasticsearch to index Pelias.

### Data Preparation Importers

1. **Interpolation Importer**

   - Prepares data and SQLite files for the interpolation API.

2. **Placeholder Importer**
   - Prepares data and SQLite files for the placeholder API.
