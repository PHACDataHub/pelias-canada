# Accessiblity Scanning

Automated accessibility checks are incorporated into both the development process and the CI pipeline. This ensures that a subset of accessibility issues are caught early, allowing developers to fix them before they reach production. This is currently implimented as a soft gate, meaning the build may not fail on minor issues (at this time any issues). As the team and project matures, more tests will be added, and the strictness of the cut-off will be increased.

_It is important to note that this does not replace manual testing, and does not yet verify bilingualism._

We're using:

1. IDE Linting: Real-time accessibility feedback as the developer writes code with [axe Accessibility Linter](https://marketplace.visualstudio.com/items?itemName=deque-systems.vscode-axe-linter)
2. CI Linting: The [eslint-plugin-jsx-a11y](https://www.npmjs.com/package/eslint-plugin-jsx-a11y) plugin is a linter that checks JSX elements in React applications for accessibility issues and ensures that code follows best practices. This accessibility check is part of continuous integration, any errors with fail the build, preventing issues from making into production once the cut-off is increased.
3. Automated Static Analysis in CI - The scan is performed on rendered pages in the CI pipeline. We use puppeteer to login to the developement environent hosted site and crawl, scanning with the [axe-core](https://github.com/dequelabs/axe-core) accessibility testing engine.
4. Manual process: As automating testing cannot cover all accessibility considerations, we will be adding in manual process as well. #TODO

## To Run

### Locally

Do do this, you will need to have puppeteer and chromium installed - alternatively, you can run using the Docker without installing these in you dev environment - instructions in the next section.

```
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo apt install -y ./google-chrome-stable_current_amd64.deb

export PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome
```

1. Spin up the development environment from the root of the project:

```
cd frontend
npm install
npm run dev
```

2. Add a '.env' file in axe-testing - from root of the project:

```
cd devsecops/axe-testing

echo "HOMEPAGE_URL=http://127.0.0.1:3000/" > .env
echo RESULTS_DIR=./axe-results > .env
echo PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome > .env
```

3. Run the accessibility scan:
   (Note - you will need puppeteer installed on your system for this, alternatively, run using docker below.)

```
npm install
npm start
```

After run, confirm in debug images that it actually ran and didn't run into cloud workstation permsission errors, if you did - try the docker option.

OR run the accessibility scan using Docker container (this assumes the frontend is running):

```

cd axe-testing
npm run start:docker

```

<!-- docker build -t axe-scan .

docker run --rm \
 -e HOMEPAGE_URL=https://3000-my-workstation.cluster-5sn52swtxneecwkdgwfk2ddxuo.cloudworkstations.dev \
axe-scan -->

### Or run using docker compose

This runs the docker-compose.axe.yaml at the root of the project. (No need to start the front end separately.)

At the root,

```
docker compose -f docker-compose.axe.yaml up --build
```

When done, remove the volumes and ensure containers stopped:

```
docker compose -f docker-compose.axe.yaml down -v
```

### Or in GCP by manualy triggering Cloud Build

1. Change the GCP bucket in the [ui/cloudbuild.yaml](../ui/cloudbuild.yaml) file to one in your project.

2. Authenticate with your GCP project:

```

gcloud auth login

```

At the root of the project, run:

```

export BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)
export COMMIT_SHA=$(git rev-parse HEAD)
gcloud builds submit --config ./ui/cloudbuild.yaml --substitutions=BRANCH_NAME=$BRANCH_NAME,COMMIT_SHA=runOutSideOfGitTrigger-$COMMIT_SHA

```

This will first spin up a Docker Compose development environment, enabling interaction in a non-production setting, with the ability to by-pass the login.

Once the development envrionment is active, the accessibility scan will use a headless chrome browser to render and scan each page.

The results are then parsed and saved to file. When run with Cloud Build, the results are saved to a Google Cloud storage bucket for the dashboard to access.

This is triggered in the Continuous Integration as a step in the [ui/cloudbuild.yaml](../../ui/cloudbuild.yaml)

## Adding in exceptions

To bypass specific URLs or violation ids, the [axeignore.json](./axeignore.json) file is used to define exceptions.

## To Test

In the devescops/a11y directory:

```
npm run test:all:docker
```

### Or test in Cloud Build

From the root of safe-inputs, run:

```
gcloud builds submit --config ./devsecops/axe-testing/cloudbuild.yaml
```

This runs both the unit and end-to-end tests. The end to end test spins up a webserver with both an accessible and inaccessible pages to ensure the scan is behaving as expected.

Commit to GitHub in this directory (on any branch) will trigger the accessibility cloudbuild to run. This will run the tests on the accessibility testing code and save the test code coverage to a storage bucket. If any test fails, it will block the merge to main branch.

## Other Considerations

- Add tests for language, such as the inclusion of both French and English aria labels.
- Add tests for specific components or user flows.

## Other Resouces

- UK government accessibility testing
  https://design.sis.gov.uk/accessibility/testing/automated-testing

- Accessibiltiy checks - information found here - https://www.w3.org/TR/wai-aria/

- Other options (paid) intelligent guided tests into automated workflows for manual testing
  https://www.deque.com/blog/deque-introduces-three-new-features-to-advance-accessibility-test-automation/
  keyboard trap detections

Docker compose up --build
