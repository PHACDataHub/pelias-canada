require 'net/http'
require 'json'
require 'uri'
require 'base64'

@es_endpoint = ENV['ELASTIC_URL'] || 'https://default-elastic-url:9200/'
@username = ENV['ELASTIC_USERNAME'] || 'default_user'
@password = ENV['ELASTIC_PASSWORD'] || 'default_pass'
@es_index = ENV['ELASTIC_INDEX'] || 'pelias'

# Helper function to format large numbers
def as_val(s)
  s < 1_000 ? s :
  s >= 1_000_000_000_000 ? (s / 1_000_000_000_000.0).round(1).to_s + 'T' :
  s >= 1_000_000_000 ? (s / 1_000_000_000.0).round(1).to_s + 'B' :
  s >= 1_000_000 ? (s / 1_000_000.0).round(1).to_s + 'M' :
  (s / 1_000.0).round(1).to_s + 'K'
end

# Function to fetch data from Elasticsearch with basic authentication and error logging
def fetch_es(uri, data=nil, headers={})
  uri = URI.parse(uri.chomp('/'))  
  http = Net::HTTP.new(uri.host, uri.port)
  http.use_ssl = uri.scheme == 'https'
  http.verify_mode = OpenSSL::SSL::VERIFY_NONE

  request = Net::HTTP::Get.new(uri, headers)
  request.basic_auth(@username, @password) if @username && @password
  request.body = data if data

  begin
    response = http.request(request)
    return response if response.is_a?(Net::HTTPSuccess)
  rescue OpenSSL::SSL::SSLError => ssl_error
    puts "SSL Error while accessing #{uri}: #{ssl_error.message}"
  rescue => e
    puts "HTTP Request Failed while accessing #{uri}: #{e.message}"
  end
  nil
end

# Fetch and send total and layer-specific document counts
SCHEDULER.every '1m' do
  default_layers = %w(total address venue street country county dependency disputed localadmin locality macrocounty macroregion neighbourhood region postalcode)
  layer_counts = default_layers.map { |type| [type, { label: type, value: 0 }] }.to_h

  response = fetch_es("#{@es_endpoint}#{@es_index}/_count")
  if response
    layer_counts['total'][:value] = as_val(JSON.parse(response.body)['count'])
  end

  query = { aggs: { layers: { terms: { field: 'layer', size: 1000 } } }, size: 0 }
  response = fetch_es("#{@es_endpoint}#{@es_index}/_search?request_cache=true", query.to_json, { "Content-Type": "application/json" })
  if response
    JSON.parse(response.body)['aggregations']['layers']['buckets'].each do |result|
      layer = result['key']
      count = as_val(result['doc_count'])
      layer_counts[layer] = { label: layer, value: count }
    end
  end
  send_event('types-counts', items: layer_counts.values)
end


def fetch_cluster_health
  uri = "#{@es_endpoint}_cluster/health?pretty"
  begin
    response = fetch_es(uri)
    if response
      JSON.parse(response.body).tap do |data|
        puts "Fetched cluster health successfully: #{data}"
      end
    else
      raise "No response from Elasticsearch"
    end
  rescue JSON::ParserError => e
    puts "Error parsing JSON response: #{e.message}"
    puts "Raw response: #{response.body}"
    nil
  rescue StandardError => e
    puts "Failed to fetch cluster health data: #{e.message}"
    nil
  end
end

SCHEDULER.every '1m' do
  health_data = fetch_cluster_health

  if health_data
    items = health_data.map { |key, value| { label: key, value: value } }
    send_event('cluster_health', { items: items })
  else
    send_event('cluster_health', { items: [{ label: "Error", value: "Data unavailable" }] })
  end
end
