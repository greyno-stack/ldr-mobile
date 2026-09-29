import { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';

const MAX_LENGTH = 280;

export default function SendNoteModal({ visible, onClose, onSend, sending }) {
  const [note, setNote] = useState('');

  const handleClose = () => {
    setNote('');
    onClose();
  };

  const handleSend = () => {
    if (!note.trim()) return;
    onSend(note.trim());
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Send a note</Text>

          <TextInput
            style={styles.input}
            placeholder="Write something sweet…"
            placeholderTextColor="#a8a2b8"
            value={note}
            onChangeText={setNote}
            multiline
            maxLength={MAX_LENGTH}
            autoFocus
          />
          <Text style={styles.counter}>{note.length}/{MAX_LENGTH}</Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.sendButton, (!note.trim() || sending) && styles.disabledButton]}
              onPress={handleSend}
              disabled={!note.trim() || sending}
            >
              <Text style={styles.sendText}>{sending ? 'Sending…' : 'Send'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#241b33',
  },
  input: {
    minHeight: 100,
    maxHeight: 160,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e6e1ee',
    backgroundColor: '#faf9fc',
    padding: 12,
    fontSize: 15,
    color: '#241b33',
    textAlignVertical: 'top',
  },
  counter: {
    alignSelf: 'flex-end',
    fontSize: 12,
    color: '#a8a2b8',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  button: {
    flex: 1,
    height: 46,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f1eef6',
  },
  cancelText: {
    color: '#3D2C5F',
    fontWeight: '600',
    fontSize: 15,
  },
  sendButton: {
    backgroundColor: '#3D2C5F',
  },
  sendText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  disabledButton: {
    opacity: 0.5,
  },
});
