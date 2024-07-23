# Check if packages are installed; if not, install them
if (!requireNamespace("httr", quietly = TRUE)) {
    install.packages("httr")
}

if (!requireNamespace("jsonlite", quietly = TRUE)) {
    install.packages("jsonlite")
}

if (!requireNamespace("readr", quietly = TRUE)) {
    install.packages("readr")
}

# Load necessary libraries
library(httr)
library(jsonlite)
library(readr)

# Function to geocode address using the API endpoint
geocode_address <- function(address) {
    url <- paste0("https://geocoder.alpha.phac.gc.ca/api/v1/search?text=", URLencode(address))
    response <- GET(url)
    if (status_code(response) == 200) {
        data <- content(response, "text", encoding = "UTF-8")
        data <- fromJSON(data, simplifyVector = FALSE)
        if ("features" %in% names(data)) {
            feature <- data$features[[1]]
            coordinates <- feature$geometry$coordinates
            score <- feature$properties$confidence
            match_type <- feature$properties$match_type
            source <- feature$properties$source
            return(list(coordinates = coordinates, score = score, match_type = match_type, source = source))
        }
    }
    return(list(coordinates = NULL, score = NULL, match_type = NULL, source = NULL))
}

# Function to process CSV file and geocode addresses
process_csv <- function(input_filename, output_filename) {
    df <- read_csv(input_filename, col_types = cols(.default = "c")) # Read CSV file
    output_data <- data.frame(
        RowID = integer(), Epoch = integer(), Accuracy = numeric(),
        MatchType = character(), Source = character(),
        Latitude = numeric(), Longitude = numeric()
    )
    for (i in seq_len(nrow(df))) {
        address <- df[i, "PHYSICAL ADDRESS"]
        line_id <- df[i, "id"] # Assuming 'id' column exists
        geocode_result <- geocode_address(address)
        if (!is.null(geocode_result$coordinates)) {
            latitude <- geocode_result$coordinates[[2]]
            longitude <- geocode_result$coordinates[[1]]
            score <- geocode_result$score
            match_type <- geocode_result$match_type
            source <- geocode_result$source
            epoch <- as.integer(Sys.time())
            # Append data to output_data
            new_row <- data.frame(
                RowID = line_id, Epoch = epoch, Accuracy = score,
                MatchType = match_type, Source = source,
                Latitude = latitude, Longitude = longitude
            )
            output_data <- rbind(output_data, new_row)
            cat(sprintf(
                "Address: %s, ID: %s, Latitude: %f, Longitude: %f, Score: %f, Match Type: %s, Source: %s\n",
                address, line_id, latitude, longitude, score, match_type, source
            ))
        } else {
            cat(sprintf("Failed to geocode address: %s\n", address))
        }
    }
    # Write output_data to CSV with headers
    write.csv(output_data, file = output_filename, row.names = FALSE)
}

# Choose input CSV file interactively from local computer
input_filename <- file.choose()

# Check if a file was selected
if (is.null(input_filename)) {
    stop("No input file selected.")
}

# Choose output CSV file interactively from local computer
output_filename <- file.choose(new = TRUE)

# Check if a file was selected
if (is.null(output_filename)) {
    stop("No output file selected.")
}

# Call the function to process the selected CSV file
process_csv(input_filename, output_filename)
