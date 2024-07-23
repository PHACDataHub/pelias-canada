library(httr)
library(jsonlite)
library(dplyr)
library(readr)

# Function to fetch reverse geocoding data with validation and maximum distance
reverse_geocode <- function(lat, lon, max_distance_km = 2.5) {
  if (!(lat >= -90 && lat <= 90) || !(lon >= -180 && lon <= 180)) {
    print(paste("Invalid latitude (", lat, ") or longitude (", lon, "). Skipping.", sep = ""))
    return(NULL)
  }

  base_url <- "https://geocoder.alpha.phac.gc.ca/api/v1/reverse"
  params <- list(
    `point.lat` = lat,
    `point.lon` = lon,
    `maxDistance` = max_distance_km * 1000 # Convert km to meters
  )

  # Construct URL with query parameters
  url <- paste0(base_url, "?", paste(names(params), unlist(params), sep = "=", collapse = "&"))

  print(paste("Request URL: ", url)) # Debugging line

  tryCatch(
    {
      response <- GET(url)
      stop_for_status(response)
      return(fromJSON(content(response, "text", encoding = "UTF-8"), flatten = TRUE))
    },
    error = function(e) {
      print(paste("Failed to fetch geocoding data: ", e$message, sep = ""))
      return(NULL)
    }
  )
}

# Function to prioritize and rank features
prioritize_features <- function(features_df) {
  if (nrow(features_df) == 0) {
    return(NULL)
  }

  # Ensure coordinates are handled correctly
  features_df <- features_df %>%
    mutate(
      lat = sapply(geometry.coordinates, function(coord) if (length(coord) == 2) coord[2] else NA),
      lon = sapply(geometry.coordinates, function(coord) if (length(coord) == 2) coord[1] else NA)
    )

  sorted_features <- features_df %>%
    arrange(desc(properties.confidence), properties.distance)

  top_feature <- sorted_features[1, ]

  if (is.null(top_feature$lat) || is.null(top_feature$lon)) {
    print("Error: Coordinates are missing in the top feature.")
    return(NULL)
  }

  result <- list(
    ddLat = as.character(top_feature$lat),
    ddLong = as.character(top_feature$lon),
    name = top_feature$properties.name,
    housenumber = top_feature$properties.housenumber,
    confidence = top_feature$properties.confidence,
    distance = top_feature$properties.distance,
    accuracy = top_feature$properties.accuracy,
    country = top_feature$properties.country,
    region = top_feature$properties.region,
    region_a = top_feature$properties.region_a,
    county = top_feature$properties.county,
    county_gid = top_feature$properties.county_gid,
    locality = top_feature$properties.locality,
    neighbourhood = top_feature$properties.neighbourhood,
    label = top_feature$properties.label
  )

  return(result)
}

# Function to calculate total confidence levels
calculate_total_confidence <- function(features_df) {
  confidence_data <- c("0.0-0.5" = 0, "0.5-0.8" = 0, "0.8-0.95" = 0, "1.0" = 0)

  features_df <- features_df %>%
    mutate(confidence = as.numeric(properties.confidence)) # Ensure confidence is numeric

  for (i in 1:nrow(features_df)) {
    confidence <- features_df$confidence[i]
    if (confidence >= 1.0) {
      confidence_data["1.0"] <- confidence_data["1.0"] + 1
    } else if (confidence >= 0.8) {
      confidence_data["0.8-0.95"] <- confidence_data["0.8-0.95"] + 1
    } else if (confidence >= 0.5) {
      confidence_data["0.5-0.8"] <- confidence_data["0.5-0.8"] + 1
    } else if (confidence >= 0.0) {
      confidence_data["0.0-0.5"] <- confidence_data["0.0-0.5"] + 1
    }
  }

  return(confidence_data)
}

calculate_match_rate <- function(confirmed_count, submitted_count) {
  if (submitted_count > 0) {
    return(confirmed_count / submitted_count * 100)
  } else {
    return(0.0)
  }
}

