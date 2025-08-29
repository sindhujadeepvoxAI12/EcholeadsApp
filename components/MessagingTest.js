import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { chatAPI } from '../app/services/chatService';

const MessagingTest = () => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const addResult = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setTestResults(prev => [...prev, { message, type, timestamp }]);
  };

  const testEndpoints = async () => {
    setLoading(true);
    addResult('🔍 Testing available messaging endpoints...', 'info');
    
    try {
      const endpoints = await chatAPI.checkMessagingEndpoints();
      addResult(`✅ Found ${endpoints.length} available endpoints: ${endpoints.join(', ')}`, 'success');
    } catch (error) {
      addResult(`❌ Failed to check endpoints: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const testDirectMessage = async () => {
    setLoading(true);
    addResult('📤 Testing direct message functionality...', 'info');
    
    try {
      // Test with a dummy chat ID
      const testChatId = 'test-chat-123';
      const testMessage = 'Test direct message - AI agent should be bypassed';
      
      addResult(`📝 Sending test message to ${testChatId}`, 'info');
      
      const response = await chatAPI.sendDirectMessage(testChatId, testMessage);
      addResult(`✅ Direct message sent successfully: ${JSON.stringify(response)}`, 'success');
    } catch (error) {
      addResult(`❌ Direct message failed: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const testMessageTypes = async () => {
    setLoading(true);
    addResult('🔤 Testing different message types...', 'info');
    
    try {
      const testChatId = 'test-chat-123';
      
      // Test text message
      addResult('📝 Testing text message...', 'info');
      const textResponse = await chatAPI.sendMessage(testChatId, 'Test text message', 'text', true);
      addResult(`✅ Text message sent: ${JSON.stringify(textResponse)}`, 'success');
      
      // Test image message
      addResult('🖼️ Testing image message...', 'info');
      const imageResponse = await chatAPI.sendMessage(testChatId, 'Test image message', 'image', true);
      addResult(`✅ Image message sent: ${JSON.stringify(imageResponse)}`, 'success');
      
      // Test file message
      addResult('📄 Testing file message...', 'info');
      const fileResponse = await chatAPI.sendMessage(testChatId, 'Test file message', 'file', true);
      addResult(`✅ File message sent: ${JSON.stringify(fileResponse)}`, 'success');
      
      // Test folder message
      addResult('📁 Testing folder message...', 'info');
      const folderResponse = await chatAPI.sendMessage(testChatId, 'Test folder message', 'folder', true);
      addResult(`✅ Folder message sent: ${JSON.stringify(folderResponse)}`, 'success');
      
    } catch (error) {
      addResult(`❌ Message type testing failed: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const testFileUpload = async () => {
    setLoading(true);
    addResult('📎 Testing file upload with message type...', 'info');
    
    try {
      const testChatId = 'test-chat-123';
      const testMessage = 'Test file upload';
      
      // Mock file object for testing
      const mockFile = {
        uri: 'file://test/path/image.png',
        name: 'test-image.png',
        mimeType: 'image/png',
        path: '/test/path/image.png'
      };
      
      addResult(`📝 Sending file upload to ${testChatId}`, 'info');
      
      const response = await chatAPI.sendMessageWithFileType(testChatId, testMessage, mockFile, 'image', true);
      addResult(`✅ File upload successful: ${JSON.stringify(response)}`, 'success');
      
    } catch (error) {
      addResult(`❌ File upload failed: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Messaging Endpoint Test</Text>
      <Text style={styles.subtitle}>Test different messaging endpoints and functionality</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.primaryButton]} 
          onPress={testEndpoints}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Test Endpoints</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton]} 
          onPress={testDirectMessage}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Test Direct Message</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.tertiaryButton]} 
          onPress={testMessageTypes}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Test Message Types</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.quaternaryButton]} 
          onPress={testFileUpload}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Test File Upload</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.clearButton]} 
          onPress={clearResults}
        >
          <Text style={styles.buttonText}>Clear Results</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>Test Results:</Text>
        {testResults.map((result, index) => (
          <View key={index} style={[styles.resultItem, styles[`result${result.type}`]]}>
            <Text style={styles.resultTimestamp}>{result.timestamp}</Text>
            <Text style={styles.resultMessage}>{result.message}</Text>
          </View>
        ))}
        {testResults.length === 0 && (
          <Text style={styles.noResults}>No test results yet. Run a test to see results.</Text>
        )}
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
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#34C759',
  },
  tertiaryButton: {
    backgroundColor: '#FF9500',
  },
  quaternaryButton: {
    backgroundColor: '#4CAF50',
  },
  clearButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  resultItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
  },
  resultinfo: {
    backgroundColor: '#E3F2FD',
    borderLeftColor: '#2196F3',
  },
  resultsuccess: {
    backgroundColor: '#E8F5E8',
    borderLeftColor: '#4CAF50',
  },
  resulterror: {
    backgroundColor: '#FFEBEE',
    borderLeftColor: '#F44336',
  },
  resultTimestamp: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  resultMessage: {
    fontSize: 14,
    color: '#333',
  },
  noResults: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
});

export default MessagingTest;
