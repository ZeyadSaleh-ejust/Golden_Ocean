import { spawn } from 'child_process';
import { config } from 'dotenv';

// Load environment variables
config();

const NGROK_API_KEY = process.env.NGROK_API_KEY;
const PORT = process.env.VITE_PORT || 5173;

if (!NGROK_API_KEY) {
    console.error('❌ Error: NGROK_API_KEY not found in .env file');
    console.error('Please add your ngrok API key to the .env file:');
    console.error('NGROK_API_KEY=your_api_key_here');
    process.exit(1);
}

console.log('🚀 Starting Golden Ocean with ngrok...\n');

// Start Vite dev server
console.log('📦 Starting Vite development server...');
const viteServer = spawn('npm', ['run', 'dev'], {
    shell: true,
    stdio: 'inherit'
});

let ngrokProcess = null;

// Wait for Vite to start (usually takes 2-3 seconds)
setTimeout(() => {
    console.log('\n🌐 Starting ngrok tunnel...');
    console.log('⏳ Please wait, this may take a few seconds...\n');

    // Start ngrok with better output handling
    ngrokProcess = spawn('ngrok', [
        'http',
        PORT.toString(),
        '--authtoken',
        NGROK_API_KEY
    ], {
        shell: true,
        stdio: ['ignore', 'inherit', 'inherit']  // Show stdout and stderr
    });

    ngrokProcess.on('error', (error) => {
        console.error('\n❌ Error starting ngrok:', error.message);
        console.error('\nMake sure ngrok is installed:');
        console.error('npm install -g ngrok');
        console.error('\nOr download from: https://ngrok.com/download');
        viteServer.kill();
        process.exit(1);
    });

    // Give ngrok time to start before showing success message
    setTimeout(() => {
        console.log('\n✅ Ngrok tunnel should now be running!');
        console.log('📱 Share the ngrok URL to make your app accessible to anyone\n');
        console.log('ℹ️  To view the ngrok dashboard and get your public URL:');
        console.log('   Open: http://localhost:4040');
        console.log('\n💡 Tip: Look for the "Forwarding" URL in the output above\n');
    }, 2000);

}, 3000);

// Handle process termination
process.on('SIGINT', () => {
    console.log('\n\n🛑 Shutting down servers...');
    if (ngrokProcess) ngrokProcess.kill();
    viteServer.kill();
    process.exit(0);
});

viteServer.on('exit', (code) => {
    console.log(`\n🛑 Vite server exited with code ${code}`);
    if (ngrokProcess) ngrokProcess.kill();
    process.exit(code);
});
