// AI Assistant - Intelligent Chat Interface JavaScript

class AIChatbot {
    constructor() {
        this.currentChatId = null;
        this.chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
        this.settings = JSON.parse(localStorage.getItem('chatSettings')) || {
            darkMode: false,
            soundEffects: true,
            autoScroll: true,
            responseSpeed: 'normal',
            aiPersonality: 'helpful'
        };
        this.isTyping = false;
        this.messageCount = 0;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSettings();
        this.loadChatHistory();
        this.setupAutoResize();
        this.createNewChat();
    }

    setupEventListeners() {
        // Chat input
        const chatInput = document.getElementById('chatInput');
        const sendBtn = document.getElementById('sendBtn');
        
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        chatInput.addEventListener('input', () => {
            this.updateCharCount();
            this.autoResizeTextarea();
        });
        
        sendBtn.addEventListener('click', () => this.sendMessage());
        
        // Sidebar
        document.getElementById('newChatBtn').addEventListener('click', () => this.createNewChat());
        document.getElementById('sidebarToggle').addEventListener('click', () => this.toggleSidebar());
        
        // Settings
        document.getElementById('settingsBtn').addEventListener('click', () => this.toggleSettingsDropdown());
        document.getElementById('modalClose').addEventListener('click', () => this.closeModal());
        document.getElementById('saveSettings').addEventListener('click', () => this.saveSettings());
        document.getElementById('resetSettings').addEventListener('click', () => this.resetSettings());
        
        // Suggested prompts
        document.querySelectorAll('.prompt-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const prompt = btn.getAttribute('data-prompt');
                this.sendMessage(prompt);
            });
        });
        
        // Setting items
        document.querySelectorAll('.setting-item').forEach(item => {
            item.addEventListener('click', () => {
                const setting = item.getAttribute('data-setting');
                this.handleSettingAction(setting);
            });
        });
        
        // Modal overlay
        document.getElementById('modalOverlay').addEventListener('click', (e) => {
            if (e.target.id === 'modalOverlay') {
                this.closeModal();
            }
        });
        
        // Voice and other actions
        document.getElementById('voiceBtn').addEventListener('click', () => this.toggleVoiceInput());
        document.getElementById('shareBtn').addEventListener('click', () => this.shareChat());
        document.getElementById('attachmentBtn').addEventListener('click', () => this.handleAttachment());
    }

    setupAutoResize() {
        const chatInput = document.getElementById('chatInput');
        chatInput.style.height = 'auto';
        chatInput.style.height = chatInput.scrollHeight + 'px';
    }

    autoResizeTextarea() {
        const chatInput = document.getElementById('chatInput');
        chatInput.style.height = 'auto';
        chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
    }

    updateCharCount() {
        const chatInput = document.getElementById('chatInput');
        const charCount = document.getElementById('charCount');
        const count = chatInput.value.length;
        charCount.textContent = count;
        
        if (count > 1800) {
            charCount.style.color = 'var(--danger-color)';
        } else if (count > 1500) {
            charCount.style.color = 'var(--warning-color)';
        } else {
            charCount.style.color = 'var(--text-muted)';
        }
    }

    sendMessage(customMessage = null) {
        const chatInput = document.getElementById('chatInput');
        const message = customMessage || chatInput.value.trim();
        
        if (!message || this.isTyping) return;
        
        // Hide suggested prompts
        document.getElementById('suggestedPrompts').style.display = 'none';
        
        // Add user message
        this.addMessage(message, 'user');
        
        // Clear input
        if (!customMessage) {
            chatInput.value = '';
            this.updateCharCount();
            this.autoResizeTextarea();
        }
        
        // Show typing indicator and generate AI response
        this.showTypingIndicator();
        this.generateAIResponse(message);
        
        // Play sound effect
        if (this.settings.soundEffects) {
            this.playSound('send');
        }
    }

    addMessage(content, sender, timestamp = null) {
        const chatMessages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        const time = timestamp || new Date();
        
        messageDiv.className = `message ${sender}-message`;
        messageDiv.innerHTML = `
            <div class="message-avatar">${sender === 'user' ? '👤' : '🤖'}</div>
            <div class="message-content">
                <div class="message-bubble">
                    <p>${this.formatMessage(content)}</p>
                </div>
                <div class="message-time">${this.formatTime(time)}</div>
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        
        if (this.settings.autoScroll) {
            this.scrollToBottom();
        }
        
        // Save to current chat
        if (this.currentChatId) {
            const chat = this.chatHistory.find(c => c.id === this.currentChatId);
            if (chat) {
                chat.messages.push({
                    content,
                    sender,
                    timestamp: time.toISOString()
                });
                chat.lastMessage = content.substring(0, 50) + (content.length > 50 ? '...' : '');
                chat.updatedAt = time.toISOString();
                this.saveChatHistory();
            }
        }
        
        this.messageCount++;
    }

    formatMessage(content) {
        // Basic markdown-like formatting
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br>');
    }

    formatTime(date) {
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        
        return date.toLocaleDateString();
    }

    showTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        typingIndicator.classList.add('active');
        this.isTyping = true;
        
        if (this.settings.autoScroll) {
            this.scrollToBottom();
        }
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        typingIndicator.classList.remove('active');
        this.isTyping = false;
    }

    async generateAIResponse(userMessage) {
        // Simulate AI thinking time based on settings
        const delays = {
            fast: 1000 + Math.random() * 1000,
            normal: 2000 + Math.random() * 1000,
            slow: 3000 + Math.random() * 1000
        };
        
        const delay = delays[this.settings.responseSpeed] || delays.normal;
        
        setTimeout(() => {
            this.hideTypingIndicator();
            
            const response = this.generateResponse(userMessage);
            this.addMessage(response, 'ai');
            
            if (this.settings.soundEffects) {
                this.playSound('receive');
            }
        }, delay);
    }

    generateResponse(userMessage) {
        const responses = {
            helpful: [
                "I'd be happy to help you with that! Let me provide you with some detailed information.",
                "That's a great question! Here's what I can tell you about that topic.",
                "I understand what you're looking for. Let me break this down for you.",
                "Excellent question! I'll do my best to provide you with a comprehensive answer.",
                "I'm here to help! Let me share some insights on that topic."
            ],
            creative: [
                "What an interesting perspective! Let me explore this creatively with you.",
                "I love how you're thinking about this! Here's a creative approach we could take.",
                "That sparks some fascinating ideas! Let me share some creative possibilities.",
                "Your question opens up so many creative avenues! Let's explore them together.",
                "What a wonderful opportunity to think outside the box! Here are some creative ideas."
            ],
            professional: [
                "Thank you for your inquiry. I'll provide you with a professional analysis.",
                "I appreciate your question. Allow me to offer a structured response.",
                "Based on best practices and industry standards, here's my recommendation.",
                "From a professional standpoint, I would suggest the following approach.",
                "Let me provide you with a comprehensive professional assessment."
            ],
            casual: [
                "Hey! That's a cool question. Let me share what I think about it.",
                "Oh, I love talking about this stuff! Here's what I know.",
                "That's awesome that you asked! I've got some thoughts on this.",
                "Nice question! Let me tell you what I think about that.",
                "Hey there! I'm excited to chat about this with you."
            ]
        };
        
        const personalityResponses = responses[this.settings.aiPersonality] || responses.helpful;
        const baseResponse = personalityResponses[Math.floor(Math.random() * personalityResponses.length)];
        
        // Add contextual responses based on keywords
        const lowerMessage = userMessage.toLowerCase();
        
        if (lowerMessage.includes('weather')) {
            return baseResponse + " For weather information, I'd recommend checking a reliable weather service like Weather.com or your local meteorological service for the most accurate and up-to-date forecasts.";
        }
        
        if (lowerMessage.includes('recipe') || lowerMessage.includes('cooking')) {
            return baseResponse + " For cooking and recipes, I suggest starting with simple, healthy ingredients. Would you like me to suggest some basic cooking techniques or specific dietary preferences you'd like to explore?";
        }
        
        if (lowerMessage.includes('programming') || lowerMessage.includes('code')) {
            return baseResponse + " Programming is such an exciting field! Whether you're interested in web development, mobile apps, or data science, the key is to start with the fundamentals and practice regularly. What specific area of programming interests you most?";
        }
        
        if (lowerMessage.includes('travel')) {
            return baseResponse + " Travel planning can be so much fun! Consider factors like your budget, preferred activities, climate, and local culture. Would you like suggestions for specific destinations or travel planning tips?";
        }
        
        if (lowerMessage.includes('email') || lowerMessage.includes('write')) {
            return baseResponse + " For professional writing, clarity and conciseness are key. Start with a clear subject line, use a professional greeting, state your purpose early, and end with a clear call to action. Would you like help with a specific type of communication?";
        }
        
        // Default responses for general queries
        const generalResponses = [
            baseResponse + " I'm designed to be helpful across a wide range of topics. Feel free to ask me about anything you're curious about!",
            baseResponse + " I enjoy our conversations and I'm here to assist you with information, creative ideas, or just friendly chat.",
            baseResponse + " Every question is an opportunity to learn and share knowledge. What would you like to explore together?",
            baseResponse + " I'm constantly learning and improving to provide you with the best possible assistance.",
            baseResponse + " Thank you for engaging with me! I find our conversations quite enriching."
        ];
        
        return generalResponses[Math.floor(Math.random() * generalResponses.length)];
    }

    scrollToBottom() {
        const chatContainer = document.querySelector('.chat-container');
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    createNewChat() {
        const chatId = 'chat_' + Date.now();
        const newChat = {
            id: chatId,
            title: `Chat ${this.chatHistory.length + 1}`,
            messages: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            lastMessage: 'New conversation'
        };
        
        this.chatHistory.unshift(newChat);
        this.currentChatId = chatId;
        this.clearChatMessages();
        this.loadChatHistory();
        this.saveChatHistory();
        
        // Show suggested prompts for new chat
        document.getElementById('suggestedPrompts').style.display = 'block';
        
        // Add welcome message
        this.addMessage("Hello! I'm your AI Assistant. I'm here to help you with questions, provide information, assist with tasks, and have meaningful conversations. How can I help you today?", 'ai');
    }

    clearChatMessages() {
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.innerHTML = '';
        this.messageCount = 0;
    }

    loadChat(chatId) {
        const chat = this.chatHistory.find(c => c.id === chatId);
        if (!chat) return;
        
        this.currentChatId = chatId;
        this.clearChatMessages();
        
        // Load messages
        chat.messages.forEach(msg => {
            this.addMessage(msg.content, msg.sender, new Date(msg.timestamp));
        });
        
        // Update active chat in history
        document.querySelectorAll('.history-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-chat-id') === chatId) {
                item.classList.add('active');
            }
        });
        
        // Hide suggested prompts if there are messages
        if (chat.messages.length > 1) {
            document.getElementById('suggestedPrompts').style.display = 'none';
        }
    }

    loadChatHistory() {
        const historyList = document.getElementById('historyList');
        historyList.innerHTML = '';
        
        this.chatHistory.forEach(chat => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.setAttribute('data-chat-id', chat.id);
            
            if (chat.id === this.currentChatId) {
                historyItem.classList.add('active');
            }
            
            historyItem.innerHTML = `
                <div class="history-item-title">${chat.title}</div>
                <div class="history-item-time">${this.formatTime(new Date(chat.updatedAt))}</div>
            `;
            
            historyItem.addEventListener('click', () => this.loadChat(chat.id));
            historyList.appendChild(historyItem);
        });
    }

    saveChatHistory() {
        localStorage.setItem('chatHistory', JSON.stringify(this.chatHistory));
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('active');
    }

    toggleSettingsDropdown() {
        const dropdown = document.getElementById('settingsDropdown');
        dropdown.classList.toggle('active');
    }

    handleSettingAction(action) {
        switch (action) {
            case 'theme':
                this.toggleTheme();
                break;
            case 'clear':
                this.clearAllHistory();
                break;
            case 'export':
                this.exportChat();
                break;
        }
        
        this.toggleSettingsDropdown();
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        this.settings.darkMode = newTheme === 'dark';
        this.saveSettings();
        
        // Update settings button text
        const themeBtn = document.querySelector('[data-setting="theme"]');
        themeBtn.textContent = newTheme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
    }

    clearAllHistory() {
        if (confirm('Are you sure you want to clear all chat history? This action cannot be undone.')) {
            this.chatHistory = [];
            this.saveChatHistory();
            this.loadChatHistory();
            this.createNewChat();
        }
    }

    exportChat() {
        if (!this.currentChatId) return;
        
        const chat = this.chatHistory.find(c => c.id === this.currentChatId);
        if (!chat) return;
        
        const exportData = {
            title: chat.title,
            createdAt: chat.createdAt,
            messages: chat.messages
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    openSettingsModal() {
        document.getElementById('modalOverlay').classList.add('active');
        this.loadSettingsToModal();
    }

    closeModal() {
        document.getElementById('modalOverlay').classList.remove('active');
    }

    loadSettingsToModal() {
        document.getElementById('darkModeToggle').checked = this.settings.darkMode;
        document.getElementById('soundToggle').checked = this.settings.soundEffects;
        document.getElementById('autoScrollToggle').checked = this.settings.autoScroll;
        document.getElementById('responseSpeed').value = this.settings.responseSpeed;
        document.getElementById('aiPersonality').value = this.settings.aiPersonality;
    }

    saveSettings() {
        this.settings = {
            darkMode: document.getElementById('darkModeToggle').checked,
            soundEffects: document.getElementById('soundToggle').checked,
            autoScroll: document.getElementById('autoScrollToggle').checked,
            responseSpeed: document.getElementById('responseSpeed').value,
            aiPersonality: document.getElementById('aiPersonality').value
        };
        
        localStorage.setItem('chatSettings', JSON.stringify(this.settings));
        this.loadSettings();
        this.closeModal();
    }

    resetSettings() {
        this.settings = {
            darkMode: false,
            soundEffects: true,
            autoScroll: true,
            responseSpeed: 'normal',
            aiPersonality: 'helpful'
        };
        
        this.loadSettingsToModal();
        this.saveSettings();
    }

    loadSettings() {
        // Apply theme
        document.documentElement.setAttribute('data-theme', this.settings.darkMode ? 'dark' : 'light');
        
        // Update theme button text
        const themeBtn = document.querySelector('[data-setting="theme"]');
        if (themeBtn) {
            themeBtn.textContent = this.settings.darkMode ? '☀️ Light Mode' : '🌙 Dark Mode';
        }
    }

    toggleVoiceInput() {
        // Placeholder for voice input functionality
        this.showNotification('Voice input feature coming soon!', 'info');
    }

    shareChat() {
        if (!this.currentChatId) return;
        
        const chat = this.chatHistory.find(c => c.id === this.currentChatId);
        if (!chat || chat.messages.length === 0) {
            this.showNotification('No messages to share', 'warning');
            return;
        }
        
        // Create shareable text
        let shareText = `AI Chat - ${chat.title}\n\n`;
        chat.messages.forEach(msg => {
            const sender = msg.sender === 'user' ? 'You' : 'AI';
            shareText += `${sender}: ${msg.content}\n\n`;
        });
        
        if (navigator.share) {
            navigator.share({
                title: `AI Chat - ${chat.title}`,
                text: shareText
            });
        } else {
            navigator.clipboard.writeText(shareText).then(() => {
                this.showNotification('Chat copied to clipboard!', 'success');
            });
        }
    }

    handleAttachment() {
        // Placeholder for file attachment functionality
        this.showNotification('File attachment feature coming soon!', 'info');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--${type === 'success' ? 'success' : type === 'warning' ? 'warning' : type === 'error' ? 'danger' : 'primary'}-color);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    playSound(type) {
        // Create audio context for sound effects
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        if (type === 'send') {
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
        } else if (type === 'receive') {
            oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);
        }
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize the AI Chatbot
document.addEventListener('DOMContentLoaded', () => {
    new AIChatbot();
    console.log('AI Assistant chatbot initialized!');
});