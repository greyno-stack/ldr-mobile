import { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const clamp = (value, max) => Math.min(max, Math.max(0, value));

function NumberColumn({ label, value, max, onChange }) {
  return (
    <View style={styles.column}>
      <Text style={styles.columnLabel}>{label}</Text>
      <TouchableOpacity onPress={() => onChange(clamp(value + 1, max))} hitSlop={10}>
        <Ionicons name="chevron-up" size={18} color="#3D2C5F" />
      </TouchableOpacity>
      <Text style={styles.value}>{String(value).padStart(2, '0')}</Text>
      <TouchableOpacity onPress={() => onChange(clamp(value - 1, max))} hitSlop={10}>
        <Ionicons name="chevron-down" size={18} color="#3D2C5F" />
      </TouchableOpacity>
    </View>
  );
}

export default function SetCountdownModal({ visible, onClose, onSet, setting }) {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);

  const totalMs = ((days * 24 + hours) * 60 + minutes) * 60 * 1000;
  const isValid = totalMs > 0;

  const handleClose = () => {
    setDays(0);
    setHours(0);
    setMinutes(0);
    onClose();
  };

  const handleSet = () => {
    if (!isValid) return;
    onSet(totalMs);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Set a countdown</Text>
            <TouchableOpacity onPress={handleClose} hitSlop={8}>
              <Ionicons name="close" size={20} color="#8a8a8a" />
            </TouchableOpacity>
          </View>

          <View style={styles.pickerRow}>
            <NumberColumn label="D" value={days} max={999} onChange={setDays} />
            <Text style={styles.colon}>:</Text>
            <NumberColumn label="H" value={hours} max={23} onChange={setHours} />
            <Text style={styles.colon}>:</Text>
            <NumberColumn label="M" value={minutes} max={59} onChange={setMinutes} />
          </View>

          <TouchableOpacity
            style={[styles.setButton, (!isValid || setting) && styles.disabledButton]}
            onPress={handleSet}
            disabled={!isValid || setting}
          >
            <Text style={styles.setButtonText}>
              {setting ? 'Setting…' : 'Set countdown'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(20,14,30,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 20,
    padding: 20,
    backgroundColor: '#fff',
    gap: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#241b33',
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  column: {
    alignItems: 'center',
    gap: 8,
    width: 64,
  },
  columnLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#a8a2b8',
    letterSpacing: 1,
  },
  value: {
    fontSize: 30,
    fontWeight: '700',
    color: '#241b33',
    fontVariant: ['tabular-nums'],
  },
  colon: {
    fontSize: 26,
    fontWeight: '700',
    color: '#a8a2b8',
    marginTop: 22,
  },
  setButton: {
    height: 48,
    borderRadius: 24,
    backgroundColor: '#378ADD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  setButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  disabledButton: {
    opacity: 0.5,
  },
});
