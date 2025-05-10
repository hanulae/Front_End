import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import Typo from './Typo';

interface IStepIndicatorProps {
  currentStep: number;
}

const {width} = Dimensions.get('window');

const StepIndicator = ({currentStep}: IStepIndicatorProps) => {
  const steps = [1, 2, 3];

  return (
    <View style={styles.container}>
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <View style={styles.stepContainer}>
            <View
              style={[
                styles.circle,
                currentStep === step && styles.circleActive,
              ]}>
              <Typo
                style={[
                  styles.number,
                  currentStep === step && styles.numberActive,
                ]}>
                {`0${step}`}
              </Typo>
            </View>
          </View>
          {index < steps.length - 1 && <View style={styles.line} />}
        </React.Fragment>
      ))}
    </View>
  );
};

export default StepIndicator;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
    paddingHorizontal: 20,
  },
  stepContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#ccc',
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleActive: {
    borderColor: '#397CFF',
    backgroundColor: '#FFF',
  },
  number: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
  },
  numberActive: {
    color: '#397CFF',
  },
  line: {
    width: width * 0.32,
    height: 2,
    backgroundColor: '#ccc',
    marginHorizontal: 8,
  },
});
