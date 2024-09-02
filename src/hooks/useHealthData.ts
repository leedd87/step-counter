import { useEffect, useState } from 'react';
import { Platform, NativeEventEmitter, NativeModules } from 'react-native';
import AppleHealthKit, {
  HealthInputOptions,
  HealthKitPermissions,
  HealthUnit,
} from 'react-native-health';

const { Permissions } = AppleHealthKit.Constants;

const permissions: HealthKitPermissions = {
  permissions: {
    read: [
      Permissions.Steps,
      Permissions.FlightsClimbed,
      Permissions.DistanceWalkingRunning,
      Permissions.HeartRate,
      Permissions.RestingHeartRate,
    ],
    write: [],
  },
};

const useHealthData = () => {
  const [steps, setSteps] = useState(0);
  const [flights, setFlights] = useState(0);
  const [distance, setDistance] = useState(0);
  const [restingHeartRate, setRestingHeartRate] = useState(0);
  const [heartRate, setHeartRate] = useState(0);

  // HealthKit implementation
  const [hasPermissions, setHasPermission] = useState(false);

  useEffect(() => {
    new NativeEventEmitter(NativeModules.AppleHealthKit).addListener(
      'healthKit:HeartRate:new',
      async () => {
        console.log('--> observer triggered');
      }
    );
  });

  useEffect(() => {
    if (Platform.OS !== 'ios') {
      return;
    }

    AppleHealthKit.initHealthKit(permissions, (err) => {
      if (err) {
        console.log('Error getting permissions');
        return;
      }
      setHasPermission(true);
    });

    if (!hasPermissions) {
      return;
    }

    const options: HealthInputOptions = {
      date: new Date().toISOString(),
      startDate: new Date(2020, 1, 1).toISOString(),
    };

    AppleHealthKit.getStepCount(options, (err, results) => {
      if (err) {
        console.log('Error getting the steps');
        return;
      }
      setSteps(results.value);
    });

    AppleHealthKit.getFlightsClimbed(options, (err, results) => {
      if (err) {
        console.log('Error getting the Flights Climbed:', err);
        return;
      }
      setFlights(results.value);
    });

    AppleHealthKit.getDistanceWalkingRunning(options, (err, results) => {
      if (err) {
        console.log('Error getting the Distance:', err);
        return;
      }
      setDistance(results.value);
    });

    AppleHealthKit.getRestingHeartRate(options, (err, results) => {
      if (err) {
        console.log('Error getting the heart rate', err);
        return;
      }

      setRestingHeartRate(results.value);
    });

    AppleHealthKit.getHeartRateSamples(options, (err, results) => {
      if (err) {
        console.log('Error getting the heart rate', err);
        return;
      }

      setHeartRate(results[0].value);
    });
  }, [hasPermissions]);

  return { steps, flights, distance, restingHeartRate, heartRate };
};

export default useHealthData;
