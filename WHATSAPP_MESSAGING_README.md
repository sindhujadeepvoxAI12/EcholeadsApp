# WhatsApp Messaging System - 24-Hour Window Solution

## Overview

This system automatically handles WhatsApp Business API's 24-hour messaging window limitation. When users haven't sent messages for more than 24 hours, the system automatically sends template messages instead of regular messages, ensuring compliance with WhatsApp's policies.

## Features

### 🚀 **Automatic Detection**
- Automatically detects when users are outside the 24-hour messaging window
- Tracks user engagement patterns in real-time
- Caches user activity data for performance

### 📋 **Template Message Support**
- Pre-approved template messages that can be sent outside the 24-hour window
- Multiple template types: follow-up, engagement, offers, surveys, news, customer service
- Automatic template selection based on message content

### 🔄 **Smart Message Routing**
- Automatically routes messages to appropriate endpoints
- Falls back to template messages when regular messages can't be sent
- Seamless integration with existing chat functionality

### 📊 **Real-time Monitoring**
- Live statistics on messaging window status
- User engagement tracking
- Performance metrics and analytics

### ⚡ **Background Processing**
- Automatic follow-up scheduling
- Queue management for template messages
- Retry logic with configurable attempts

## How It Works

### 1. **24-Hour Window Detection**
```javascript
// The system automatically checks if a user is within the messaging window
const isWithinWindow = await whatsappMessagingService.isWithinMessagingWindow(chatId);

if (isWithinWindow) {
  // Send regular message
  await chatAPI.sendMessage(chatId, message);
} else {
  // Send template message
  await whatsappMessagingService.sendTemplateMessage(chatId, message);
}
```

### 2. **Automatic Template Selection**
The system analyzes message content and automatically selects the most appropriate template:

- **Follow-up**: Contains "follow up" or "reminder"
- **Engagement**: General engagement prompts
- **Offers**: Contains "offer", "discount", or "deal"
- **Surveys**: Contains "survey", "feedback", or "question"
- **News**: Contains "news", "update", or "announcement"
- **Customer Service**: Contains "customer service" or "support"

### 3. **Smart Message Sending**
```javascript
// Use the smart message function - it handles everything automatically
await whatsappMessagingService.sendSmartMessage(chatId, messageText, files, options);
```

## Installation & Setup

### 1. **Import the Service**
```javascript
import whatsappMessagingService from './app/services/whatsappMessagingService';
```

### 2. **Initialize the Service**
```javascript
// Initialize when your app starts
await whatsappMessagingService.initialize();
```

### 3. **Use the Hook in React Components**
```javascript
import useWhatsAppMessaging from './hooks/useWhatsAppMessaging';

const MyComponent = () => {
  const {
    sendSmartMessage,
    checkMessagingWindow,
    messagingStats,
    isInitialized
  } = useWhatsAppMessaging();
  
  // Use the functions...
};
```

## Usage Examples

### Basic Message Sending
```javascript
// The system automatically handles the 24-hour window
const result = await sendSmartMessage(chatId, "Hello! How can I help you today?");
```

### Check Messaging Window Status
```javascript
const isWithinWindow = await checkMessagingWindow(chatId);
if (isWithinWindow) {
  console.log("User is within messaging window");
} else {
  console.log("User is outside messaging window - template message required");
}
```

### Send Specific Template Message
```javascript
const result = await sendTemplateMessage(chatId, "Special offer for you!", {
  templateType: TEMPLATE_MESSAGE_TYPES.OFFER
});
```

### Get Messaging Statistics
```javascript
const stats = whatsappMessagingService.getMessagingStats();
console.log(`Total users: ${stats.totalUsers}`);
console.log(`Users outside window: ${stats.usersOutsideWindow}`);
```

## Template Message Types

### Available Templates
1. **`follow_up_reminder`** - For following up on previous conversations
2. **`engagement_prompt`** - For general engagement and reconnection
3. **`special_offer`** - For promotional content and deals
4. **`news_update`** - For announcements and updates
5. **`quick_survey`** - For feedback and surveys
6. **`customer_service_followup`** - For customer service interactions

### Template Parameters
Templates automatically include personalized parameters:
- Customer name
- Time since last activity
- Custom message content
- Interactive buttons (where supported)

## Integration with Existing Code

### 1. **Replace Direct Message Calls**
```javascript
// Before (might fail due to 24h window)
await chatAPI.sendMessage(chatId, message);

// After (automatically handles 24h window)
await whatsappMessagingService.sendSmartMessage(chatId, message);
```

### 2. **Add to Chat Components**
```javascript
// Add the WhatsApp messaging manager button to your chat header
<TouchableOpacity onPress={() => setShowWhatsAppManager(true)}>
  <MessageCircle size={20} color="#fff" />
</TouchableOpacity>

// Add the manager component
<WhatsAppMessagingManager
  visible={showWhatsAppManager}
  onClose={() => setShowWhatsAppManager(false)}
  selectedChatId={selectedChat?.id}
/>
```

