# Use an official Ruby runtime as a parent image
FROM ruby:3.0

# Install dependencies
RUN apt-get update && apt-get install -y nodejs

# Install Smashing and specific Bundler version
RUN gem install smashing
RUN gem install bundler -v '1.17.2'  # Match the version required by your Gemfile.lock

# Set the working directory to /dashboard in the container
WORKDIR /dashboard

# Copy the Gemfile and Gemfile.lock into the container at /dashboard
COPY Gemfile* /dashboard/

# Install any needed packages specified in Gemfile
RUN bundle _1.17.2_ install  # Use the underscore to specify the exact Bundler version

# Copy the main application
COPY . /dashboard

# Make port 3030 available to the world outside this container
EXPOSE 3030

# Environment variables
ENV ELASTIC_URL="https://default-elastic-url:9200/"
ENV ELASTIC_USERNAME="elastic"
ENV ELASTIC_PASSWORD="elastic_password"
ENV ELASTIC_INDEX="demo-index"

# Run Smashing when the container launches
CMD ["smashing", "start"]