classify_accuracy <- function(confidence) {
  if (confidence >= 1.0) {
    return("100%")
  } else if (confidence >= 0.8) {
    return("80%-99.999%")
  } else if (confidence >= 0.5) {
    return("50%-79.999%")
  } else if (confidence >= 0.1) {
    return("0.1%-49.999%")
  } else {
    return("No Match")
  }
}

# Function to process CSV and save results
process_csv <- function(input_file, output_file) {
  df <- read_csv(input_file, show_col_types = FALSE)
  results <- list()
  total_confidence <- c("0.0-0.5" = 0, "0.5-0.8" = 0, "0.8-0.95" = 0, "1.0" = 0)
  confirmed_count <- 0
  submitted_count <- nrow(df)
  match_accuracy <- c("100%" = 0, "80%-99.999%" = 0, "50%-79.999%" = 0, "0.1%-49.999%" = 0, "No Match" = 0)

  for (i in 1:nrow(df)) {
    row <- df[i, ]
    if (!is.na(row$ddLat) && !is.na(row$ddLong)) {
      lat <- as.numeric(row$ddLat)
      lon <- as.numeric(row$ddLong)

      if (!(lat >= -90 && lat <= 90) || !(lon >= -180 && lon <= 180)) {
        print(paste("Invalid latitude (", lat, ") or longitude (", lon, ") in row ", i, ". Skipping.", sep = ""))
        next
      }

      geocoding_data <- reverse_geocode(lat, lon, max_distance_km)

      if (!is.null(geocoding_data)) {
        features_df <- geocoding_data$features
        if (is.data.frame(features_df)) {
          print(str(features_df)) # Debugging line to check the structure
          result <- prioritize_features(features_df)

          if (!is.null(result)) {
            result$RowNumber <- as.character(i)
            results <- append(results, list(result))

            # Update total confidence levels and confirmed count
            confidence_data <- calculate_total_confidence(features_df)
            total_confidence <- total_confidence + confidence_data

            if (as.numeric(result$confidence) >= 1.0) {
              confirmed_count <- confirmed_count + 1
            }

            accuracy_label <- classify_accuracy(as.numeric(result$confidence))
            match_accuracy[accuracy_label] <- match_accuracy[accuracy_label] + 1
          }
        } else {
          print("Unexpected format for features data")
        }
      }
    }
  }

  match_rate <- calculate_match_rate(confirmed_count, submitted_count)

  output_df <- bind_rows(results)
  write_csv(output_df, output_file)

  epoch_time <- as.integer(Sys.time())
  metadata_file <- paste0(gsub(".csv", "", output_file), "_meta.csv")

  metadata_df <- data.frame(
    Metadata_Information = c(
      paste("Epoch Time", epoch_time),
      paste("Match Rate", paste0(confirmed_count, "/", submitted_count, " (", match_rate, "%)")),
      paste("Total Requests", submitted_count),
      paste("100% Match", match_accuracy["100%"]),
      paste("80%-99.999% Match", match_accuracy["80%-99.999%"]),
      paste("50%-79.999% Match", match_accuracy["50%-79.999%"]),
      paste("0.1%-49.999% Match", match_accuracy["0.1%-49.999%"]),
      paste("No Match", match_accuracy["No Match"]),
      paste("Coordinate System", "WGS 1984"),
      paste("Maximum Search Distance (km)", max_distance_km)
    ),
    stringsAsFactors = FALSE
  )

  # Ensure directory exists
  output_dir <- dirname(output_file)
  if (!dir.exists(output_dir)) {
    dir.create(output_dir, recursive = TRUE)
  }

  write_csv(metadata_df, metadata_file)

  output_csv <- paste0(gsub(".csv", "", output_file), "_", epoch_time, ".csv")
  write_csv(output_df, output_csv)

  print(paste("Output CSV file saved as ", output_csv, sep = ""))
  print(paste("Metadata file saved as ", metadata_file, sep = ""))
}

# Prompt for user input in Posit Cloud
print("Upload the input CSV file:")
input_file <- file.choose()

print("Please enter the name of the output CSV file (without extension):")
output_file_name <- readline()

output_dir <- "/content"
max_distance_km <- 2.5

process_csv(input_file, paste0(output_file_name, ".csv"))
