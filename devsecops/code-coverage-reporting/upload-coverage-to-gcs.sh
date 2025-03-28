#!/usr/bin/env bash
set -o errexit
set -o pipefail
set -o nounset

# Install jq and bc
apt-get update && apt-get install -y jq bc

# Default values
CLOUDBUILD_DIR="error-occured"
COVERAGE_DIR="/workspace/coverage"
BRANCH_NAME="unknown_branch"
SHORT_SHA="unknown_sha"

#  Parse arguments and replace missing branch_name and short_sha in the case where this is run locally
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --cloudbuild-dir) 
            if [[ "$#" -gt 1 && $2 != --* ]]; then
                CLOUDBUILD_DIR="$2"; shift
            else
                echo "Error: Missing value for --cloudbuild-dir"; exit 1
            fi
            ;;
        --coverage-dir) 
            if [[ "$#" -gt 1 && $2 != --* ]]; then
                COVERAGE_DIR="$2"; shift
            else
                echo "Error: Missing value for --coverage-dir"; exit 1
            fi
            ;;
        --branch-name) 
            if [[ "$#" -gt 1 && $2 != --* ]]; then
                BRANCH_NAME="$2"; shift
            else
                BRANCH_NAME="unknown_branch"
            fi
            ;;
        --short-sha) 
            if [[ "$#" -gt 1 && $2 != --* ]]; then
                SHORT_SHA="$2"; shift
            else
                SHORT_SHA="unknown_sha"
            fi
            ;;
        *) 
            echo "Unknown parameter: $1"; exit 1
            ;;
    esac
    shift
done

BUCKET_NAME=pelias-devsecops-outputs-for-dashboard

# Generate a timestamp
timestamp=$(date +%s)

echo "Getting last commit's test coverage report..."

if gsutil ls "gs://${BUCKET_NAME}/test-coverage/${CLOUDBUILD_DIR}/" >/dev/null 2>&1; then
    last_commit_on_this_branch=$(gsutil ls "gs://${BUCKET_NAME}/test-coverage/${CLOUDBUILD_DIR}/" | grep "$BRANCH_NAME" | sort | tail -n 1 || echo "")
    if [[ -z "$last_commit_on_this_branch" ]]; then
        echo "No previous coverage reports found for branch: $BRANCH_NAME, Skipping coverage trend calculations."
    else
        echo "Last commit coverage report found: $last_commit_on_this_branch"

        # Download the last coverage report
        gsutil cp "$last_commit_on_this_branch" last_commit_coverage.json

        # Extract current and last coverage percentages
        this_coverage=$(jq -r '.total.statements.pct' "$COVERAGE_DIR/coverage-summary.json")
        last_coverage=$(jq -r '.total.statements.pct' last_commit_coverage.json)

        # Compare coverage
        echo "Current coverage: $this_coverage%"
        echo "Last coverage: $last_coverage%"
        coverage_difference=$(echo "$this_coverage - $last_coverage" | bc)
        echo "Coverage difference: $coverage_difference%"

        # Append the report with the coverage difference
        jq ". + {\"difference_from_last_commit\": {\"statements_pct\": $coverage_difference}}" \
            "$COVERAGE_DIR/coverage-summary.json" > "$COVERAGE_DIR/updated-coverage-summary.json"
        mv "$COVERAGE_DIR/updated-coverage-summary.json" "$COVERAGE_DIR/coverage-summary.json"
    fi
else
    echo "The path gs://${BUCKET_NAME}/test-coverage/${CLOUDBUILD_DIR}/ does not exist."
    echo "Skipping coverage trend calculations."
fi

# Format the report
echo "Formatting coverage report..."
jq '.' "$COVERAGE_DIR/coverage-summary.json" > "$COVERAGE_DIR/coverage-pretty.json"

# Copy the coverage report to GCS bucket
echo "Copying coverage report to GCS bucket: gs://${BUCKET_NAME}/test-coverage/${CLOUDBUILD_DIR}/${BRANCH_NAME}__${timestamp}__${SHORT_SHA}.json"
gsutil -m cp -r "$COVERAGE_DIR/coverage-pretty.json" \
    "gs://${BUCKET_NAME}/test-coverage/${CLOUDBUILD_DIR}/${BRANCH_NAME}__${timestamp}__${SHORT_SHA}.json"
