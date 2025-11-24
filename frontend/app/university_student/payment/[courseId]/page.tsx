
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import UniversityStudentNav from "@/components/UniversityStudentNav/UniversityStudentNav";
import styles from "./Payment.module.css";
import { FaCreditCard, FaPaypal, FaLock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Image from "next/image";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

interface Course {
  id: number;
  title: string;
  description: string;
  teacher_name: string;
  price: number;
  original_price?: number;
  thumbnail: string | null;
  course_type: 'recorded' | 'live';
}

interface PaymentData {
  payment_id: number;
  client_secret: string;
  amount: number;
}

function StripeCheckoutForm({ course, onSuccess }: { course: Course; onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [paymentId, setPaymentId] = useState<number | null>(null);

  const createPaymentIntent = useCallback(async () => {
    try {
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment/stripe/create-intent/${course.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authData.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data: PaymentData = await response.json();
      
      if (data.client_secret) {
        setClientSecret(data.client_secret);
        setPaymentId(data.payment_id);
      } else {
        setError("Failed to initialize payment");
      }
    } catch (err) {
      setError("Error connecting to payment server");
      console.error("Payment intent error:", err);
    }
  }, [course.id]);

  useEffect(() => {
    createPaymentIntent();
  }, [createPaymentIntent]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      return;
    }

    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (stripeError) {
      setError(stripeError.message || "Payment failed");
      setProcessing(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      try {
        const authData = JSON.parse(localStorage.getItem("authData") || "{}");
        
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment/stripe/confirm`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${authData.token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              payment_id: paymentId,
              payment_intent_id: paymentIntent.id,
            }),
          }
        );

        const data = await response.json();
        
        if (data.success) {
          setSucceeded(true);
          setTimeout(() => {
            onSuccess();
          }, 2000);
        } else {
          setError(data.message || "Failed to complete enrollment");
        }
      } catch (err) {
        setError("Error confirming payment");
        console.error("Confirmation error:", err);
      }
    }

    setProcessing(false);
  };

  const cardStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: "Arial, sans-serif",
        fontSmoothing: "antialiased" as const,
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className={styles.stripeForm}>
      <div className={styles.cardElementWrapper}>
        <CardElement options={cardStyle} />
      </div>
      
      {error && (
        <div className={styles.errorMessage}>
          <FaTimesCircle /> {error}
        </div>
      )}
      
      {succeeded && (
        <div className={styles.successMessage}>
          <FaCheckCircle /> Payment successful! Redirecting...
        </div>
      )}
      
      <button
        type="submit"
        disabled={!stripe || processing || succeeded}
        className={styles.payButton}
      >
        {processing ? (
          <span>Processing...</span>
        ) : (
          <>
            <FaLock /> Pay {course.price} EGP
          </>
        )}
      </button>
    </form>
  );
}

interface PayPalOrderData {
  orderID: string;
}

export default function PaymentPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.courseId;
  
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe');

  const checkAuth = useCallback(() => {
    const userData = localStorage.getItem("user");
    const authData = localStorage.getItem("authData");

    if (!userData || !authData) {
      router.push("/login");
      return;
    }

    const parsedAuth = JSON.parse(authData);

    if (new Date(parsedAuth.expiresAt) < new Date()) {
      localStorage.removeItem("user");
      localStorage.removeItem("authData");
      router.push("/login");
      return;
    }
  }, [router]);

  const fetchCourseDetails = useCallback(async () => {
    try {
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/student/courses/${courseId}/view`,
        {
          headers: {
            Authorization: `Bearer ${authData.token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        
        if (data.course.is_enrolled) {
          router.push(`/student/courses/${courseId}`);
        } else {
          setCourse(data.course);
        }
      }
    } catch (error) {
      console.error("Error fetching course:", error);
    } finally {
      setLoading(false);
    }
  }, [courseId, router]);

  useEffect(() => {
    checkAuth();
    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId, checkAuth, fetchCourseDetails]);

  const handlePaymentSuccess = () => {
    router.push(`/student/courses/${courseId}`);
  };

  const handlePayPalApprove = async (data: PayPalOrderData) => {
    try {
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");
      
      const orderResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment/paypal/create-order/${courseId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authData.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const orderData = await orderResponse.json();
      
      if (orderData.success) {
        const confirmResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment/paypal/confirm`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${authData.token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              payment_id: orderData.payment_id,
              order_id: data.orderID,
            }),
          }
        );

        const confirmData = await confirmResponse.json();
        
        if (confirmData.success) {
          handlePaymentSuccess();
        }
      }
    } catch (error) {
      console.error("PayPal payment error:", error);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <UniversityStudentNav />
        <div className={styles.loadingContainer}>
          <div className={styles.loader}></div>
          <p>Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className={styles.container}>
        <UniversityStudentNav />
        <div className={styles.errorContainer}>
          <p>Course not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <UniversityStudentNav />
      
      <main className={styles.main}>
        <div className={styles.paymentWrapper}>
          {/* Course Summary */}
          <div className={styles.courseSummary}>
            <h2>Course Summary</h2>
            <div className={styles.courseCard}>
              {course.thumbnail && (
                <Image 
                  src={course.thumbnail} 
                  alt={course.title} 
                  className={styles.courseThumbnail}
                  width={320}
                  height={200}
                  style={{ objectFit: 'cover' }}
                />
              )}
              <div className={styles.courseInfo}>
                <h3>{course.title}</h3>
                <p className={styles.teacherName}>By {course.teacher_name}</p>
                <p className={styles.courseDescription}>{course.description}</p>
                <div className={styles.courseType}>
                  {course.course_type === 'live' ? '🔴 Live Course' : '📹 Recorded Course'}
                </div>
              </div>
            </div>
            
            <div className={styles.priceBreakdown}>
              <h4>Price Breakdown</h4>
              <div className={styles.priceRow}>
                <span>Course Price:</span>
                <span>{course.original_price || course.price} EGP</span>
              </div>
              {course.original_price && (
                <div className={styles.priceRow}>
                  <span>Discount:</span>
                  <span className={styles.discount}>-{course.original_price - course.price} EGP</span>
                </div>
              )}
              <div className={styles.divider}></div>
              <div className={styles.totalRow}>
                <span>Total:</span>
                <span className={styles.totalPrice}>{course.price} EGP</span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className={styles.paymentForm}>
            <h2>Payment Method</h2>
            
            {/* Payment Method Tabs */}
            <div className={styles.paymentTabs}>
              <button
                className={`${styles.tabButton} ${paymentMethod === 'stripe' ? styles.active : ''}`}
                onClick={() => setPaymentMethod('stripe')}
              >
                <FaCreditCard /> Credit/Debit Card
              </button>
              <button
                className={`${styles.tabButton} ${paymentMethod === 'paypal' ? styles.active : ''}`}
                onClick={() => setPaymentMethod('paypal')}
              >
                <FaPaypal /> PayPal
              </button>
            </div>

            {/* Payment Content */}
            <div className={styles.paymentContent}>
              {paymentMethod === 'stripe' ? (
                <Elements stripe={stripePromise}>
                  <StripeCheckoutForm course={course} onSuccess={handlePaymentSuccess} />
                </Elements>
              ) : (
                <div className={styles.paypalSection}>
                  <PayPalScriptProvider
                    options={{
                      clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
                      currency: "USD",
                    }}
                  >
                    <PayPalButtons
                      style={{ layout: "vertical" }}
                      createOrder={(data, actions) => {
                        const amountInUSD = (course.price / 50).toFixed(2);
                        
                        return actions.order.create({
                          intent: "CAPTURE",
                          purchase_units: [
                            {
                              amount: {
                                currency_code: "USD",
                                value: amountInUSD,
                              },
                              description: `Course: ${course.title}`,
                            },
                          ],
                        });
                      }}
                      onApprove={(data) => handlePayPalApprove(data as PayPalOrderData)}
                    />
                  </PayPalScriptProvider>
                  <p className={styles.paypalNote}>
                    * Amount will be converted from EGP to USD at current exchange rate
                  </p>
                </div>
              )}
            </div>

            {/* Security Notice */}
            <div className={styles.securityNotice}>
              <FaLock />
              <p>Your payment information is encrypted and secure</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}