<?php


namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseEnrollment;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use Stripe\Exception\ApiErrorException;

class PaymentController extends Controller
{
    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret'));
    }

    public function createPaymentIntent(Request $request, $courseId)
    {
        try {
            $user = Auth::user();

            // Get course
            $course = Course::where('is_active', true)->find($courseId);

            if (!$course) {
                return response()->json([
                    'success' => false,
                    'message' => 'Course not found'
                ], 404);
            }

            // Check if already enrolled
            $existingEnrollment = CourseEnrollment::where('student_id', $user->id)
                ->where('course_id', $courseId)
                ->where('status', 'active')
                ->first();

            if ($existingEnrollment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Already enrolled in this course'
                ], 400);
            }

            // Check if course is full (for live courses)
            if ($course->course_type === 'live' && $course->is_full) {
                return response()->json([
                    'success' => false,
                    'message' => 'This course is full'
                ], 400);
            }

            // Create transaction ID
            $transactionId = 'TXN_' . uniqid() . '_' . time();

            // Create payment record
            $payment = Payment::create([
                'user_id' => $user->id,
                'course_id' => $courseId,
                'amount' => $course->price,
                'currency' => 'EGP',
                'payment_method' => 'card',
                'payment_provider' => 'stripe',
                'transaction_id' => $transactionId,
                'status' => 'pending',
                'metadata' => [
                    'course_title' => $course->title,
                    'course_type' => $course->course_type,
                    'user_email' => $user->email,
                    'user_name' => $user->first_name . ' ' . $user->last_name
                ]
            ]);

            // Create Stripe Payment Intent
            $paymentIntent = PaymentIntent::create([
                'amount' => $course->price * 100,
                'currency' => 'egp',
                'payment_method_types' => ['card'],
                'metadata' => [
                    'payment_id' => $payment->id,
                    'course_id' => $courseId,
                    'user_id' => $user->id,
                    'transaction_id' => $transactionId
                ],
                'description' => 'Course: ' . $course->title
            ]);

            // Update payment with Stripe payment intent ID
            $payment->update([
                'provider_payment_id' => $paymentIntent->id,
                'status' => 'processing'
            ]);

            return response()->json([
                'success' => true,
                'client_secret' => $paymentIntent->client_secret,
                'payment_id' => $payment->id,
                'amount' => $course->price
            ]);

        } catch (ApiErrorException $e) {
            Log::error('Stripe error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Payment processing error'
            ], 500);
        } catch (\Exception $e) {
            Log::error('Payment error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error creating payment'
            ], 500);
        }
    }

    public function confirmPayment(Request $request)
    {
        try {
            $request->validate([
                'payment_id' => 'required|exists:payments,id',
                'payment_intent_id' => 'required|string'
            ]);

            $payment = Payment::find($request->payment_id);

            // Verify payment belongs to current user
            if ($payment->user_id !== Auth::id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 403);
            }

            // Retrieve the payment intent from Stripe
            $paymentIntent = PaymentIntent::retrieve($request->payment_intent_id);

            if ($paymentIntent->status === 'succeeded') {
                DB::beginTransaction();

                try {
                    // Update payment record
                    $payment->update([
                        'status' => 'completed',
                        'paid_at' => now()
                    ]);

                    // Create enrollment
                    $enrollment = CourseEnrollment::create([
                        'student_id' => $payment->user_id,
                        'course_id' => $payment->course_id,
                        'price_paid' => $payment->amount,
                        'status' => 'active',
                        'enrolled_at' => now()
                    ]);

                    // Update payment with enrollment ID
                    $payment->update(['enrollment_id' => $enrollment->id]);

                    // Update course stats
                    $course = Course::find($payment->course_id);
                    if ($course->course_type === 'live') {
                        $course->increment('enrolled_seats');
                    }
                    $course->increment('students_count');

                    DB::commit();

                    return response()->json([
                        'success' => true,
                        'message' => 'Payment successful and enrollment completed',
                        'enrollment_id' => $enrollment->id
                    ]);

                } catch (\Exception $e) {
                    DB::rollback();
                    throw $e;
                }
            } else {
                $payment->update([
                    'status' => 'failed',
                    'failed_at' => now()
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Payment failed'
                ], 400);
            }

        } catch (\Exception $e) {
            Log::error('Payment confirmation error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error confirming payment'
            ], 500);
        }
    }

    public function createPayPalOrder(Request $request, $courseId)
    {
        try {
            $user = Auth::user();

            // Get course
            $course = Course::where('is_active', true)->find($courseId);

            if (!$course) {
                return response()->json([
                    'success' => false,
                    'message' => 'Course not found'
                ], 404);
            }

            // Check existing enrollment
            $existingEnrollment = CourseEnrollment::where('student_id', $user->id)
                ->where('course_id', $courseId)
                ->where('status', 'active')
                ->first();

            if ($existingEnrollment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Already enrolled'
                ], 400);
            }

            // Create transaction ID
            $transactionId = 'PP_' . uniqid() . '_' . time();

            // Create payment record
            $payment = Payment::create([
                'user_id' => $user->id,
                'course_id' => $courseId,
                'amount' => $course->price,
                'currency' => 'USD', // PayPal uses USD
                'payment_method' => 'paypal',
                'payment_provider' => 'paypal',
                'transaction_id' => $transactionId,
                'status' => 'pending',
                'metadata' => [
                    'course_title' => $course->title,
                    'user_email' => $user->email
                ]
            ]);

            // Convert EGP to USD (approximate rate - you should use a real exchange rate API)
            $amountInUSD = round($course->price / 50, 2);

            // PayPal order data
            $orderData = [
                'payment_id' => $payment->id,
                'amount' => $amountInUSD,
                'currency' => 'USD',
                'description' => 'Course: ' . $course->title
            ];

            return response()->json([
                'success' => true,
                'payment_id' => $payment->id,
                'amount_usd' => $amountInUSD,
                'amount_egp' => $course->price
            ]);

        } catch (\Exception $e) {
            Log::error('PayPal order error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error creating PayPal order'
            ], 500);
        }
    }

    public function confirmPayPalPayment(Request $request)
    {
        try {
            $request->validate([
                'payment_id' => 'required|exists:payments,id',
                'order_id' => 'required|string'
            ]);

            $payment = Payment::find($request->payment_id);

            if ($payment->user_id !== Auth::id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 403);
            }

            // Here you would verify with PayPal API
            // For now, we'll simulate success

            DB::beginTransaction();

            try {
                // Update payment
                $payment->update([
                    'status' => 'completed',
                    'provider_payment_id' => $request->order_id,
                    'paid_at' => now()
                ]);

                // Create enrollment
                $enrollment = CourseEnrollment::create([
                    'student_id' => $payment->user_id,
                    'course_id' => $payment->course_id,
                    'price_paid' => $payment->amount,
                    'status' => 'active',
                    'enrolled_at' => now()
                ]);

                $payment->update(['enrollment_id' => $enrollment->id]);

                // Update course stats
                $course = Course::find($payment->course_id);
                if ($course->course_type === 'live') {
                    $course->increment('enrolled_seats');
                }
                $course->increment('students_count');

                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => 'PayPal payment successful',
                    'enrollment_id' => $enrollment->id
                ]);

            } catch (\Exception $e) {
                DB::rollback();
                throw $e;
            }

        } catch (\Exception $e) {
            Log::error('PayPal confirmation error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error confirming PayPal payment'
            ], 500);
        }
    }

    public function getPaymentHistory(Request $request)
    {
        try {
            $user = Auth::user();

            $payments = Payment::with(['course:id,title,teacher_id', 'course.teacher:id,first_name,last_name'])
                ->where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->paginate(10);

            return response()->json([
                'success' => true,
                'payments' => $payments
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching payment history'
            ], 500);
        }
    }
}
