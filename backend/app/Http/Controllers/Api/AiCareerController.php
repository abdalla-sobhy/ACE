<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AiConversation;
use App\Models\UniversityStudentProfile;
use App\Models\StudentProfile;
use App\Models\Company;
use App\Services\GeminiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class AiCareerController extends Controller
{
    protected $geminiService;

    public function __construct(GeminiService $geminiService)
    {
        $this->geminiService = $geminiService;
    }

    /**
     * Get conversation history for the authenticated user
     */
    public function getHistory(Request $request)
    {
        try {
            $user = Auth::user();

            $conversations = AiConversation::where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->limit(50)
                ->get();

            return response()->json([
                'success' => true,
                'conversations' => $conversations,
            ]);

        } catch (\Exception $e) {
            Log::error('AI Career: Get history error', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch conversation history',
            ], 500);
        }
    }

    /**
     * Send a chat message to the AI
     */
    public function chat(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'message' => 'required|string|max:5000',
                'conversation_type' => 'nullable|string|in:general,cv_analysis,learning_path,job_recommendations,skills_gap',
                'include_profile' => 'nullable|boolean',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $user = Auth::user();
            $message = $request->input('message');
            $conversationType = $request->input('conversation_type', 'general');
            $includeProfile = $request->input('include_profile', true);

            // Get recent conversation history (last 10 messages for context)
            $recentConversations = AiConversation::where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get()
                ->reverse()
                ->map(function ($conv) {
                    return [
                        ['role' => 'user', 'message' => $conv->user_message],
                        ['role' => 'model', 'message' => $conv->ai_response],
                    ];
                })
                ->flatten(1)
                ->toArray();

            // Build user profile context
            $userProfile = $includeProfile ? $this->getUserProfile($user) : [];

            // Get AI response
            $response = $this->geminiService->chat(
                $message,
                $recentConversations,
                $userProfile
            );

            if (!$response['success']) {
                return response()->json([
                    'success' => false,
                    'message' => $response['error'] ?? 'Failed to get AI response',
                ], 500);
            }

            // Save conversation to database
            $conversation = AiConversation::create([
                'user_id' => $user->id,
                'conversation_type' => $conversationType,
                'user_message' => $message,
                'ai_response' => $response['message'],
                'context' => $userProfile,
                'metadata' => [
                    'model' => config('services.gemini.model'),
                    'timestamp' => now()->toIso8601String(),
                ],
            ]);

            return response()->json([
                'success' => true,
                'message' => $response['message'],
                'conversation' => $conversation,
            ]);

        } catch (\Exception $e) {
            Log::error('AI Career: Chat error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while processing your request',
            ], 500);
        }
    }

    /**
     * Analyze CV and provide career guidance
     */
    public function analyzeCv(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'question' => 'nullable|string|max:1000',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $user = Auth::user();

            // Get CV path from user profile
            $cvPath = null;
            if ($user->user_type === 'university_student') {
                $profile = UniversityStudentProfile::where('user_id', $user->id)->first();
                $cvPath = $profile ? $profile->cv_path : null;
            } elseif ($user->user_type === 'teacher') {
                $profile = $user->teacherProfile;
                $cvPath = $profile ? $profile->cv_path : null;
            }

            if (!$cvPath) {
                return response()->json([
                    'success' => false,
                    'message' => 'No CV found. Please upload your CV first.',
                ], 404);
            }

            $question = $request->input('question', '');
            $userProfile = $this->getUserProfile($user);

            // Get AI CV analysis
            $response = $this->geminiService->analyzeCv($cvPath, $question, $userProfile);

            if (!$response['success']) {
                return response()->json([
                    'success' => false,
                    'message' => $response['error'] ?? 'Failed to analyze CV',
                ], 500);
            }

            // Save conversation
            $conversation = AiConversation::create([
                'user_id' => $user->id,
                'conversation_type' => 'cv_analysis',
                'user_message' => $question ?: 'Please analyze my CV',
                'ai_response' => $response['message'],
                'context' => $userProfile,
                'metadata' => [
                    'model' => config('services.gemini.model'),
                    'cv_path' => $cvPath,
                    'timestamp' => now()->toIso8601String(),
                ],
            ]);

            return response()->json([
                'success' => true,
                'message' => $response['message'],
                'conversation' => $conversation,
            ]);

        } catch (\Exception $e) {
            Log::error('AI Career: CV analysis error', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while analyzing your CV',
            ], 500);
        }
    }

    /**
     * Get personalized learning path
     */
    public function getLearningPath(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'goal' => 'nullable|string|max:500',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $user = Auth::user();
            $goal = $request->input('goal', '');
            $userProfile = $this->getUserProfile($user);

            // Get AI learning path recommendations
            $response = $this->geminiService->getLearningPath($userProfile, $goal);

            if (!$response['success']) {
                return response()->json([
                    'success' => false,
                    'message' => $response['error'] ?? 'Failed to generate learning path',
                ], 500);
            }

            // Save conversation
            $conversation = AiConversation::create([
                'user_id' => $user->id,
                'conversation_type' => 'learning_path',
                'user_message' => $goal ?: 'Suggest a learning path for me',
                'ai_response' => $response['message'],
                'context' => $userProfile,
                'metadata' => [
                    'model' => config('services.gemini.model'),
                    'goal' => $goal,
                    'timestamp' => now()->toIso8601String(),
                ],
            ]);

            return response()->json([
                'success' => true,
                'message' => $response['message'],
                'conversation' => $conversation,
            ]);

        } catch (\Exception $e) {
            Log::error('AI Career: Learning path error', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while generating learning path',
            ], 500);
        }
    }

    /**
     * Get job role recommendations
     */
    public function getJobRecommendations(Request $request)
    {
        try {
            $user = Auth::user();
            $userProfile = $this->getUserProfile($user);

            // Get AI job recommendations
            $response = $this->geminiService->getJobRecommendations($userProfile);

            if (!$response['success']) {
                return response()->json([
                    'success' => false,
                    'message' => $response['error'] ?? 'Failed to generate job recommendations',
                ], 500);
            }

            // Save conversation
            $conversation = AiConversation::create([
                'user_id' => $user->id,
                'conversation_type' => 'job_recommendations',
                'user_message' => 'What jobs suit my profile?',
                'ai_response' => $response['message'],
                'context' => $userProfile,
                'metadata' => [
                    'model' => config('services.gemini.model'),
                    'timestamp' => now()->toIso8601String(),
                ],
            ]);

            return response()->json([
                'success' => true,
                'message' => $response['message'],
                'conversation' => $conversation,
            ]);

        } catch (\Exception $e) {
            Log::error('AI Career: Job recommendations error', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while generating job recommendations',
            ], 500);
        }
    }

    /**
     * Get skills gap analysis
     */
    public function getSkillsGap(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'target_role' => 'required|string|max:200',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $user = Auth::user();
            $targetRole = $request->input('target_role');
            $userProfile = $this->getUserProfile($user);

            // Get AI skills gap analysis
            $response = $this->geminiService->getSkillsGapAnalysis($userProfile, $targetRole);

            if (!$response['success']) {
                return response()->json([
                    'success' => false,
                    'message' => $response['error'] ?? 'Failed to generate skills gap analysis',
                ], 500);
            }

            // Save conversation
            $conversation = AiConversation::create([
                'user_id' => $user->id,
                'conversation_type' => 'skills_gap',
                'user_message' => "Skills gap analysis for: {$targetRole}",
                'ai_response' => $response['message'],
                'context' => array_merge($userProfile, ['target_role' => $targetRole]),
                'metadata' => [
                    'model' => config('services.gemini.model'),
                    'target_role' => $targetRole,
                    'timestamp' => now()->toIso8601String(),
                ],
            ]);

            return response()->json([
                'success' => true,
                'message' => $response['message'],
                'conversation' => $conversation,
            ]);

        } catch (\Exception $e) {
            Log::error('AI Career: Skills gap error', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while analyzing skills gap',
            ], 500);
        }
    }

    /**
     * Clear conversation history
     */
    public function clearHistory(Request $request)
    {
        try {
            $user = Auth::user();

            AiConversation::where('user_id', $user->id)->delete();

            return response()->json([
                'success' => true,
                'message' => 'Conversation history cleared successfully',
            ]);

        } catch (\Exception $e) {
            Log::error('AI Career: Clear history error', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to clear conversation history',
            ], 500);
        }
    }

    /**
     * Build user profile data for AI context
     */
    private function getUserProfile($user)
    {
        $profile = [
            'name' => $user->first_name . ' ' . $user->last_name,
            'email' => $user->email,
            'user_type' => $user->user_type,
        ];

        // Add type-specific profile data
        if ($user->user_type === 'university_student') {
            $universityProfile = UniversityStudentProfile::where('user_id', $user->id)->first();
            if ($universityProfile) {
                $profile = array_merge($profile, [
                    'university' => $universityProfile->university,
                    'faculty' => $universityProfile->faculty,
                    'year_of_study' => $universityProfile->year_of_study,
                    'gpa' => $universityProfile->gpa,
                    'bio' => $universityProfile->bio,
                    'skills' => $universityProfile->skills,
                    'experience' => $universityProfile->experience,
                    'languages' => $universityProfile->languages,
                    'certifications' => $universityProfile->certifications,
                    'projects' => $universityProfile->projects,
                    'looking_for_opportunities' => $universityProfile->looking_for_opportunities,
                ]);
            }
        } elseif ($user->user_type === 'student') {
            $studentProfile = StudentProfile::where('user_id', $user->id)->first();
            if ($studentProfile) {
                $profile = array_merge($profile, [
                    'grade' => $studentProfile->grade,
                    'preferred_subjects' => $studentProfile->preferred_subjects,
                    'goal' => $studentProfile->goal,
                ]);
            }
        } elseif ($user->user_type === 'company') {
            $company = Company::where('user_id', $user->id)->first();
            if ($company) {
                $profile = array_merge($profile, [
                    'company_name' => $company->company_name,
                    'industry' => $company->industry,
                    'company_size' => $company->company_size,
                    'description' => $company->description,
                ]);
            }
        }

        return $profile;
    }
}
