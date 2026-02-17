const BASE_URL = 'http://localhost:9000';
const EMAIL = 'bomesi1406@advarm.com';
const PASSWORD = 'password';

async function runTests() {
    let token = '';
    let pollId = null;
    let optionId = null;

    console.log('--- Starting API Tests ---');

    // 1. Signup
    try {
        console.log('\n[1] Testing Signup...');
        const signupRes = await fetch(`${BASE_URL}/api/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: EMAIL,
                password: PASSWORD,
                firstName: 'Bomesi',
                lastName: 'User'
            })
        });

        const signupData = await signupRes.json();
        console.log(`Status: ${signupRes.status}`);
        if (signupRes.ok || (signupRes.status === 409 && signupData.message === "User already exists")) {
            console.log('Signup Successful (or user exists):', signupData);
        } else {
            console.error('Signup Failed:', signupData);
            // Don't stop, try login anyway as user might exist
        }
    } catch (error) {
        console.error('Signup Error:', error.message);
    }

    // 2. Login
    try {
        console.log('\n[2] Testing Login...');
        const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: EMAIL,
                password: PASSWORD
            })
        });

        if (!loginRes.ok) {
            throw new Error(`Login failed with status ${loginRes.status}`);
        }

        const loginData = await loginRes.json();
        token = loginData.jwtToken;
        console.log('Login Successful. Token obtained.');
    } catch (error) {
        console.error('Login Error:', error.message);
        return; // specific exit if login fails
    }

    // 3. Create Poll
    try {
        console.log('\n[3] Testing Create Poll...');
        const createPollRes = await fetch(`${BASE_URL}/api/user/poll`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                question: "Which programming language do you prefer?",
                options: ["Java", "Python", "JavaScript", "C++"],
                expiredAt: "2026-12-31T23:59:59.000+00:00"
            })
        });

        const createPollData = await createPollRes.json().catch(() => null); // Handle potential non-JSON error response
        console.log(`Status: ${createPollRes.status}`);

        if (createPollRes.ok) {
            console.log('Create Poll Successful:', createPollData);
            pollId = createPollData.id;
            if (createPollData.optionsDTOS && createPollData.optionsDTOS.length > 0) {
                optionId = createPollData.optionsDTOS[0].id;
            }
        } else {
            console.error('Create Poll Failed:', createPollData || 'No response body (likely 500 error)');
        }
    } catch (error) {
        console.error('Create Poll Error:', error.message);
    }

    if (pollId) {
        // 4. Vote
        try {
            console.log('\n[4] Testing Vote...');
            const voteRes = await fetch(`${BASE_URL}/api/user/poll/vote`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    pollId: pollId,
                    optionId: optionId
                })
            });
            console.log(`Status: ${voteRes.status}`);
            console.log('Vote Response:', await voteRes.json());
        } catch (error) {
            console.error('Vote Error:', error.message);
        }

        // 5. Get My Polls
        try {
            console.log('\n[5] Testing Get My Polls...');
            const myPollsRes = await fetch(`${BASE_URL}/api/user/my-polls`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log(`Status: ${myPollsRes.status}`);
            const myPollsData = await myPollsRes.json();
            console.log(`Found ${myPollsData.length} polls.`);
        } catch (error) {
            console.error('Get My Polls Error:', error.message);
        }

        // 6. Comment
        try {
            console.log('\n[6] Testing Comment...');
            const commentRes = await fetch(`${BASE_URL}/api/user/poll/comment`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    pollId: pollId,
                    content: "This is a test comment"
                })
            });

            console.log(`Status: ${commentRes.status}`);
            const commentData = await commentRes.json();
            console.log('Comment Response:', commentData);
        } catch (error) {
            console.error('Comment Error:', error.message);
        }

        // 7. Like
        try {
            console.log('\n[7] Testing Like...');
            const likeRes = await fetch(`${BASE_URL}/api/user/poll/like/${pollId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(`Status: ${likeRes.status}`);
            const likeText = await likeRes.text();
            console.log('Like Response:', likeText);
        } catch (error) {
            console.error('Like Error:', error.message);
        }

        // 8. Delete
        try {
            console.log('\n[8] Testing Delete...');
            const deleteRes = await fetch(`${BASE_URL}/api/user/poll/${pollId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(`Status: ${deleteRes.status}`);
            if (deleteRes.ok) {
                console.log('Delete Successful');
            } else {
                console.error('Delete Failed');
            }
        } catch (error) {
            console.error('Delete Error:', error.message); // Fixed trailing brace in output
        }
    }

    console.log('\n--- Tests Completed ---');
}

runTests();
