// src/services/botpressService.js

const BASE_URL = 'https://chat.botpress.cloud/e4daeba3-c296-4803-9af6-91c0c80ab5de'; // Replace with your webhook URL
const USER_KEY = 'bp_pat_se5aRM9MJCiKOr8oH0E7YuXBHBKdDijQn4nD'; // Replace with your actual key

export const botpressService = {
    // Get a conversation by ID
    async getConversation(conversationId) {
        try {
            const response = await fetch(`${BASE_URL}/conversations/${conversationId}`, {
                method: 'GET',
                headers: {
                    'x-user-key': USER_KEY,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch conversation');
            }

            return await response.json();
        } catch (error) {
            console.error('Error getting conversation:', error);
            throw error;
        }
    },

    // Start a new conversation
    async startConversation() {
        try {
            const response = await fetch(`${BASE_URL}/conversations`, {
                method: 'POST',
                headers: {
                    'x-user-key': USER_KEY,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to start conversation');
            }

            return await response.json();
        } catch (error) {
            console.error('Error starting conversation:', error);
            throw error;
        }
    },

    // Send a message to the chatbot
    async sendMessage(conversationId, message) {
        try {
            const response = await fetch(`${BASE_URL}/conversations/${conversationId}/messages`, {
                method: 'POST',
                headers: {
                    'x-user-key': USER_KEY,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    type: 'text',
                    text: message
                })
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            return await response.json();
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    },

    // Get messages for a conversation
    async getMessages(conversationId) {
        try {
            const response = await fetch(`${BASE_URL}/conversations/${conversationId}/messages`, {
                method: 'GET',
                headers: {
                    'x-user-key': USER_KEY,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to get messages');
            }

            return await response.json();
        } catch (error) {
            console.error('Error getting messages:', error);
            throw error;
        }
    }
};