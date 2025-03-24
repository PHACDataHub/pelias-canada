# DevSecOps

## Pipelines

### Main [Cloud Build](../cloudbuild.yaml)

- Will be triggered on any change to the codebase. (Commits to PR)
- Installs dependencies
- Prettier check
- Eslint check
- Extracts SBOM if 'main' branch

### GitHub Actions

- Triggered on commits to a PR
- CodeQL

### Code Modules Specific Pipelines

#### Front End

#### Vulnerabilities
