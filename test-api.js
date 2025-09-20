// Test script to verify backend API endpoints
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:8000';

async function testAuth() {
  try {
    // Test registration
    console.log('Testing registration...');
    const registerResponse = await fetch(`${BASE_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `test${Date.now()}@example.com`,
        password: 'testpassword123',
        role: 'user'
      })
    });
    
    const registerData = await registerResponse.json();
    console.log('Register response:', registerResponse.status, registerData);
    
    if (!registerResponse.ok) {
      throw new Error(`Registration failed: ${JSON.stringify(registerData)}`);
    }
    
    // Test login
    console.log('\nTesting login...');
    const loginResponse = await fetch(`${BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'testpassword'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('Login response:', loginResponse.status, loginData);
    
    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${JSON.stringify(loginData)}`);
    }
    
    console.log('\n✅ Authentication tests passed!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

testAuth();
