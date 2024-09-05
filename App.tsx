import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, Text, View } from 'react-native';
import Value from './src/components/Value';
import RingProgress from './src/components/RingProgress';
import useHealthData from './src/hooks/useHealthData';
import { useEffect, useState } from 'react';

export default function App() {
  const { steps, distance, flights, restingHeartRate, heartRate } =
    useHealthData();
  const [lastSteps, setLastSteps] = useState(0);
  console.log(
    `Steps: ${steps} | Distance: ${distance}m | Flights: ${flights} | RestingHeartRate: ${restingHeartRate} | heartRate: ${heartRate}`
  );
  useEffect(() => {
    if (steps - lastSteps >= 50) {
      Alert.alert('Has caminado 50 pasos más!');
      setLastSteps(steps); // Actualiza el valor de lastSteps
    }
  }, [steps, lastSteps]);
  return (
    <View style={styles.container}>
      <RingProgress progress={steps / 10000} />
      <View style={styles.values}>
        <Value label="Steps" value={steps.toString()} />
        <Value label="Distance" value={`${(distance / 1000).toFixed(2)} km`} />
        <Value label="Flights Climbed" value={flights?.toString()} />
        <Value label="Heart Rate" value={heartRate?.toString()} />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    padding: 12,
    alignItems: 'center',
    gap: 30,
  },
  values: {
    flexDirection: 'row',
    gap: 25,
    flexWrap: 'wrap',
  },
});
