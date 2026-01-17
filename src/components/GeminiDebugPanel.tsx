import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { AlertCircle, CheckCircle, XCircle, Sparkles, RefreshCw } from "lucide-react";
import { GeminiService } from "../utils/geminiService";
import { toast } from "sonner";
import { useTheme } from "./ThemeContext";

export default function GeminiDebugPanel({ onClose }: { onClose: () => void }) {
  const { isDarkMode } = useTheme();
  const [testing, setTesting] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [testMessage, setTestMessage] = useState("Hello! How are you?");

  const checkAPIConfiguration = () => {
    const configured = GeminiService.areKeysConfigured();
    console.log('\n=== 🔍 API KEYS CONFIGURATION CHECK ===');
    console.log('✅ GeminiService.areKeysConfigured():', configured);
    
    // Try to access environment variables
    try {
      if (typeof import.meta !== 'undefined' && import.meta.env) {
        const env = import.meta.env;
        console.log('\n📋 Environment Variables Status:');
        console.log('  VITE_GEMINI_AURA_KEY:', env.VITE_GEMINI_AURA_KEY ? `✅ SET (${env.VITE_GEMINI_AURA_KEY.substring(0, 20)}...)` : '❌ NOT SET');
        console.log('  VITE_GEMINI_SPARK_KEY:', env.VITE_GEMINI_SPARK_KEY ? `✅ SET (${env.VITE_GEMINI_SPARK_KEY.substring(0, 20)}...)` : '❌ NOT SET');
        console.log('  VITE_GEMINI_ZEN_KEY:', env.VITE_GEMINI_ZEN_KEY ? `✅ SET (${env.VITE_GEMINI_ZEN_KEY.substring(0, 20)}...)` : '❌ NOT SET');
        
        console.log('\n📝 Full environment object keys:', Object.keys(env).filter(k => k.startsWith('VITE_')));
      } else {
        console.log('❌ import.meta.env not available');
      }
    } catch (error) {
      console.error('Error checking environment:', error);
    }
    
    console.log('=== END CONFIGURATION CHECK ===\n');
    return configured;
  };

  const testBot = async (botName: string) => {
    console.log(`\n🧪 Testing ${botName}...`);
    setTesting(true);
    
    try {
      const startTime = Date.now();
      console.log(`⏱️ Sending test message: "${testMessage}"`);
      
      const response = await GeminiService.generateResponse(
        botName,
        testMessage,
        [],
        false
      );
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      console.log(`✅ ${botName} Response (${duration}ms):`, response);
      
      return {
        success: true,
        response: response.substring(0, 200) + (response.length > 200 ? "..." : ""),
        duration,
        error: null
      };
    } catch (error: any) {
      console.error(`❌ ${botName} Error:`, error);
      return {
        success: false,
        response: null,
        duration: 0,
        error: error.message || "Unknown error"
      };
    } finally {
      setTesting(false);
    }
  };

  const runFullTest = async () => {
    console.log("\n=== 🚀 STARTING FULL GEMINI API TEST ===\n");
    setTesting(true);
    setTestResults(null);
    
    const configured = checkAPIConfiguration();
    
    const results = {
      configured,
      timestamp: new Date().toISOString(),
      bots: {
        aura: null as any,
        spark: null as any,
        zen: null as any
      }
    };
    
    if (!configured) {
      console.log("\n⚠️ API Keys not configured. Skipping API tests.");
      console.log("\n📝 To configure API keys:");
      console.log("1. Create a .env file in the root directory");
      console.log("2. Add the following keys:");
      console.log("   VITE_GEMINI_AURA_KEY=your_key_here");
      console.log("   VITE_GEMINI_SPARK_KEY=your_key_here");
      console.log("   VITE_GEMINI_ZEN_KEY=your_key_here");
      console.log("3. Restart the development server");
      
      toast.error("API keys not configured. Check console for setup instructions.");
      setTestResults(results);
      setTesting(false);
      return;
    }
    
    // Test Aura
    console.log("\n--- Testing Aura ---");
    results.bots.aura = await testBot("Aura - Mental Health Support");
    
    // Test Spark
    console.log("\n--- Testing Spark ---");
    results.bots.spark = await testBot("Spark - Motivational Support");
    
    // Test Zen
    console.log("\n--- Testing Zen ---");
    results.bots.zen = await testBot("Zen - Self-Care Chatbot");
    
    console.log("\n=== ✅ TEST COMPLETE ===\n");
    console.log("Results:", results);
    
    setTestResults(results);
    setTesting(false);
    
    const successCount = Object.values(results.bots).filter((r: any) => r?.success).length;
    if (successCount === 3) {
      toast.success("All bots tested successfully! ✨");
    } else if (successCount > 0) {
      toast.error(`${successCount}/3 bots working. Check console for details.`);
    } else {
      toast.error("All bot tests failed. Check console for details.");
    }
  };

  const BotTestResult = ({ name, result }: { name: string; result: any }) => {
    if (!result) {
      return (
        <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-gray-400" />
            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Not tested yet</span>
          </div>
        </div>
      );
    }

    return (
      <div className={`p-4 rounded-lg border ${
        result.success 
          ? isDarkMode ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200'
          : isDarkMode ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-200'
      }`}>
        <div className="flex items-start gap-3">
          {result.success ? (
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          ) : (
            <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={result.success ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}>
                {name}
              </span>
              {result.success && (
                <Badge variant="outline" className="text-xs">
                  {result.duration}ms
                </Badge>
              )}
            </div>
            {result.success ? (
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {result.response}
              </p>
            ) : (
              <p className="text-sm text-red-600 dark:text-red-400">
                Error: {result.error}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto ${
        isDarkMode ? 'bg-slate-900 border-purple-500/30' : 'bg-white'
      }`}>
        <div className={`p-6 border-b ${isDarkMode ? 'border-purple-500/30' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-500" />
              Gemini API Debug Panel
            </h2>
            <Button variant="ghost" onClick={onClose}>✕</Button>
          </div>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Test Gemini API integration and view detailed logs in browser console (F12)
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* API Configuration Status */}
          <div>
            <h3 className="mb-3">API Configuration</h3>
            <div className={`p-4 rounded-lg border ${
              GeminiService.areKeysConfigured()
                ? isDarkMode ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200'
                : isDarkMode ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-start gap-3">
                {GeminiService.areKeysConfigured() ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-green-700 dark:text-green-300">
                        API keys are configured ✅
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                        All three bot API keys detected in environment variables
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-700 dark:text-red-300 mb-2">
                        API keys not found ❌
                      </p>
                      <div className="text-sm text-red-600 dark:text-red-400 space-y-1">
                        <p>To configure API keys:</p>
                        <ol className="list-decimal ml-4 space-y-1">
                          <li>Create a <code className="bg-black/10 px-1 rounded">.env</code> file in the root directory</li>
                          <li>Add these variables:
                            <pre className="bg-black/10 p-2 rounded mt-1 text-xs">
{`VITE_GEMINI_AURA_KEY=your_key_here
VITE_GEMINI_SPARK_KEY=your_key_here
VITE_GEMINI_ZEN_KEY=your_key_here`}
                            </pre>
                          </li>
                          <li>Restart the development server</li>
                        </ol>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Test Controls */}
          <div>
            <h3 className="mb-3">Test Message</h3>
            <div className="flex gap-2">
              <Input
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                placeholder="Enter test message..."
                className={isDarkMode ? 'bg-slate-800 border-purple-500/30' : ''}
              />
              <Button
                onClick={runFullTest}
                disabled={testing}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                {testing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Run Test
                  </>
                )}
              </Button>
            </div>
            <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              This will test all three chatbots and log detailed results to the console
            </p>
          </div>

          {/* Test Results */}
          {testResults && (
            <div>
              <h3 className="mb-3">Test Results</h3>
              <div className="space-y-3">
                <BotTestResult name="Aura - Mental Health Support" result={testResults.bots.aura} />
                <BotTestResult name="Spark - Motivational Support" result={testResults.bots.spark} />
                <BotTestResult name="Zen - Self-Care Chatbot" result={testResults.bots.zen} />
              </div>
              
              <div className={`mt-4 p-3 rounded-lg text-sm ${
                isDarkMode ? 'bg-blue-900/20 border border-blue-700' : 'bg-blue-50 border border-blue-200'
              }`}>
                <p className={isDarkMode ? 'text-blue-300' : 'text-blue-700'}>
                  💡 <strong>Tip:</strong> Open your browser console (F12) to see detailed logs and debugging information
                </p>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-purple-900/20 border border-purple-700' : 'bg-purple-50 border border-purple-200'}`}>
            <h4 className={`mb-2 ${isDarkMode ? 'text-purple-300' : 'text-purple-900'}`}>
              📖 How to Use
            </h4>
            <ol className={`text-sm space-y-1 list-decimal ml-4 ${isDarkMode ? 'text-purple-200' : 'text-purple-800'}`}>
              <li>Open browser DevTools (F12) to view detailed logs</li>
              <li>Click "Run Test" to test all three chatbots</li>
              <li>Check console for API key status and response details</li>
              <li>If tests fail, follow the configuration instructions above</li>
            </ol>
          </div>
        </div>
      </Card>
    </div>
  );
}