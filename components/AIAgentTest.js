import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { chatAPI } from '../app/services/chatService';

const AIAgentTest = () => {
  const [currentStatus, setCurrentStatus] = useState('Unknown');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Fetch current AI agent status
  const fetchStatus = async () => {
    try {
      setIsLoading(true);
      console.log('🔧 AIAgentTest: Fetching current status...');
      
      const response = await chatAPI.getAIAgentStatus();
      console.log('🔧 AIAgentTest: Status response:', response);
      
              if (response && response.status) {
          setCurrentStatus(response.status);
          setLastUpdate(new Date().toLocaleTimeString());
          
          let alertMessage = `AI Agent Status: ${response.status}`;
          
          // Check if this is a fallback response
          if (response.rawData && response.rawData.fallback) {
            alertMessage += '\n\n⚠️ FALLBACK MODE: API endpoint not available, using default status';
          }
          
          alertMessage += `\n\nRaw Data: ${JSON.stringify(response.rawData, null, 2)}`;
          
          Alert.alert(
            'Status Retrieved',
            alertMessage,
            [{ text: 'OK' }]
          );
        } else {
          Alert.alert('Error', 'Invalid response format from API');
        }
    } catch (error) {
      console.error('❌ AIAgentTest: Error fetching status:', error);
      Alert.alert('Error', `Failed to fetch status: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Update AI agent status
  const updateStatus = async (newStatus) => {
    try {
      setIsLoading(true);
      console.log('🔧 AIAgentTest: Updating status to:', newStatus);
      
      const response = await chatAPI.updateAIAgentStatus(newStatus);
      console.log('🔧 AIAgentTest: Update response:', response);
      
              if (response) {
          let alertMessage = `AI Agent status updated to: ${newStatus}`;
          
          // Check if this is a fallback response
          if (response.fallback === true) {
            alertMessage += '\n\n⚠️ FALLBACK MODE: API endpoint not available, using mock response';
          }
          
          alertMessage += `\n\nResponse: ${JSON.stringify(response, null, 2)}`;
          
          Alert.alert(
            'Status Updated',
            alertMessage,
            [{ text: 'OK' }]
          );
          
          // Refresh the current status
          await fetchStatus();
        } else {
          Alert.alert('Error', 'No response from API');
        }
    } catch (error) {
      console.error('❌ AIAgentTest: Error updating status:', error);
      Alert.alert('Error', `Failed to update status: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Test the enable_ai_bot logic
const testLogic = () => {
  const explanation = `
AI Agent Status Logic:
  
1. enable_ai_bot = "1" → AI Agent ENABLED (active)
   - AI will respond automatically
   - Users can interact with AI
   - Status shows as "active"
  
2. enable_ai_bot = "0" → AI Agent DISABLED (inactive)
   - AI will NOT respond
   - Users must handle conversations manually
   - Status shows as "inactive"
  
API Endpoints:
- GET /aiagent/status - Get current status
- POST /aiagent/update - Update status with enable_ai_bot field
  
Current Implementation:
- Uses string values ("1"/"0") for API compatibility
- "1" = AI enabled, "0" = AI disabled
- Maps to human-readable status (active/inactive)
- Automatically syncs with server every 5 minutes
- Handles external status changes
- Stores status locally for offline use
  `;
  
  Alert.alert('AI Agent Logic', explanation, [{ text: 'OK' }]);
};

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>AI Agent Test Component</Text>
      
      <View style={styles.statusSection}>
        <Text style={styles.sectionTitle}>Current Status</Text>
        <Text style={styles.statusText}>Status: {currentStatus}</Text>
        {lastUpdate && (
          <Text style={styles.updateText}>Last Updated: {lastUpdate}</Text>
        )}
      </View>

      <View style={styles.buttonSection}>
        <TouchableOpacity
          style={[styles.button, styles.fetchButton]}
          onPress={fetchStatus}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Loading...' : 'Fetch Current Status'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.enableButton]}
          onPress={() => updateStatus('active')}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Enable AI Agent ("1")</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.disableButton]}
          onPress={() => updateStatus('inactive')}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Disable AI Agent ("0")</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.infoButton]}
          onPress={testLogic}
        >
          <Text style={styles.buttonText}>View Logic Explanation</Text>
        </TouchableOpacity>
      </View>

                     <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <Text style={styles.infoText}>
            • The component tests the AI agent API endpoints{'\n'}
            • GET /aiagent/status retrieves current status{'\n'}
            • POST /aiagent/update changes the status{'\n'}
            • enable_ai_bot field controls the behavior:{'\n'}
            {'  '}"1" = AI enabled, "0" = AI disabled{'\n'}
            • Status automatically syncs every 5 minutes{'\n'}
            • External changes are detected and notified
          </Text>
        </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  statusSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  statusText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#666',
  },
  updateText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  buttonSection: {
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  fetchButton: {
    backgroundColor: '#007AFF',
  },
  enableButton: {
    backgroundColor: '#34C759',
  },
  disableButton: {
    backgroundColor: '#FF3B30',
  },
  infoButton: {
    backgroundColor: '#FF9500',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
  },
});

export default AIAgentTest;
