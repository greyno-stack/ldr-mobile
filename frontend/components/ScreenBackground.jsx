import { View, Image, StyleSheet } from 'react-native';

export default function ScreenBackground({ children, style }) {
  return (
    <View style={styles.screen}>
      <Image
        source={require('../assets/images/lake1.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <View style={[styles.container, style]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  backgroundImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  container: { flex: 1 },
});
