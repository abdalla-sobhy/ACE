<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\CourseEnrollment;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Stripe\Stripe;
use Stripe\Webhook;
use Stripe\Exception\SignatureVerificationException;
use Illuminate\Support\Facades\DB;

class StripeWebhookController extends Controller
{
    public function handleWebhook(Request $request)
    {
        Stripe::setApiKey(config('services.stripe.secret'));

        $payload = $request->getContent();
        $sig_header = $request->header('Stripe-Signature');
        $endpoint_secret = config('services.stripe.webhook.secret');

        try {
            $event = Webhook::constructEvent(
                $payload,
                $sig_header,
                $endpoint_secret
            );
        } catch (\UnexpectedValueException $e) {
            Log::error('Stripe webhook error: Invalid payload');
            return response()->json(['error' => 'Invalid payload'], 400);
        } catch (SignatureVerificationException $e) {
            Log::error('Stripe webhook error: Invalid signature');
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        // Handle the event
        switch ($event->type) {
            case 'payment_intent.succeeded':
                $this->handleSuccessfulPayment($event->data->object);
                break;

            case 'payment_intent.payment_failed':
                $this->handleFailedPayment($event->data->object);
                break;

            case 'charge.refunded':
                $this->handleRefund($event->data->object);
                break;

            default:
                Log::info('Unhandled Stripe webhook event type: ' . $event->type);
        }

        return response()->json(['status' => 'success'], 200);
    }

    private function handleSuccessfulPayment($paymentIntent)
    {
        try {
            // Find payment by provider payment ID
            $payment = Payment::where('provider_payment_id', $paymentIntent->id)->first();

            if (!$payment) {
                Log::warning('Payment not found for intent: ' . $paymentIntent->id);
                return;
            }

            // Check if already processed
            if ($payment->status === 'completed') {
                return;
            }

            DB::beginTransaction();

            // Update payment status
            $payment->update([
                'status' => 'completed',
                'paid_at' => now()
            ]);

            // Create or update enrollment
            $enrollment = CourseEnrollment::updateOrCreate(
                [
                    'student_id' => $payment->user_id,
                    'course_id' => $payment->course_id
                ],
                [
                    'price_paid' => $payment->amount,
                    'status' => 'active',
                    'enrolled_at' => now()
                ]
            );

            // Update payment with enrollment ID
            $payment->update(['enrollment_id' => $enrollment->id]);

            // Update course statistics
            $course = Course::find($payment->course_id);
            if ($course) {
                if ($course->course_type === 'live') {
                    $course->increment('enrolled_seats');
                }

                // Update students count
                $actualCount = CourseEnrollment::where('course_id', $course->id)
                    ->where('status', 'active')
                    ->count();
                $course->update(['students_count' => $actualCount]);
            }

            DB::commit();

            Log::info('Payment processed successfully via webhook: ' . $payment->id);

        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Error processing successful payment webhook: ' . $e->getMessage());
        }
    }

    private function handleFailedPayment($paymentIntent)
    {
        try {
            $payment = Payment::where('provider_payment_id', $paymentIntent->id)->first();

            if ($payment) {
                $payment->update([
                    'status' => 'failed',
                    'failed_at' => now(),
                    'metadata' => array_merge($payment->metadata ?? [], [
                        'failure_reason' => $paymentIntent->last_payment_error->message ?? 'Unknown error'
                    ])
                ]);

                Log::info('Payment failed via webhook: ' . $payment->id);
            }
        } catch (\Exception $e) {
            Log::error('Error processing failed payment webhook: ' . $e->getMessage());
        }
    }

    private function handleRefund($charge)
    {
        try {
            // Find payment by searching for the payment intent ID in metadata
            $payment = Payment::where('provider_payment_id', 'like', '%' . $charge->payment_intent . '%')
                ->first();

            if ($payment) {
                $refundAmount = $charge->amount_refunded / 100; // Convert from cents

                $payment->update([
                    'status' => 'refunded',
                    'refunded_at' => now(),
                    'refund_amount' => $refundAmount
                ]);

                // Cancel the enrollment if fully refunded
                if ($refundAmount >= $payment->amount) {
                    CourseEnrollment::where('student_id', $payment->user_id)
                        ->where('course_id', $payment->course_id)
                        ->update(['status' => 'cancelled']);

                    // Update course statistics
                    $course = Course::find($payment->course_id);
                    if ($course) {
                        if ($course->course_type === 'live') {
                            $course->decrement('enrolled_seats');
                        }
                        $course->decrement('students_count');
                    }
                }

                Log::info('Payment refunded via webhook: ' . $payment->id);
            }
        } catch (\Exception $e) {
            Log::error('Error processing refund webhook: ' . $e->getMessage());
        }
    }
}
