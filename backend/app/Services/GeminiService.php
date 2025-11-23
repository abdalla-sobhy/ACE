<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class GeminiService
{
    private $apiKey;
    private $model;
    private $baseUrl;

    public function __construct()
    {
        $this->apiKey = config('services.gemini.api_key');
        $this->model = config('services.gemini.model', 'gemini-2.0-flash-exp');
        $this->baseUrl = config('services.gemini.base_url');
    }

    /**
     * Send a chat message to Gemini AI
     *
     * @param string $message User's message
     * @param array $conversationHistory Previous conversation history
     * @param array $systemContext Additional context for the AI
     * @return array
     */
    public function chat(string $message, array $conversationHistory = [], array $systemContext = [])
    {
        try {
            if (empty($this->apiKey)) {
                Log::warning('Gemini API key not configured');
                return [
                    'success' => false,
                    'error' => 'AI service is not configured. Please add your GEMINI_API_KEY to the .env file. Get your API key from https://aistudio.google.com/app/apikey',
                ];
            }

            // Build the conversation contents
            $contents = $this->buildContents($message, $conversationHistory, $systemContext);

            // Make API request
            $response = $this->makeRequest('/generateContent', [
                'contents' => $contents,
                'generationConfig' => [
                    'temperature' => 0.7,
                    'topK' => 40,
                    'topP' => 0.95,
                    'maxOutputTokens' => 2048,
                ],
                'safetySettings' => [
                    [
                        'category' => 'HARM_CATEGORY_HARASSMENT',
                        'threshold' => 'BLOCK_MEDIUM_AND_ABOVE',
                    ],
                    [
                        'category' => 'HARM_CATEGORY_HATE_SPEECH',
                        'threshold' => 'BLOCK_MEDIUM_AND_ABOVE',
                    ],
                    [
                        'category' => 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                        'threshold' => 'BLOCK_MEDIUM_AND_ABOVE',
                    ],
                    [
                        'category' => 'HARM_CATEGORY_DANGEROUS_CONTENT',
                        'threshold' => 'BLOCK_MEDIUM_AND_ABOVE',
                    ],
                ],
            ]);

            if ($response['success']) {
                $text = $response['data']['candidates'][0]['content']['parts'][0]['text'] ?? '';

                return [
                    'success' => true,
                    'message' => $text,
                    'raw_response' => $response['data'],
                ];
            }

            return $response;

        } catch (\Exception $e) {
            Log::error('Gemini chat error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return [
                'success' => false,
                'error' => 'An error occurred while processing your request',
            ];
        }
    }

    /**
     * Analyze a CV/Resume and provide career guidance
     *
     * @param string $cvPath Path to CV file in storage
     * @param string $question Specific question about career guidance
     * @param array $userProfile User's profile information
     * @return array
     */
    public function analyzeCv(string $cvPath, string $question = '', array $userProfile = [])
    {
        try {
            if (empty($this->apiKey)) {
                Log::warning('Gemini API key not configured for CV analysis');
                return [
                    'success' => false,
                    'error' => 'AI service is not configured. Please add your GEMINI_API_KEY to the .env file. Get your API key from https://aistudio.google.com/app/apikey',
                ];
            }

            // Read the CV file
            $cvContent = $this->extractCvContent($cvPath);

            if (!$cvContent) {
                return [
                    'success' => false,
                    'error' => 'Unable to read CV file',
                ];
            }

            // Build context from user profile
            $profileContext = $this->buildProfileContext($userProfile);

            // Create a comprehensive prompt for CV analysis
            $prompt = $this->buildCvAnalysisPrompt($cvContent, $question, $profileContext);

            // Use the chat method with CV context
            return $this->chat($prompt, [], [
                'cv_content' => $cvContent,
                'user_profile' => $userProfile,
            ]);

        } catch (\Exception $e) {
            Log::error('Gemini CV analysis error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return [
                'success' => false,
                'error' => 'An error occurred while analyzing your CV',
            ];
        }
    }

    /**
     * Get personalized learning path recommendations
     *
     * @param array $userProfile User's profile with skills, interests, etc.
     * @param string $goal Career goal or area of interest
     * @return array
     */
    public function getLearningPath(array $userProfile, string $goal = '')
    {
        $profileContext = $this->buildProfileContext($userProfile);

        $prompt = "As a career advisor, analyze this profile and provide a personalized learning path:\n\n";
        $prompt .= $profileContext . "\n\n";

        if ($goal) {
            $prompt .= "Career Goal: {$goal}\n\n";
        }

        $prompt .= "Please provide:\n";
        $prompt .= "1. Top 5 skills to learn next (prioritized)\n";
        $prompt .= "2. Recommended courses or resources for each skill\n";
        $prompt .= "3. Estimated timeline for learning each skill\n";
        $prompt .= "4. How these skills align with current job market trends\n";
        $prompt .= "5. Practical projects to build while learning\n\n";
        $prompt .= "Format the response in a clear, structured way with actionable steps.";

        return $this->chat($prompt);
    }

    /**
     * Get job role recommendations based on profile
     *
     * @param array $userProfile User's profile with skills, education, etc.
     * @return array
     */
    public function getJobRecommendations(array $userProfile)
    {
        $profileContext = $this->buildProfileContext($userProfile);

        $prompt = "As a career counselor, analyze this profile and recommend suitable job roles:\n\n";
        $prompt .= $profileContext . "\n\n";
        $prompt .= "Please provide:\n";
        $prompt .= "1. Top 5-7 job roles that match this profile (from entry-level to advanced)\n";
        $prompt .= "2. For each role:\n";
        $prompt .= "   - Why it's a good match\n";
        $prompt .= "   - Skills already possessed that fit this role\n";
        $prompt .= "   - Skills gaps to address\n";
        $prompt .= "   - Typical salary range in Egypt (in EGP)\n";
        $prompt .= "   - Career growth potential\n";
        $prompt .= "3. Industry trends for these roles in Egypt\n\n";
        $prompt .= "Be specific and practical in your recommendations.";

        return $this->chat($prompt);
    }

    /**
     * Get skills gap analysis
     *
     * @param array $userProfile User's current skills
     * @param string $targetRole Target job role
     * @return array
     */
    public function getSkillsGapAnalysis(array $userProfile, string $targetRole)
    {
        $profileContext = $this->buildProfileContext($userProfile);

        $prompt = "Analyze the skills gap for this profile targeting a {$targetRole} position:\n\n";
        $prompt .= $profileContext . "\n\n";
        $prompt .= "Please provide:\n";
        $prompt .= "1. Skills this person already has that match the role\n";
        $prompt .= "2. Critical skills missing for the role (must-have)\n";
        $prompt .= "3. Nice-to-have skills that would be beneficial\n";
        $prompt .= "4. Recommended learning path to fill the gaps (prioritized)\n";
        $prompt .= "5. Estimated time to become job-ready\n";
        $prompt .= "6. Suggested certifications or projects to strengthen the profile\n\n";
        $prompt .= "Be honest but encouraging in the assessment.";

        return $this->chat($prompt);
    }

    /**
     * Make a request to the Gemini API
     *
     * @param string $endpoint API endpoint
     * @param array $data Request data
     * @return array
     */
    private function makeRequest(string $endpoint, array $data)
    {
        try {
            $url = $this->baseUrl . '/' . $this->model . ':' . ltrim($endpoint, '/');

            $http = Http::timeout(60)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                ]);

            // Disable SSL verification if configured (development only)
            if (env('HTTP_VERIFY_SSL', true) === false) {
                $http = $http->withoutVerifying();
                Log::warning('Gemini API: SSL verification disabled (development mode)');
            }

            $response = $http->post($url . '?key=' . $this->apiKey, $data);

            Log::info('Gemini API response', [
                'status' => $response->status(),
                'url' => $url,
            ]);

            if ($response->successful()) {
                return [
                    'success' => true,
                    'data' => $response->json(),
                ];
            }

            $errorData = $response->json();
            Log::error('Gemini API error response', [
                'status' => $response->status(),
                'error' => $errorData,
            ]);

            return [
                'success' => false,
                'error' => $errorData['error']['message'] ?? 'API request failed',
            ];

        } catch (\Exception $e) {
            Log::error('Gemini API request exception', [
                'error' => $e->getMessage(),
                'endpoint' => $endpoint,
            ]);

            return [
                'success' => false,
                'error' => 'Failed to connect to AI service',
            ];
        }
    }

    /**
     * Build conversation contents for Gemini API
     *
     * @param string $message Current message
     * @param array $history Conversation history
     * @param array $context Additional context
     * @return array
     */
    private function buildContents(string $message, array $history = [], array $context = [])
    {
        $contents = [];

        // Add conversation history
        foreach ($history as $item) {
            $contents[] = [
                'role' => $item['role'] ?? 'user',
                'parts' => [['text' => $item['message'] ?? $item['text'] ?? '']],
            ];
        }

        // Add current message with context
        $currentMessage = $message;
        if (!empty($context)) {
            $contextText = "Context:\n" . json_encode($context, JSON_PRETTY_PRINT) . "\n\nUser Message:\n" . $message;
            $currentMessage = $contextText;
        }

        $contents[] = [
            'role' => 'user',
            'parts' => [['text' => $currentMessage]],
        ];

        return $contents;
    }

    /**
     * Extract content from CV file
     *
     * @param string $cvPath Path to CV file
     * @return string|null
     */
    private function extractCvContent(string $cvPath)
    {
        try {
            // Get the full path
            $fullPath = storage_path('app/public/' . $cvPath);

            if (!file_exists($fullPath)) {
                Log::warning('CV file not found', ['path' => $fullPath]);
                return null;
            }

            $extension = strtolower(pathinfo($fullPath, PATHINFO_EXTENSION));

            // For PDFs, we'll just note that it's a PDF and ask user to provide text
            // In a production app, you'd use a PDF parser library
            if ($extension === 'pdf') {
                return "[PDF Resume/CV - Please upload a text version or use the chat to describe your background]";
            }

            // For text-based files, read directly
            if (in_array($extension, ['txt', 'doc', 'docx'])) {
                // For DOC/DOCX, ideally use a library to extract text
                // For now, we'll return a placeholder
                if (in_array($extension, ['doc', 'docx'])) {
                    return "[Resume uploaded - Please use the chat to describe your background, skills, and experience]";
                }

                return file_get_contents($fullPath);
            }

            return null;

        } catch (\Exception $e) {
            Log::error('CV extraction error', [
                'error' => $e->getMessage(),
                'path' => $cvPath,
            ]);
            return null;
        }
    }

    /**
     * Build user profile context for prompts
     *
     * @param array $userProfile User profile data
     * @return string
     */
    private function buildProfileContext(array $userProfile)
    {
        $context = "User Profile:\n";

        if (isset($userProfile['name'])) {
            $context .= "Name: {$userProfile['name']}\n";
        }

        if (isset($userProfile['university'])) {
            $context .= "University: {$userProfile['university']}\n";
        }

        if (isset($userProfile['faculty'])) {
            $context .= "Faculty/Major: {$userProfile['faculty']}\n";
        }

        if (isset($userProfile['year_of_study'])) {
            $context .= "Year of Study: {$userProfile['year_of_study']}\n";
        }

        if (isset($userProfile['gpa'])) {
            $context .= "GPA: {$userProfile['gpa']}\n";
        }

        if (isset($userProfile['skills']) && !empty($userProfile['skills'])) {
            $skills = is_array($userProfile['skills'])
                ? implode(', ', $userProfile['skills'])
                : $userProfile['skills'];
            $context .= "Skills: {$skills}\n";
        }

        if (isset($userProfile['experience'])) {
            $context .= "Experience: {$userProfile['experience']}\n";
        }

        if (isset($userProfile['languages']) && !empty($userProfile['languages'])) {
            $languages = is_array($userProfile['languages'])
                ? implode(', ', $userProfile['languages'])
                : $userProfile['languages'];
            $context .= "Languages: {$languages}\n";
        }

        if (isset($userProfile['certifications']) && !empty($userProfile['certifications'])) {
            $certifications = is_array($userProfile['certifications'])
                ? implode(', ', $userProfile['certifications'])
                : $userProfile['certifications'];
            $context .= "Certifications: {$certifications}\n";
        }

        if (isset($userProfile['projects'])) {
            $context .= "Projects: {$userProfile['projects']}\n";
        }

        if (isset($userProfile['looking_for_opportunities'])) {
            $context .= "Looking for: {$userProfile['looking_for_opportunities']}\n";
        }

        return $context;
    }

    /**
     * Build CV analysis prompt
     *
     * @param string $cvContent CV content
     * @param string $question User's specific question
     * @param string $profileContext User profile context
     * @return string
     */
    private function buildCvAnalysisPrompt(string $cvContent, string $question, string $profileContext)
    {
        $prompt = "You are an expert career advisor and resume consultant. ";
        $prompt .= "Analyze the following CV/Resume and provide professional career guidance.\n\n";

        if ($profileContext) {
            $prompt .= $profileContext . "\n\n";
        }

        $prompt .= "CV Content:\n{$cvContent}\n\n";

        if ($question) {
            $prompt .= "Specific Question: {$question}\n\n";
            $prompt .= "Please answer the question based on the CV analysis.";
        } else {
            $prompt .= "Please provide:\n";
            $prompt .= "1. Overall CV Assessment (strengths and areas for improvement)\n";
            $prompt .= "2. Top 3-5 skills highlighted in the CV\n";
            $prompt .= "3. Recommended skills to add based on current experience\n";
            $prompt .= "4. Suitable job roles based on this background\n";
            $prompt .= "5. Suggestions to make the CV more impactful\n";
            $prompt .= "6. Next career steps or learning opportunities\n\n";
            $prompt .= "Be constructive and encouraging while being honest.";
        }

        return $prompt;
    }
}