### 3. **Update Message Sending Logic**
```javascript
// In your existing message sending function
const handleSendMessage = async (messageText) => {
  try {
    // Use smart message instead of direct send
    const result = await whatsappMessagingService.sendSmartMessage(
      selectedChat.id, 
      messageText, 
      selectedFiles
    );
    
    // Handle success...
  } catch (error) {
    // Handle error...
  }
};
```

## Configuration

### Template Message Customization
```javascript
// Customize template messages in whatsappMessagingService.js
const TEMPLATE_MESSAGES = {
  [TEMPLATE_MESSAGE_TYPES.FOLLOW_UP]: {
    name: 'your_custom_template_name',
    language: 'en',
    components: [
      {
        type: 'body',
        parameters: [
          { type: 'text', text: '{{1}}' }, // Customer name
          { type: 'text', text: '{{2}}' }  // Custom parameter
        ]
      }
    ]
  }
};
```

### Timing Configuration
```javascript
// Adjust follow-up timing
const followUp = {
  chatId,
  templateType,
  scheduledTime: Date.now() + (options.followUpDelay || 24 * 60 * 60 * 1000), // Default: 24 hours
  // ... other options
};
```

## Monitoring & Analytics

### Real-time Statistics
- Total users tracked
- Users within/outside messaging window
- Template messages sent
- Regular messages sent
- Engagement patterns

### Performance Metrics
- Message delivery success rates
- Template message effectiveness
- User re-engagement rates
- System response times

## Error Handling

### Automatic Fallbacks
1. **Template Endpoint Fails**: Falls back to regular endpoint with template flag
2. **API Errors**: Retries with exponential backoff
3. **Network Issues**: Queues messages for later delivery
4. **Authentication Errors**: Handles token refresh automatically

### Error Recovery
```javascript
try {
  await sendSmartMessage(chatId, message);
} catch (error) {
  if (error.message.includes('24-hour window')) {
    // Automatically handled by the service
    console.log('Template message sent instead');
  } else {
    // Handle other errors
    console.error('Message failed:', error);
  }
}
```

## Testing

### Test Component
Use the included `WhatsAppMessagingTest` component to test all functionality:

```javascript
import WhatsAppMessagingTest from './components/WhatsAppMessagingTest';

// Add to your test screen
<WhatsAppMessagingTest />
```

### Test Functions
- Check messaging window status
- Send test smart messages
- Send test template messages
- Verify statistics
- Test error handling

## Troubleshooting

### Common Issues

1. **Service Not Initializing**
   - Check console logs for initialization errors
   - Verify all dependencies are installed
   - Ensure proper import paths

2. **Template Messages Not Sending**
   - Verify template names are approved by WhatsApp
   - Check API endpoint availability
   - Review template parameter formatting

3. **Performance Issues**
   - Monitor background processing intervals
   - Check cache storage usage
   - Review user engagement data size

### Debug Mode
```javascript
// Enable detailed logging
console.log('WhatsApp Messaging Service Debug Mode');

// Check service status
const stats = whatsappMessagingService.getMessagingStats();
console.log('Service Stats:', stats);

// Reset service if needed
await whatsappMessagingService.reset();
```

## Best Practices

### 1. **Template Message Design**
- Keep messages concise and engaging
- Use clear call-to-actions
- Personalize content when possible
- Follow WhatsApp's template guidelines

### 2. **Timing Strategy**
- Send follow-ups during business hours
- Space out re-engagement attempts
- Monitor user response patterns
- Adjust timing based on engagement data

### 3. **Content Strategy**
- Mix template types for variety
- A/B test different message approaches
- Track user preferences and responses
- Maintain consistent brand voice

### 4. **Performance Optimization**
- Monitor cache usage and cleanup
- Optimize background processing intervals
- Implement proper error handling
- Use appropriate retry strategies

## API Reference

### Service Methods

#### `initialize()`
Initializes the service and starts background processing.

#### `sendSmartMessage(chatId, messageText, files, options)`
Automatically sends the appropriate message type based on user's messaging window status.

#### `sendTemplateMessage(chatId, messageText, options)`
Sends a specific template message to a user outside the messaging window.

#### `checkMessagingWindow(chatId)`
Checks if a user is within the 24-hour messaging window.

#### `getMessagingStats()`
Returns current messaging statistics and user engagement data.

### Hook Methods

#### `sendSmartMessage(chatId, messageText, files, options)`
React hook version of the smart message sender.

#### `checkMessagingWindow(chatId)`
React hook version of the window checker.

#### `messagingStats`
Real-time messaging statistics state.

#### `isInitialized`
Service initialization status.

## Support

For issues or questions:
1. Check the console logs for detailed error information
2. Verify all dependencies and imports are correct
3. Test with the included test component
4. Review the WhatsApp Business API documentation for template requirements

## Future Enhancements

- **Multi-language Support**: Additional language templates
- **Advanced Analytics**: Detailed engagement insights
- **AI-powered Content**: Smart message content generation
- **Integration APIs**: Connect with CRM and marketing tools
- **Bulk Operations**: Mass template message campaigns
- **Advanced Scheduling**: Intelligent timing algorithms

---

**Note**: This system automatically handles WhatsApp's 24-hour messaging window limitation, ensuring your messages are always delivered while maintaining compliance with WhatsApp Business API policies.
