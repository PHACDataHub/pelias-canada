import React, { useState } from 'react'
import { GcdsButton } from '@cdssnc/gcds-components-react'
import '@cdssnc/gcds-components-react/gcds.css' // Import the CSS file if necessary

export default function APIfetch() {
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [responseData, setResponseData] = useState(null)

  const sendRequest = (fullAddress) => {
    setLoading(true) // Set loading state to true when request is initiated
    const url = `https://geocoder.alpha.phac.gc.ca/api/search?text=${encodeURIComponent(
      fullAddress,
    )}`

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setResponseData(data) // Update state with response data
        setLoading(false) // Set loading state to false when request is completed
      })
      .catch((error) => {
        console.error('Error:', error)
        setLoading(false) // Set loading state to false when request encounters an error
      })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    sendRequest(address)
    setAddress('')
  }

  return (
    <>
      <div style={{ padding: '40px' }}>
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            alignItems: 'center',
          }}
        >
          <label> Please enter an address, city, and province </label>
          <input
            required
            width="400px"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="110 Laurier Ave W, Ottawa, On"
          />
          <GcdsButton type="submit" buttonId="submit">
            {loading ? 'Loading...' : 'Search'}
          </GcdsButton>
        </form>
      </div>

      {responseData && <>{JSON.stringify(responseData, null, 2)}</>}
    </>
  )
}
