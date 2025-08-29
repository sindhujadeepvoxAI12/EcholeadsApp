import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { chatAPI } from '../app/services/chatService';

const FileUploadTest = () => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const addResult = (type, message, data = null) => {
    const timestamp = new Date().toLocaleTimeString();
    setTestResults(prev => [...prev, { type, message, data, timestamp }]);
  };

  const testDocumentPicker = async () => {
    try {
      addResult('info', 'Testing DocumentPicker...');
      
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*',
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        addResult('error', 'Document picker was canceled');
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        addResult('success', 'Document picked successfully', {
          name: asset.name,
          uri: asset.uri,
          mimeType: asset.mimeType,
          size: asset.size,
          fileUri: asset.fileUri,
          fileName: asset.fileName,
          allKeys: Object.keys(asset)
        });
      } else {
        addResult('error', 'No assets in result', result);
      }
    } catch (error) {
      addResult('error', 'DocumentPicker error: ' + error.message);
    }
  };

  const testFileUpload = async () => {
    try {
      setLoading(true);
      addResult('info', 'Testing file upload...');
      
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*',
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        addResult('error', 'No file selected');
        return;
      }

      const asset = result.assets[0];
      const fileData = {
        ...asset,
        mimeType: asset.mimeType || 'image/jpeg',
        path: asset.name,
        uri: asset.uri || asset.fileUri,
        name: asset.name || asset.fileName,
      };

      addResult('info', 'File data prepared', fileData);

      // Test with a dummy chat ID
      const testChatId = 'test_chat_123';
      const response = await chatAPI.sendMessageWithFiles(
        testChatId, 
        'Test image message', 
        [fileData], 
        'image', 
        false
      );

      addResult('success', 'File upload test completed', response);
    } catch (error) {
      addResult('error', 'File upload test failed: ' + error.message);
      if (error.response) {
        addResult('error', 'Response status: ' + error.response.status);
        addResult('error', 'Response data: ' + JSON.stringify(error.response.data));
      }
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>File Upload Test</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={testDocumentPicker}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Test DocumentPicker</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={testFileUpload}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Testing...' : 'Test File Upload'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button} 
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
            {result.data && (
              <Text style={styles.resultData}>
                {JSON.stringify(result.data, null, 2)}
              </Text>
            )}
          </View>
        ))}
      </View>
    </View>
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
    marginBottom: 20,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  resultsContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  resultItem: {
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  resultinfo: {
    backgroundColor: '#E3F2FD',
    borderLeftColor: '#2196F3',
    borderLeftWidth: 4,
  },
  resultsuccess: {
    backgroundColor: '#E8F5E8',
    borderLeftColor: '#4CAF50',
    borderLeftWidth: 4,
  },
  resulterror: {
    backgroundColor: '#FFEBEE',
    borderLeftColor: '#F44336',
    borderLeftWidth: 4,
  },
  resultTimestamp: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  resultMessage: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  resultData: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
});

export default FileUploadTest;
