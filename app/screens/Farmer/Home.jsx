import { View, Text } from 'react-native'
import React from 'react'

const Home = () => {
  return (
    <View>
      <Text>
        Dashboard (Home)

        Weather Forecast: Hourly/daily updates with alerts (e.g., rain, heatwaves).

        Crop Health Snapshot: IoT sensor data (soil moisture, pH) and AI alerts (e.g., "Irrigation needed tomorrow").

        Quick Actions: Buttons for disease scan, talkbot, or marketplace.
      </Text>
      <Text>
        Learn & Grow

        Video Tutorials: Short clips on organic farming, govt schemes, etc.

        Govt Schemes: Filterable list with eligibility checks and application guides.

        Community Forum: Share tips, ask questions, and join local farmer groups.
      </Text>
    </View>
  )
}

export default Home