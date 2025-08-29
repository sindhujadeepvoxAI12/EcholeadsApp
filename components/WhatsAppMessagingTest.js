import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';
import useWhatsAppMessaging from '../hooks/useWhatsAppMessaging';

const WhatsAppMessagingTest = () => {
  const {
    isInitialized,
    isLoading,
    error,
    messagingStats,
    checkMessagingWindow,
    sendSmartMessage,
    sendTemplateMessage,
    refreshStats,
    clearError,
    TEMPLATE_MESSAGE_TYPES
  } = useWhatsAppMessaging();

  const handleTestCheckWindow = async () => {
    try {
      const isWithinWindow = await checkMessagingWindow('test-chat-123');
      Alert.alert(
        'Test Result',
        `Chat test-chat-123 is ${isWithinWindow ? 'within' : 'outside'} the 24-hour messaging window`
      );
    } catch (error) {
      Alert.alert('Error', `Failed to check messaging window: ${error.message}`);
    }
  };

  const handleTestSmartMessage = async () => {
    try {
      const result = await sendSmartMessage('test-chat-123', 'This is a test smart message');
      Alert.alert('Success', 'Smart message sent successfully!');
    } catch (error) {
      Alert.alert('Error', `Failed to send smart message: ${error.message}`);
    }
  };

  const handleTestTemplateMessage = async () => {
    try {
      const result = await sendTemplateMessage('test-chat-123', 'This is a test template message', {
        templateType: TEMPLATE_MESSAGE_TYPES.ENGAGEMENT
      });
      Alert.alert('Success', 'Template message sent successfully!');
    } catch (error) {
      Alert.alert('Error', `Failed to send template message: ${error.message}`);
    }
  };

  const handleRefreshStats = () => {
    const stats = refreshStats();
    Alert.alert('Stats Refreshed', `Total users: ${stats?.totalUsers || 0}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>WhatsApp Messaging Service Test</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          Service Status: {isInitialized ? '✅ Initialized' : '⏳ Initializing...'}
        </Text>
        {error && (
          <Text style={styles.errorText}>Error: {error}</Text>
        )}
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Current Stats:</Text>
        {messagingStats ? (
          <View>
            <Text>Total Users: {messagingStats.totalUsers || 0}</Text>
            <Text>Within Window: {messagingStats.usersInsideWindow || 0}</Text>
            <Text>Outside Window: {messagingStats.usersOutsideWindow || 0}</Text>
            <Text>Template Messages: {messagingStats.templateMessagesSent || 0}</Text>
          </View>
        ) : (
          <Text>No stats available</Text>
        )}
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleTestCheckWindow}
          disabled={!isInitialized || isLoading}
        >
          <Text style={styles.buttonText}>Test Check Window</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handleTestSmartMessage}
          disabled={!isInitialized || isLoading}
        >
          <Text style={styles.buttonText}>Test Smart Message</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handleTestTemplateMessage}
          disabled={!isInitialized || isLoading}
        >
          <Text style={styles.buttonText}>Test Template Message</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handleRefreshStats}
          disabled={!isInitialized || isLoading}
        >
          <Text style={styles.buttonText}>Refresh Stats</Text>
        </TouchableOpacity>

        {error && (
          <TouchableOpacity
            style={[styles.button, styles.clearButton]}
            onPress={clearError}
          >
            <Text style={styles.buttonText}>Clear Error</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.sectionTitle}>Available Template Types:</Text>
        {Object.entries(TEMPLATE_MESSAGE_TYPES).map(([key, value]) => (
          <Text key={key} style={styles.templateType}>
            {key}: {value}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  statusContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  statusText: {
    fontSize: 16,
    marginBottom: 10,
  },
  errorText: {
    fontSize: 14,
    color: '#d32f2f',
    fontWeight: '500',
  },
  statsContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  actionsContainer: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2196f3',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  clearButton: {
    backgroundColor: '#f44336',
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  templateType: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666',
  },
});

export default WhatsAppMessagingTest;
