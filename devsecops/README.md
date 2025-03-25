# DevSecOps

## IDE Plugins and Tools

### Eslint Security and Accessibility Plugin

TBC

### axe-core Accessibility Plugin

TBC

## Separation of CI from CD

The Continuous Integration (CI) has been split from the Continuous Delivery (CD). The CD process, uses FluxCD and Cloud Build, uses the pull model where “production" pulls in the images. This eliminates the need for production credentials to be stored in the pipelines. CI pipelines do not have credentials for production (avoiding attacks like the one that happened at Codecov) and are focused running tests and building OCI images.

## Continuous Integration Pipelines

### Main [Cloud Build](../cloudbuild.yaml)

- Will be triggered on any change to the codebase. (Commits to PR)
- Installs dependencies
- Prettier check
- Eslint check
- Extracts SBOM if 'main' branch

<!-- ### GitHub Actions

- Triggered on commits to a PR
- CodeQL
 -->

### Code Modules Specific Pipelines

#### FrontEnd

TBC

#### Vulnerability Cloud Function

TBC

## Infrastructure as Code

- Currently using both [Taskfile](../Taskfile.yaml) and [acm-core](https://github.com/PHACDataHub/acm-core/tree/main/DMIA-PHAC/Experimentation/ph-peliasgeocoderdeploy). The acm-core repository is where the core infrastructure and project are provisioned. The Taskfile currently outlines additional resources, service accounts and permissions.
- Versioned in GitHub
- Using service accounts with the least priviledges

<!-- ## Vunerability Scanning

Scanning for vulnerabilities using third-party tools in CI is limited to the time of commit. Since both Dependabot/Renovate and Artifact Registry both already scan for vunerabilities continuously, we can use these assess risk.

### Continuous Scanning with Renovate and Dependabot

[Renovate](https://docs.renovatebot.com/) continuously scans the source code in GitHub, which will include any development dependencies, for vulnerabilities. Renovate will automatically create PRs with patches and update these dependencies.

### [Automatic Artifact Registry Vunerability Scans](./artifact-registry-vulnerability-scanning)

Artifact Registry stores container images that are used by GCP services. When the container analysis service is turned on, Artifact Registry checks for vunerabilities multiple times a day, then publishes occurances (i.e. discovery, package, vunerability) to Pub/Sub which can be monitored.

As we're looking to access these vunerabilities through an external (non-public) DevSecOps dashboard, we're using a cloud function to filter the occurances, then save the vunerabilities to a storage bucket that the dashboard will have access to. -->

<!-- ### TODO Cluster scanning

TBA -->

## Code Quality and Code Reviews

TBA

- Main branch requires peer review before merge
- GitHub actions ensure complys with linting and code quality checks (CodeQL)
- Any changes to IaC code requires

## Deployment Frequency - Enabled with Test Coverage

TBA

## [Software Bill of Materials (SBOM) Collection](./sbom)

An SBOM provides a detailed inventory of all components, libraries, and dependencies within a software application. We scan the application in the main Cloud Build pipeline to maintain an up-to-date bill of materials for everything included in the software from the GitHub repository, which is updated on every push to the main branch. This will enables quicker impact assesments to incidents, such as the [Log4j vunerability](https://en.wikipedia.org/wiki/Log4Shell), and helps ensure adherence to security compliance requirements.

We selected [Syft](https://github.com/anchore/syft), an open source tool, for SBOM generation because it is more comprehensive than [Trivy](https://aquasecurity.github.io/trivy/v0.33/docs/sbom/), and using [GCP Artifact Registry SBOM](https://cloud.google.com/artifact-analysis/docs/sbom-overview) would exclude libraries used only in developement. (#TODO add source).

The SBOM results are saved to a Google Cloud Storage bucket using the Commit SHA as part of the filename.

While Syft includes licenses in the SBOM, we may also add a [specific license risk scan](https://aquasecurity.github.io/trivy/v0.47/docs/scanner/license/) to more easily flag conflicts and/or risks in the future.
