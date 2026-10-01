"""
Test suite for Outdooroots AI Chat feature - xAI Grok-3 streaming endpoint
Tests: POST /api/chat endpoint with SSE streaming responses
"""
import pytest
import requests
import os
import json

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestChatEndpoint:
    """Tests for POST /api/chat endpoint with xAI Grok-3 streaming"""
    
    def test_chat_endpoint_returns_streaming_response(self):
        """Test that chat endpoint returns SSE streaming response"""
        response = requests.post(
            f"{BASE_URL}/api/chat",
            json={"messages": [{"role": "user", "content": "Hello"}]},
            headers={"Content-Type": "application/json"},
            stream=True,
            timeout=30
        )
        
        assert response.status_code == 200
        assert "text/event-stream" in response.headers.get("Content-Type", "")
        
        # Read first few chunks to verify SSE format
        chunks_received = 0
        for line in response.iter_lines(decode_unicode=True):
            if line and line.startswith("data: "):
                chunks_received += 1
                data = line[6:]  # Remove "data: " prefix
                if data == "[DONE]":
                    break
                # Verify JSON format
                parsed = json.loads(data)
                assert "content" in parsed
                if chunks_received >= 3:
                    break
        
        assert chunks_received > 0, "Should receive at least one SSE chunk"
        print(f"✓ Received {chunks_received} SSE chunks with valid format")
    
    def test_chat_with_patagonia_question(self):
        """Test chat responds with relevant Chile travel info for Patagonia question"""
        response = requests.post(
            f"{BASE_URL}/api/chat",
            json={"messages": [{"role": "user", "content": "Best time to visit Patagonia?"}]},
            headers={"Content-Type": "application/json"},
            stream=True,
            timeout=60
        )
        
        assert response.status_code == 200
        
        # Accumulate full response
        full_content = ""
        for line in response.iter_lines(decode_unicode=True):
            if line and line.startswith("data: "):
                data = line[6:]
                if data == "[DONE]":
                    break
                try:
                    parsed = json.loads(data)
                    if "content" in parsed:
                        full_content += parsed["content"]
                except json.JSONDecodeError:
                    pass
        
        # Verify response contains relevant content
        full_content_lower = full_content.lower()
        assert len(full_content) > 50, "Response should be substantial"
        # Should mention time-related info or Patagonia
        assert any(word in full_content_lower for word in ["october", "march", "summer", "patagonia", "torres"]), \
            f"Response should contain relevant Patagonia travel info. Got: {full_content[:200]}"
        print(f"✓ Received relevant Patagonia response ({len(full_content)} chars)")
    
    def test_chat_conversation_history(self):
        """Test that chat maintains conversation context with multiple messages"""
        messages = [
            {"role": "user", "content": "I want to visit Chile"},
            {"role": "assistant", "content": "Chile is wonderful! What regions interest you?"},
            {"role": "user", "content": "Tell me about the desert region"}
        ]
        
        response = requests.post(
            f"{BASE_URL}/api/chat",
            json={"messages": messages},
            headers={"Content-Type": "application/json"},
            stream=True,
            timeout=60
        )
        
        assert response.status_code == 200
        
        full_content = ""
        for line in response.iter_lines(decode_unicode=True):
            if line and line.startswith("data: "):
                data = line[6:]
                if data == "[DONE]":
                    break
                try:
                    parsed = json.loads(data)
                    if "content" in parsed:
                        full_content += parsed["content"]
                except json.JSONDecodeError:
                    pass
        
        # Should mention Atacama (the desert region)
        full_content_lower = full_content.lower()
        assert any(word in full_content_lower for word in ["atacama", "desert", "san pedro"]), \
            f"Response should reference Atacama desert. Got: {full_content[:200]}"
        print(f"✓ Conversation context maintained, Atacama mentioned")
    
    def test_chat_spanish_response(self):
        """Test that AI responds in Spanish when user writes in Spanish"""
        response = requests.post(
            f"{BASE_URL}/api/chat",
            json={"messages": [{"role": "user", "content": "¿Cuál es el mejor momento para visitar la Patagonia?"}]},
            headers={"Content-Type": "application/json"},
            stream=True,
            timeout=60
        )
        
        assert response.status_code == 200
        
        full_content = ""
        for line in response.iter_lines(decode_unicode=True):
            if line and line.startswith("data: "):
                data = line[6:]
                if data == "[DONE]":
                    break
                try:
                    parsed = json.loads(data)
                    if "content" in parsed:
                        full_content += parsed["content"]
                except json.JSONDecodeError:
                    pass
        
        # Should contain Spanish words
        spanish_indicators = ["el", "la", "de", "en", "es", "para", "mejor", "octubre", "marzo"]
        spanish_count = sum(1 for word in spanish_indicators if word in full_content.lower())
        assert spanish_count >= 3, f"Response should be in Spanish. Got: {full_content[:200]}"
        print(f"✓ Response in Spanish (found {spanish_count} Spanish indicators)")
    
    def test_chat_empty_messages_rejected(self):
        """Test that empty messages array is rejected"""
        response = requests.post(
            f"{BASE_URL}/api/chat",
            json={"messages": []},
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        assert response.status_code == 422, f"Empty messages should return 422, got {response.status_code}"
        print("✓ Empty messages correctly rejected with 422")
    
    def test_chat_invalid_role_rejected(self):
        """Test that invalid message role is rejected"""
        response = requests.post(
            f"{BASE_URL}/api/chat",
            json={"messages": [{"role": "invalid", "content": "Hello"}]},
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        assert response.status_code == 422, f"Invalid role should return 422, got {response.status_code}"
        print("✓ Invalid role correctly rejected with 422")
    
    def test_chat_missing_content_rejected(self):
        """Test that message without content is rejected"""
        response = requests.post(
            f"{BASE_URL}/api/chat",
            json={"messages": [{"role": "user"}]},
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        assert response.status_code == 422, f"Missing content should return 422, got {response.status_code}"
        print("✓ Missing content correctly rejected with 422")
    
    def test_chat_sse_done_marker(self):
        """Test that SSE stream ends with [DONE] marker"""
        response = requests.post(
            f"{BASE_URL}/api/chat",
            json={"messages": [{"role": "user", "content": "Say hi briefly"}]},
            headers={"Content-Type": "application/json"},
            stream=True,
            timeout=30
        )
        
        assert response.status_code == 200
        
        last_data_line = None
        for line in response.iter_lines(decode_unicode=True):
            if line and line.startswith("data: "):
                last_data_line = line[6:]
        
        assert last_data_line == "[DONE]", f"Stream should end with [DONE], got: {last_data_line}"
        print("✓ SSE stream correctly ends with [DONE] marker")


class TestChatHeaders:
    """Test response headers for SSE streaming"""
    
    def test_chat_sse_headers(self):
        """Test that correct SSE headers are returned"""
        response = requests.post(
            f"{BASE_URL}/api/chat",
            json={"messages": [{"role": "user", "content": "Hi"}]},
            headers={"Content-Type": "application/json"},
            stream=True,
            timeout=30
        )
        
        assert response.status_code == 200
        assert "text/event-stream" in response.headers.get("Content-Type", "")
        cache_control = response.headers.get("Cache-Control", "")
        assert "no-cache" in cache_control, f"Cache-Control should contain no-cache, got: {cache_control}"
        print("✓ SSE headers correct (Content-Type, Cache-Control)")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
