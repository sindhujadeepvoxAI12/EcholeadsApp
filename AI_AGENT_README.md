# AI Agent Update Functionality
  
  This document describes the implementation of the AI agent update functionality based on the `enable_ai_bot` field.
  
  ## Overview
  
  The AI agent system allows administrators to enable or disable AI agent responses across the entire application. The system uses a string field `enable_ai_bot` to control the behavior:
  
  - **`enable_ai_bot = "1"`** → AI Agent **ENABLED** (active)
  - **`enable_ai_bot = "0"`** → AI Agent **DISABLED** (inactive)

## API Endpoints

### 1. Get AI Agent Status
```
GET /aiagent/status
```

  **Response Format:**
  ```json
  {
    "enable_ai_bot": "1",   // "1" = enabled, "0" = disabled
    "status": "active",      // human-readable status
    "updated_at": "2025-01-01T00:00:00Z"
  }
  ```

### 2. Update AI Agent Status
```
POST /aiagent/update
```

**Request Body:**
```json
{
  "enable_ai_bot": "1"  // "1" = enable, "0" = disable
}
```

**Response Format:**
```json
{
  "status": "success",
  "message": "AI agent status updated successfully",
  "data": {
    "enable_ai_bot": "1",
    "status": "active"
  }
}
```

## Implementation Details

### Chat Service (`app/services/chatService.js`)

The service layer handles all AI agent API interactions:

#### `getAIAgentStatus()`
- Fetches current AI agent status from the server
- Parses the `enable_ai_bot` field to determine status
- Returns structured response with status and raw data
- Handles API errors gracefully

#### `updateAIAgentStatus(status)`
- Updates AI agent status on the server
- Converts human-readable status to string value
- Sends `enable_ai_bot` field to API
- Handles response validation

### LiveChat Component (`app/(tabs)/LiveChat.js`)

The main chat interface integrates with the AI agent system:

#### State Management
- `aiAgentStatus`: Current AI agent status ('active' or 'inactive')
- `globalAgentEnabled`: Boolean flag for UI state
- `updatingAgent`: Loading state during updates

#### Key Functions

##### `fetchAIAgentStatus()`
- Retrieves current status from API on component mount
- Falls back to stored status if API fails
- Detects external status changes
- Updates UI and shows notifications for changes

##### `handleToggleGlobalAgent()`
- Toggles AI agent status between enabled/disabled
- Calls API to update server-side status
- Updates local state and UI
- Verifies status update by re-fetching
- Shows success/error notifications

##### `updateChatsAgentStatus()`
- Updates all chat items to reflect new AI agent status
- Ensures UI consistency across the application

#### Automatic Synchronization
- Status is fetched every 5 minutes automatically
- External changes are detected and reflected in UI
- Status is stored locally for offline use
- App state changes trigger status refresh

## Usage Examples

### Enable AI Agent
```javascript
// This will set enable_ai_bot = "1"
await chatAPI.updateAIAgentStatus('active');
```

### Disable AI Agent
```javascript
// This will set enable_ai_bot = "0"
await chatAPI.updateAIAgentStatus('inactive');
```

### Check Current Status
```javascript
const status = await chatAPI.getAIAgentStatus();
console.log('AI Agent is:', status.status); // 'active' or 'inactive'
```

## UI Integration

### Status Display
- Global toggle button in chat header
- Visual indicators for AI agent status
- Real-time status updates
- Loading states during operations

### Notifications
- Success messages for status changes
- External change notifications
- Error handling for failed operations
- User-friendly status messages

### Responsive Behavior
- Input fields adapt based on AI agent status
- Chat interface reflects current mode
- Automatic UI updates on status changes

## Error Handling

### API Failures
- Graceful fallback to stored status
- Multiple endpoint fallback attempts
- Mock responses when all endpoints fail
- User-friendly error messages
- Retry mechanisms for network issues
- Offline status persistence

### Invalid Responses
- Response validation and parsing
- Fallback to default values
- Detailed error logging
- User notification of issues

### Fallback Behavior
- **Primary Endpoint**: `/aiagent/status` and `/aiagent/update`
- **Alternative Endpoints**: Multiple fallback endpoints are tried automatically
- **Mock Responses**: When all endpoints fail, mock responses are returned
- **Offline Mode**: System continues to work even without API connectivity
- **User Notification**: Clear indicators when fallback mode is active

## Testing

### Test Component
A dedicated test component (`components/AIAgentTest.js`) is available for:
- Testing API endpoints
- Verifying status logic
- Debugging status changes
- Demonstrating functionality

### Test Scenarios
1. **Enable AI Agent**: Verify `enable_ai_bot = "1"` is sent
2. **Disable AI Agent**: Verify `enable_ai_bot = "0"` is sent
3. **Status Retrieval**: Verify current status is fetched correctly
4. **External Changes**: Test status synchronization
5. **Error Handling**: Test API failure scenarios

## Configuration

### Environment Variables
- `API_BASE_URL`: Base URL for API endpoints
- `AUTH_TOKEN`: Authentication token for API calls

### Local Storage
- `aiAgentStatus`: Cached AI agent status
- `liveChatState`: Application state persistence

## Security Considerations

- All API calls require authentication
- Status changes are logged and validated
- User permissions can be implemented
- Rate limiting for status updates

## Future Enhancements

1. **User Permissions**: Role-based access control for status changes
2. **Audit Logging**: Track all status change operations
3. **Webhook Support**: Real-time status change notifications
4. **Advanced Scheduling**: Time-based AI agent activation
5. **Multi-tenant Support**: Per-organization AI agent settings

## Troubleshooting

### Common Issues

1. **Status Not Updating**
   - Check API endpoint availability
   - Verify authentication token
   - Check network connectivity
   - Review API response format

2. **UI Not Reflecting Changes**
   - Verify state management
   - Check component re-rendering
   - Review notification system
   - Validate status parsing

3. **API Errors**
   - Check endpoint URLs
   - Verify request format
   - Review authentication
   - Check server logs

### Debug Information
- Console logs with 🔧 prefix for AI agent operations
- Detailed error messages and stack traces
- API request/response logging
- Status change tracking

## Support

For technical support or questions about the AI agent functionality:
- Check console logs for detailed information
- Review API endpoint documentation
- Test with the provided test component
- Contact development team for assistance
