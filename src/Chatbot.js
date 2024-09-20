import React, { useState, useEffect } from 'react';
import api from './api'; // Your API utility

const Chatbot = () => {
    const [userMessage, setUserMessage] = useState('');
    const [messages, setMessages] = useState([]);

    // Display introductory message on load
    useEffect(() => {
        const introMessage = {
            text: "Welcome to the medical chatbot! You can ask me any queries related to the medical field.",
            type: 'bot'
        };
        setMessages([introMessage]);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (userMessage.trim() === '') return;

        // Add user message to the chat
        setMessages([...messages, { text: userMessage, type: 'user' }]);
        setUserMessage('');

        try {
            const res = await api.post('/chat', { message: userMessage });

            // Safely extract the bot's response (content from the 'choices' array)
            const botResponse = res.data?.choices?.[0]?.message?.content || "I'm a medical chatbot. Please ask questions related to medical topics.";

            // Add bot response to the chat
            setMessages(prevMessages => [
                ...prevMessages,
                { text: botResponse, type: 'bot' }
            ]);
        } catch (error) {
            console.error("Error communicating with the backend:", error);
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-window">
                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={`chat-message ${msg.type}`}>
                            {msg.text}
                        </div>
                    ))}
                </div>
            </div>
            <form className="chat-input" onSubmit={handleSubmit}>
                <textarea
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    placeholder="Type your message here..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default Chatbot;
