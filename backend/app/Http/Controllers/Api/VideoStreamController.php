<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CourseLesson;
use App\Models\CourseEnrollment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Laravel\Sanctum\PersonalAccessToken;

class VideoStreamController extends Controller
{
    public function streamLesson($lessonId, Request $request)
    {
        // Get token from query parameter
        $token = $request->query('token');

        if (!$token) {
            abort(401, 'Unauthorized - No token provided');
        }

        // Find the token in the database
        $tokenModel = PersonalAccessToken::findToken($token);

        if (!$tokenModel) {
            abort(401, 'Invalid token');
        }

        // Get the user associated with the token
        $user = $tokenModel->tokenable;

        if (!$user) {
            abort(401, 'User not found');
        }

        // Get the lesson
        $lesson = CourseLesson::find($lessonId);

        if (!$lesson) {
            abort(404, 'Lesson not found');
        }

        // Check if user is enrolled or if it's a preview lesson
        if (!$lesson->is_preview) {
            $isEnrolled = CourseEnrollment::where('student_id', $user->id)
                ->where('course_id', $lesson->course_id)
                ->where('status', 'active')
                ->exists();

            if (!$isEnrolled) {
                abort(403, 'Access denied - You are not enrolled in this course');
            }
        }

        // Only stream uploaded videos
        if ($lesson->video_type !== 'upload' || !$lesson->video_file_path) {
            abort(404, 'Video not found');
        }

        $path = storage_path('app/public/' . $lesson->video_file_path);

        if (!file_exists($path)) {
            abort(404, 'Video file not found');
        }

        $fileSize = filesize($path);
        $mimeType = mime_content_type($path);

        // Prevent caching
        $headers = [
            'Content-Type' => $mimeType,
            'Content-Length' => $fileSize,
            'Accept-Ranges' => 'bytes',
            'Cache-Control' => 'no-cache, no-store, must-revalidate',
            'Pragma' => 'no-cache',
            'Expires' => '0',
            'X-Content-Type-Options' => 'nosniff',
            'X-Frame-Options' => 'SAMEORIGIN',
        ];

        // Handle range requests for video seeking
        $range = $request->header('Range');

        if ($range) {
            return $this->streamRangeResponse($path, $fileSize, $mimeType, $range);
        }

        // Stream the entire file
        return response()->stream(function () use ($path) {
            $stream = fopen($path, 'rb');
            fpassthru($stream);
            fclose($stream);
        }, 200, $headers);
    }

    private function streamRangeResponse($path, $fileSize, $mimeType, $range)
    {
        list($start, $end) = $this->parseRange($range, $fileSize);

        $headers = [
            'Content-Type' => $mimeType,
            'Content-Length' => $end - $start + 1,
            'Accept-Ranges' => 'bytes',
            'Content-Range' => "bytes $start-$end/$fileSize",
            'Cache-Control' => 'no-cache, no-store, must-revalidate',
            'X-Content-Type-Options' => 'nosniff',
        ];

        return response()->stream(function () use ($path, $start, $end) {
            $stream = fopen($path, 'rb');
            fseek($stream, $start);

            $remainingBytes = $end - $start + 1;
            $chunkSize = 1024 * 1024; // 1MB chunks

            while ($remainingBytes > 0 && !feof($stream)) {
                $readBytes = min($chunkSize, $remainingBytes);
                echo fread($stream, $readBytes);
                flush();
                $remainingBytes -= $readBytes;
            }

            fclose($stream);
        }, 206, $headers);
    }

    private function parseRange($range, $fileSize)
    {
        $range = str_replace('bytes=', '', $range);
        $parts = explode('-', $range);

        $start = intval($parts[0]);
        $end = isset($parts[1]) && $parts[1] !== ''
            ? intval($parts[1])
            : $fileSize - 1;

        return [$start, min($end, $fileSize - 1)];
    }
}
