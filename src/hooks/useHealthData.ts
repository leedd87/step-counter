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
  const [samples, setSamples] = useState<any[]>([]);

  // HealthKit implementation
  const [hasPermissions, setHasPermission] = useState(false);

  //Observers
  // useEffect(() => {
  //   new NativeEventEmitter(NativeModules.AppleHealthKit).addListener(
  //     'healthKit:HeartRate:new',
  //     async () => {
  //       console.log('--> observer triggered');
  //     }
  //   );
  //   new NativeEventEmitter(NativeModules.AppleHealthKit).addListener(
  //     'healthKit:StepCount:new',
  //     async () => {
  //       console.log('--> observer step triggered');
  //     }
  //   );
  // });

  useEffect(() => {
    if (Platform.OS !== 'ios') {
      return;
    }

    AppleHealthKit.initHealthKit(permissions, (err, results) => {
      if (err) {
        console.log('Error getting permissions');
        return;
      }

      new NativeEventEmitter(NativeModules.AppleHealthKit).addListener(
        'healthKit:StepCount:setup:success',
        async () => {
          console.log(
            '--> StepCount observer NativeEventEmitter setup success'
          );
        }
      );
      new NativeEventEmitter(NativeModules.AppleHealthKit).addListener(
        'healthKit:Cycling:setup:success',
        async () => {
          console.log('--> Cycling observer NativeEventEmitter setup success');
        }
      );
      new NativeEventEmitter(NativeModules.AppleHealthKit).addListener(
        'healthKit:HeartRate:setup:success',
        async () => {
          console.log(
            '--> HeartRate observer NativeEventEmitter setup success'
          );
        }
      );
      new NativeEventEmitter(NativeModules.AppleHealthKit).addListener(
        'healthKit:Workout:setup:success',
        async () => {
          console.log('--> Workout observer NativeEventEmitter setup success');
        }
      );

      new NativeEventEmitter(NativeModules.AppleHealthKit).addListener(
        'healthKit:StepCount:setup:failure',
        async () => {
          console.log(
            '--> StepCount observer NativeEventEmitter setup failure'
          );
        }
      );
      new NativeEventEmitter(NativeModules.AppleHealthKit).addListener(
        'healthKit:Cycling:setup:failure',
        async () => {
          console.log('--> Cycling observer NativeEventEmitter setup failure');
        }
      );
      new NativeEventEmitter(NativeModules.AppleHealthKit).addListener(
        'healthKit:HeartRate:setup:failure',
        async () => {
          console.log(
            '--> HeartRate observer NativeEventEmitter setup failure'
          );
        }
      );
      new NativeEventEmitter(NativeModules.AppleHealthKit).addListener(
        'healthKit:Workout:setup:failure',
        async () => {
          console.log('--> Workout observer NativeEventEmitter setup failure');
        }
      );

      new NativeEventEmitter(NativeModules.AppleHealthKit).addListener(
        'healthKit:StepCount:failure',
        async () => {
          console.log('--> StepCount observer NativeEventEmitter failure');
        }
      );
      new NativeEventEmitter(NativeModules.AppleHealthKit).addListener(
        'healthKit:Cycling:failure',
        async () => {
          console.log('--> Cycling observer NativeEventEmitter failure');
        }
      );
      new NativeEventEmitter(NativeModules.AppleHealthKit).addListener(
        'healthKit:HeartRate:failure',
        async () => {
          // console.log('--> HeartRate observer NativeEventEmitter failure');
        }
      );
      new NativeEventEmitter(NativeModules.AppleHealthKit).addListener(
        'healthKit:Workout:failure',
        async () => {
          console.log('--> Workout observer NativeEventEmitter failure');
        }
      );

      setHasPermission(true);
    });

    if (!hasPermissions) {
      return;
    }

    const options: HealthInputOptions = {
      date: new Date().toISOString(),
      startDate: new Date(2020, 1, 1).toISOString(),
      type: AppleHealthKit.Constants.Observers.Walking,
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

      setHeartRate(results[0]?.value);
    });

    AppleHealthKit.getSamples(
      options,
      (err: Object, results: Array<Object>) => {
        if (err) {
          return;
        }
        setSamples(results);
      }
    );
  }, [hasPermissions]);

  // useEffect(() => {
  //   if (Platform.OS !== 'ios') {
  //     return;
  //   }

  //   let intervalId: NodeJS.Timeout;

  //   AppleHealthKit.initHealthKit(permissions, (err) => {
  //     if (err) {
  //       console.log('Error getting permissions');
  //       return;
  //     }
  //     setHasPermission(true);
  //   });

  //   if (!hasPermissions) {
  //     return;
  //   }

  //   const fetchData = () => {
  //     console.log('SE DISPARO CADA 30 sg');
  //     const options: HealthInputOptions = {
  //       date: new Date().toISOString(),
  //       startDate: new Date(2020, 1, 1).toISOString(),
  //     };

  //     AppleHealthKit.getStepCount(options, (err, results) => {
  //       if (err) {
  //         console.log('Error getting the steps');
  //         return;
  //       }
  //       setSteps(results.value);
  //     });

  //     AppleHealthKit.getFlightsClimbed(options, (err, results) => {
  //       if (err) {
  //         console.log('Error getting the Flights Climbed:', err);
  //         return;
  //       }
  //       setFlights(results.value);
  //     });

  //     AppleHealthKit.getDistanceWalkingRunning(options, (err, results) => {
  //       if (err) {
  //         console.log('Error getting the Distance:', err);
  //         return;
  //       }
  //       setDistance(results.value);
  //     });

  //     AppleHealthKit.getRestingHeartRate(options, (err, results) => {
  //       if (err) {
  //         console.log('Error getting the heart rate', err);
  //         return;
  //       }

  //       setRestingHeartRate(results.value);
  //     });

  //     AppleHealthKit.getHeartRateSamples(options, (err, results) => {
  //       if (err) {
  //         console.log('Error getting the heart rate', err);
  //         return;
  //       }

  //       setHeartRate(results[0]?.value);
  //     });
  //   };
  //   fetchData();
  //   // Ejecuta la función fetchData cada 10 segundos
  //   intervalId = setInterval(fetchData, 30000);

  //   // Limpia el intervalo cuando se desmonta el componente
  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, [hasPermissions]);

  return { steps, flights, distance, restingHeartRate, heartRate, samples };
};

export default useHealthData;
