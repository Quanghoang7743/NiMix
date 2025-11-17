import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function Authentication() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
        showsVerticalScrollIndicator={false}
        // bounces={false}
        >
        <LinearGradient
          colors={["#4ad6f9", "#17bfe1"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.heroSection}
        >
          <View style={[styles.circle, styles.circleLarge]} />
          <View style={[styles.circle, styles.circleMedium]} />
          <View style={[styles.circle, styles.circleSmall]} />
          <Image
            source={{
              uri: 'https://images.pexels.com/photos/6953921/pexels-photo-6953921.jpeg?auto=compress&cs=tinysrgb&w=640',
            }}
            style={styles.heroImage}
            resizeMode="cover"
          />
        </LinearGradient>

        <View style={styles.card}>
          <Text style={styles.cardText}>
            From the <Text style={styles.highlightLatest}>latest</Text> to the{' '}
            <Text style={styles.highlightGreatest}>greatest</Text> hits, play your
            favorite tracks on <Text style={styles.highlightBrand}>musium</Text>{' '}
            now!
          </Text>

          <View style={styles.progressWrapper}>
            <View style={styles.progressTrack}>
              <View style={styles.progressFill} />
            </View>
          </View>

          <LinearGradient
            colors={["#4ad6f9", "#17bfe1"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.buttonGradient}
          >
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.85}
              onPress={() => router.push('/sign-in')}
            >
              <Text style={styles.buttonText}>Bắt đầu</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  heroSection: {
    width: '100%',
    height: '48%',
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  heroImage: {
    width: '85%',
    height: '90%',
    borderRadius: 24,
    marginBottom: -60,
    borderWidth: 6,
    borderColor: '#050505',
  },
  circle: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  circleLarge: {
    width: 160,
    height: 160,
    borderRadius: 80,
    top: 24,
    left: -30,
  },
  circleMedium: {
    width: 110,
    height: 110,
    borderRadius: 55,
    top: 80,
    right: 30,
  },
  circleSmall: {
    width: 80,
    height: 80,
    borderRadius: 40,
    top: 160,
    right: 70,
  },
  card: {
    backgroundColor: '#000',
    width: '90%',
    paddingHorizontal: 24,
    paddingTop: 96,
    paddingBottom: 36,
    borderRadius: 32,
    marginTop: 40,
    alignItems: 'center',
    gap: 24,
  },
  cardText: {
    color: '#FFFFFF',
    fontSize: 20,
    lineHeight: 30,
    textAlign: 'center',
    fontWeight: '600',
  },
  highlightLatest: {
    color: '#4ad6f9',
  },
  highlightGreatest: {
    color: '#4ad6f9',
  },
  highlightBrand: {
    color: '#17bfe1',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  progressWrapper: {
    width: '60%',
    alignItems: 'center',
  },
  progressTrack: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1f1f1f',
    overflow: 'hidden',
  },
  progressFill: {
    width: '55%',
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#4ad6f9',
  },
  buttonGradient: {
    width: '85%',
    borderRadius: 28,
    padding: 2,
  },
  button: {
    width: '100%',
    borderRadius: 26,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});