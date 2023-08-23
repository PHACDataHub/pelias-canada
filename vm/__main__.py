"""A Google Cloud Python Pulumi program"""

import pulumi
import pulumi_gcp as gcp

# Create the VPC.
network = gcp.compute.Network(
    "network",
    auto_create_subnetworks=False,
    routing_mode="REGIONAL"
)

# Create a Subnetwork within the VPC.
subnetwork = gcp.compute.Subnetwork(
    "subnetwork",
    network=network.self_link,
    ip_cidr_range="10.2.0.0/16",
    region="northamerica-northeast1"
)

# Allow SSH access.
firewall = gcp.compute.Firewall(
    "allow-ssh-http-https",
    network=network.self_link,
    allows=[
        {
            "protocol": "tcp",
            "ports": ["22", "80", "443", "8080"]
        }
    ],
    target_tags=["allow-ssh-http-https"],
    source_ranges=["0.0.0.0/0"]
)

# Create a static IP address.
static_ip = gcp.compute.Address(
    "static-ip",
    region="northamerica-northeast1"
)

# Assume existing managed zone
# TODO: needs to be changed into the new managed zone
dl_phac_alpha_existing_managed_zone = gcp.dns.ManagedZone.get(
    "dl-phac-alpha-canada-ca",
    "5975330339948395253"
)

# Create a DNS record for the static IP
# TODO: need to have new dns
dns_record = gcp.dns.RecordSet(
    "demo-dhis2-dns-record",
    name="demo.dhis2.dl.phac.alpha.canada.ca.",
    type="A",
    ttl=300,
    managed_zone=dl_phac_alpha_existing_managed_zone.name,
    rrdatas=[static_ip.address]
)

# Find Ubuntu 22.04 LTS image.
# gcloud compute images list --filter="family~'ubuntu-2204-lts'"
image = gcp.compute.get_image(
    project="ubuntu-os-cloud",
    family="ubuntu-2204-lts"
)

# Install Docker and give SSH access via Metadata.
# This docker install is not recommended for production.
startup_script = """#!/bin/bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
ufw allow 22
"""

# Create the VM Instance.
instance = gcp.compute.Instance(
    "vm-instance",
    zone="northamerica-northeast1-a",
    machine_type="e2-standard-4",  # 4 vCPU, 16 GB memory
    boot_disk={
        "initialize_params": {
            "image": image.self_link,
            "size": 100,  # 100GB disk
            "type": "pd-ssd"
        }
    },
    network_interfaces=[
        {
            "network": network.self_link,
            "subnetwork": subnetwork.self_link,
            "access_configs": [
                {
                    "nat_ip": static_ip.address
                }
            ]
        }
    ],
    metadata_startup_script=startup_script,
    # This is a network tag (used in the firewall rule)
    tags=["allow-ssh-http-https"]
)

# Export instance name and zone.
pulumi.export("instanceName", instance.name)
pulumi.export("instanceZone", instance.zone)
# Export instance external IP.
pulumi.export("externalIP", static_ip.address)
pulumi.export("dnsRecordName", dns_record.name)
