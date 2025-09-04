/* eslint-disable @typescript-eslint/no-explicit-any */ /* This needs to be changed */
"use client";

import styles from "./Signup.module.css";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { FaUser, FaChalkboardTeacher, FaUserFriends } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useRouter } from "next/navigation";

type UserType = "student" | "teacher" | "parent" | null;

// Base form data type
interface BaseFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

// Student form data type
interface StudentFormData extends BaseFormData {
  grade: string;
  birthDate: string;
}

// Teacher additional form data
interface TeacherAdditionalData {
  specialization: string;
  yearsOfExperience: string;
}

// Parent additional form data
interface ParentAdditionalData {
  childrenCount: string;
}

// Validation schemas
const baseSchema = z
  .object({
    firstName: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
    lastName: z.string().min(2, "اسم العائلة يجب أن يكون حرفين على الأقل"),
    email: z.string().email("البريد الإلكتروني غير صحيح"),
    phone: z
      .string()
      .regex(/^\+20[0-9]{10}$/, "رقم الهاتف يجب أن يكون رقم مصري صحيح"),
    password: z
      .string()
      .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
      .regex(/[A-Z]/, "يجب أن تحتوي على حرف كبير واحد على الأقل")
      .regex(/[0-9]/, "يجب أن تحتوي على رقم واحد على الأقل"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
  });

// Update student schema to use phone instead of phoneNumber
const studentSchema = z
  .object({
    firstName: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
    lastName: z.string().min(2, "اسم العائلة يجب أن يكون حرفين على الأقل"),
    email: z.string().email("البريد الإلكتروني غير صحيح"),
    phone: z
      .string()
      .regex(/^\+20[0-9]{10}$/, "رقم الهاتف يجب أن يكون رقم مصري صحيح"),
    password: z
      .string()
      .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
      .regex(/[A-Z]/, "يجب أن تحتوي على حرف كبير واحد على الأقل")
      .regex(/[0-9]/, "يجب أن تحتوي على رقم واحد على الأقل"),
    confirmPassword: z.string(),
    grade: z.string().min(1, "يرجى اختيار المرحلة الدراسية"),
    birthDate: z.string().refine((date) => {
      const age = new Date().getFullYear() - new Date(date).getFullYear();
      return age >= 6 && age <= 25;
    }, "العمر يجب أن يكون بين 6 و 25 سنة"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
  });

const teacherAdditionalSchema = z.object({
  specialization: z.string().min(1, "يرجى اختيار التخصص"),
  yearsOfExperience: z.string().min(1, "يرجى اختيار سنوات الخبرة"),
});

const parentAdditionalSchema = z.object({
  childrenCount: z.string().min(1, "يرجى اختيار عدد الأبناء"),
});

function SignupContent() {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<UserType>(null);
  const [diditVerified, setDiditVerified] = useState(false);
  const [diditSessionId, setDiditSessionId] = useState<string | null>(null);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "checking" | "approved" | "failed" | "retry"
  >("idle");
  const [verificationMessage, setVerificationMessage] = useState("");

  // Didit verification functions
  useEffect(() => {
    // Check if searchParams exists and if returning from verification
    if (searchParams && searchParams.get("verification") === "complete") {
      // Restore saved state
      const savedState = sessionStorage.getItem("registrationState");
      const savedSessionId = sessionStorage.getItem("diditSessionId");

      if (savedState) {
        const state = JSON.parse(savedState);

        // Restore form state
        setStep(state.step);
        setUserType(state.userType);

        // Restore form data
        if (state.userType === "student" && state.formData) {
          Object.keys(state.formData).forEach((key) => {
            studentForm.setValue(key as any, state.formData[key]);
          });
        } else if (state.formData) {
          Object.keys(state.formData).forEach((key) => {
            baseForm.setValue(key as any, state.formData[key]);
          });
        }

        // Restore additional data for teachers/parents
        if (state.userType === "teacher" && state.teacherData) {
          Object.keys(state.teacherData).forEach((key) => {
            teacherAdditionalForm.setValue(key as any, state.teacherData[key]);
          });
        } else if (state.userType === "parent" && state.parentData) {
          Object.keys(state.parentData).forEach((key) => {
            parentAdditionalForm.setValue(key as any, state.parentData[key]);
          });
        }

        if (savedSessionId) {
          setDiditSessionId(savedSessionId);
          checkVerificationStatus(savedSessionId);
        }

        // Clean up
        sessionStorage.removeItem("registrationState");

        // Clean the URL
        router.push("/signup");
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Base form for teachers and parents
  const baseForm = useForm<BaseFormData>({
    resolver: zodResolver(baseSchema),
    mode: "onChange",
  });

  // Student form with all fields
  const studentForm = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    mode: "onChange",
  });

  // Teacher additional form
  const teacherAdditionalForm = useForm<TeacherAdditionalData>({
    resolver: zodResolver(teacherAdditionalSchema),
    mode: "onChange",
  });

  // Parent additional form
  const parentAdditionalForm = useForm<ParentAdditionalData>({
    resolver: zodResolver(parentAdditionalSchema),
    mode: "onChange",
  });

  // Helper function to get form field properties
  const getFormField = (fieldName: keyof BaseFormData) => {
    if (userType === "student") {
      return {
        register: studentForm.register(fieldName),
        error: studentForm.formState.errors[fieldName],
        errorMessage: studentForm.formState.errors[fieldName]?.message,
      };
    } else {
      return {
        register: baseForm.register(fieldName),
        error: baseForm.formState.errors[fieldName],
        errorMessage: baseForm.formState.errors[fieldName]?.message,
      };
    }
  };

  const userTypes = [
    {
      type: "student" as UserType,
      icon: <FaUser />,
      title: "طالب",
      description: "احضر المحاضرات وتفاعل مع المعلمين",
      color: "#58a6ff",
    },
    {
      type: "teacher" as UserType,
      icon: <FaChalkboardTeacher />,
      title: "محاضر",
      description: "شارك علمك وساعد الطلاب على التفوق",
      color: "#3fb950",
    },
    {
      type: "parent" as UserType,
      icon: <FaUserFriends />,
      title: "ولي أمر",
      description: "تابع تقدم أبنائك وأدائهم الدراسي",
      color: "#f85149",
    },
  ];

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type);
    setStep(2);
  };

  const handleBasicInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userType === "student") {
      studentForm.handleSubmit((data) => {
        console.log("Student info validated:", data);
        setStep(3);
      })();
    } else {
      baseForm.handleSubmit((data) => {
        console.log("Basic info validated:", data);
        setStep(3);
      })();
    }
  };

  const handleAdditionalInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userType === "teacher") {
      teacherAdditionalForm.handleSubmit((data) => {
        console.log("Teacher additional info validated:", data);
        setStep(4);
      })();
    } else if (userType === "parent") {
      parentAdditionalForm.handleSubmit((data) => {
        console.log("Parent additional info validated:", data);
        setStep(4);
      })();
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setUserType(null);
      studentForm.reset();
      baseForm.reset();
    }
    setStep(step - 1);
  };

  const handleFinalSubmit = async () => {
    let submitData: any = { userType, diditSessionId };

    if (userType === "student") {
      submitData = { ...submitData, ...studentForm.getValues() };
    } else {
      submitData = { ...submitData, ...baseForm.getValues() };
      if (userType === "teacher") {
        submitData = { ...submitData, ...teacherAdditionalForm.getValues() };
      } else if (userType === "parent") {
        submitData = { ...submitData, ...parentAdditionalForm.getValues() };
      }
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      await response.json();

      if (response.ok) {
        setStep(5);
      } else {
        // alert(data.message || 'حدث خطأ في التسجيل');
      }
    } catch (error) {
      console.error("Registration error:", error);
      // alert('حدث خطأ في الاتصال بالخادم');
    }
  };

  const startVerification = async () => {
    try {
      setVerificationLoading(true);

      // Save current form state before leaving the page
      const registrationState = {
        step: step,
        userType: userType,
        formData:
          userType === "student"
            ? studentForm.getValues()
            : baseForm.getValues(),
        teacherData:
          userType === "teacher" ? teacherAdditionalForm.getValues() : null,
        parentData:
          userType === "parent" ? parentAdditionalForm.getValues() : null,
      };

      sessionStorage.setItem(
        "registrationState",
        JSON.stringify(registrationState)
      );

      const userData =
        userType === "student" ? studentForm.getValues() : baseForm.getValues();

      const response = await fetch("/api/didit/create-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create session");
      }

      if (data.success && data.verificationUrl) {
        sessionStorage.setItem("diditSessionId", data.sessionId);

        window.location.href = data.verificationUrl;
      }
    } catch (error) {
      console.error("Verification error:", error);
      setVerificationLoading(false);
      sessionStorage.removeItem("registrationState");
      alert(
        `فشل في بدء التحقق: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const checkVerificationStatus = async (sessionId: string) => {
    try {
      setVerificationLoading(true);
      setVerificationStatus("checking");
      setVerificationMessage("جاري التحقق من حالة التوثيق...");

      await new Promise((resolve) => setTimeout(resolve, 3000));

      const response = await fetch(`/api/didit/session-status/${sessionId}`);
      const data = await response.json();

      console.log("Verification decision response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to check status");
      }

      const status = data.status;

      console.log("Status:", status);

      if (status === "Approved") {
        setDiditVerified(true);
        setVerificationStatus("approved");
        setVerificationMessage("تم التحقق من هويتك بنجاح! ✅");
        sessionStorage.removeItem("diditSessionId");
      } else if (
        status === "Declined" ||
        status === "Failed" ||
        status === "Rejected"
      ) {
        setDiditVerified(false);
        setVerificationStatus("failed");
        setVerificationMessage("فشل التحقق من الهوية. يرجى المحاولة مرة أخرى.");
        sessionStorage.removeItem("diditSessionId");
        setVerificationLoading(false);
      } else if (
        status === "Not Started" ||
        status === "In Progress" ||
        status === "Pending"
      ) {
        setVerificationStatus("retry");
        setVerificationMessage(
          "لم يكتمل التحقق بعد. يرجى المحاولة مرة أخرى..."
        );
      } else if (status === "In Review") {
        setVerificationStatus("checking");
        setVerificationMessage(
          "تحتاج هويتك إلى مراجعة يدوية. سيتم إخطارك عند اكتمال المراجعة."
        );
        sessionStorage.removeItem("diditSessionId");
        setVerificationLoading(false);
      } else {
        setVerificationStatus("failed");
        setVerificationMessage("حالة التحقق غير معروفة. يرجى الاتصال بالدعم.");
        console.warn("Unknown verification status:", status);
        sessionStorage.removeItem("diditSessionId");
        setVerificationLoading(false);
      }
    } catch (error) {
      console.error("Status check error:", error);
      setVerificationStatus("failed");
      setVerificationMessage(
        `حدث خطأ في التحقق من الحالة: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      setVerificationLoading(false);
      sessionStorage.removeItem("diditSessionId");
    }
  };

  return (
    <div className={styles.container}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navContainer}>
          <Link href="/" className={styles.logo}>
            EduEgypt
          </Link>
          <div className={styles.navRight}>
            <span className={styles.navText}>لديك حساب بالفعل؟</span>
            <Link href="/login" className={styles.loginLink}>
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </nav>

      {/* Progress Bar */}
      <div className={styles.progressBar}>
        <div className={styles.progressContainer}>
          <div
            className={styles.progressFill}
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.formContainer}>
          {/* Step 1: User Type Selection */}
          {step === 1 && (
            <div className={styles.stepContent}>
              <h1 className={styles.title}>أهلاً بك في EduEgypt</h1>
              <p className={styles.subtitle}>اختر نوع حسابك للبدء</p>

              <div className={styles.userTypeGrid}>
                {userTypes.map((type) => (
                  <button
                    key={type.type}
                    className={styles.userTypeCard}
                    onClick={() => handleUserTypeSelect(type.type)}
                    style={
                      { "--accent-color": type.color } as React.CSSProperties
                    }
                  >
                    <div className={styles.userTypeIcon}>{type.icon}</div>
                    <h3 className={styles.userTypeTitle}>{type.title}</h3>
                    <p className={styles.userTypeDesc}>{type.description}</p>
                  </button>
                ))}
              </div>

              <div className={styles.adminLink}>
                <p>
                  مسؤول النظام؟ <Link href="/admin/login">دخول الإدارة</Link>
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Basic Information */}
          {step === 2 && (
            <div className={styles.stepContent}>
              <h2 className={styles.stepTitle}>المعلومات الأساسية</h2>
              <p className={styles.subtitle}>أدخل بياناتك الشخصية</p>

              <form onSubmit={handleBasicInfoSubmit} className={styles.form}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="firstName">الاسم الأول</label>
                    <input
                      type="text"
                      id="firstName"
                      {...getFormField("firstName").register}
                      placeholder="أحمد"
                      className={
                        getFormField("firstName").error ? styles.inputError : ""
                      }
                    />
                    {getFormField("firstName").error && (
                      <span className={styles.errorMessage}>
                        {getFormField("firstName").error?.message}
                      </span>
                    )}
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="lastName">اسم العائلة</label>
                    <input
                      type="text"
                      id="lastName"
                      {...getFormField("lastName").register}
                      placeholder="محمد"
                      className={
                        getFormField("lastName").error ? styles.inputError : ""
                      }
                    />
                    {getFormField("lastName").error && (
                      <span className={styles.errorMessage}>
                        {getFormField("lastName").error?.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">البريد الإلكتروني</label>
                  <input
                    type="email"
                    id="email"
                    {...getFormField("email").register}
                    placeholder="example@email.com"
                    className={
                      getFormField("email").error ? styles.inputError : ""
                    }
                  />
                  {getFormField("email").error && (
                    <span className={styles.errorMessage}>
                      {getFormField("email").error?.message}
                    </span>
                  )}
                </div>

                {/* Phone field for all users */}
                <div className={styles.formGroup}>
                  <label htmlFor="phone">رقم الهاتف</label>
                  <PhoneInput
                    international
                    defaultCountry="EG"
                    value={
                      userType === "student"
                        ? studentForm.watch("phone")
                        : baseForm.watch("phone")
                    }
                    onChange={(value) => {
                      if (userType === "student") {
                        studentForm.setValue("phone", value || "", {
                          shouldValidate: true,
                        });
                      } else {
                        baseForm.setValue("phone", value || "", {
                          shouldValidate: true,
                        });
                      }
                    }}
                    className={`${styles.phoneInput} ${
                      userType === "student"
                        ? studentForm.formState.errors.phone
                          ? styles.phoneInputError
                          : ""
                        : baseForm.formState.errors.phone
                        ? styles.phoneInputError
                        : ""
                    }`}
                    placeholder="أدخل رقم هاتفك"
                    countries={["EG"]}
                  />
                  {userType === "student"
                    ? studentForm.formState.errors.phone && (
                        <span className={styles.errorMessage}>
                          {studentForm.formState.errors.phone.message}
                        </span>
                      )
                    : baseForm.formState.errors.phone && (
                        <span className={styles.errorMessage}>
                          {baseForm.formState.errors.phone.message}
                        </span>
                      )}
                </div>

                {/* Student-specific fields */}
                {userType === "student" && (
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="grade">المرحلة الدراسية</label>
                      <select
                        id="grade"
                        {...studentForm.register("grade")}
                        className={
                          studentForm.formState.errors.grade
                            ? styles.inputError
                            : ""
                        }
                      >
                        <option value="">اختر المرحلة</option>
                        <option value="primary-1">الصف الأول الابتدائي</option>
                        <option value="primary-2">الصف الثاني الابتدائي</option>
                        <option value="primary-3">الصف الثالث الابتدائي</option>
                        <option value="primary-4">الصف الرابع الابتدائي</option>
                        <option value="primary-5">الصف الخامس الابتدائي</option>
                        <option value="primary-6">الصف السادس الابتدائي</option>
                        <option value="prep-1">الصف الأول الإعدادي</option>
                        <option value="prep-2">الصف الثاني الإعدادي</option>
                        <option value="prep-3">الصف الثالث الإعدادي</option>
                        <option value="secondary-1">الصف الأول الثانوي</option>
                        <option value="secondary-2">الصف الثاني الثانوي</option>
                        <option value="secondary-3">الصف الثالث الثانوي</option>
                      </select>
                      {studentForm.formState.errors.grade && (
                        <span className={styles.errorMessage}>
                          {studentForm.formState.errors.grade.message}
                        </span>
                      )}
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="birthDate">تاريخ الميلاد</label>
                      <input
                        type="date"
                        id="birthDate"
                        {...studentForm.register("birthDate")}
                        className={
                          studentForm.formState.errors.birthDate
                            ? styles.inputError
                            : ""
                        }
                      />
                      {studentForm.formState.errors.birthDate && (
                        <span className={styles.errorMessage}>
                          {studentForm.formState.errors.birthDate.message}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="password">كلمة المرور</label>
                    <input
                      type="password"
                      id="password"
                      {...getFormField("password").register}
                      placeholder="8 أحرف على الأقل"
                      className={
                        getFormField("password").error ? styles.inputError : ""
                      }
                    />
                    {getFormField("password").error && (
                      <span className={styles.errorMessage}>
                        {getFormField("password").error?.message}
                      </span>
                    )}
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="confirmPassword">تأكيد كلمة المرور</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      {...getFormField("confirmPassword").register}
                      placeholder="أعد كتابة كلمة المرور"
                      className={
                        getFormField("confirmPassword").error
                          ? styles.inputError
                          : ""
                      }
                    />
                    {getFormField("confirmPassword").error && (
                      <span className={styles.errorMessage}>
                        {getFormField("confirmPassword").error?.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.formActions}>
                  <button
                    type="button"
                    className={styles.backButton}
                    onClick={handleBack}
                  >
                    رجوع
                  </button>
                  <button type="submit" className={styles.nextButton}>
                    التالي
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Step 3: Identity Verification or Additional Info */}
          {step === 3 && (
            <div className={styles.stepContent}>
              {userType === "teacher" || userType === "parent" ? (
                <>
                  <h2 className={styles.stepTitle}>التحقق من الهوية</h2>
                  <p className={styles.subtitle}>
                    نحتاج للتحقق من هويتك لضمان أمان المنصة
                  </p>

                  {!diditVerified ? (
                    <div className={styles.verificationContainer}>
                      <div className={styles.verificationCard}>
                        <div className={styles.verificationIcon}>🆔</div>
                        <h3 className={styles.verificationTitle}>
                          التحقق من البطاقة الشخصية
                        </h3>
                        <p className={styles.verificationDesc}>
                          نحتاج للتحقق من هويتك لضمان أمان المنصة
                        </p>

                        {verificationStatus === "idle" && (
                          <>
                            <div className={styles.verificationSteps}>
                              <div className={styles.verStep}>
                                <span className={styles.verStepNumber}>1</span>
                                <p>التقط صورة للجانب الأمامي من البطاقة</p>
                              </div>
                              <div className={styles.verStep}>
                                <span className={styles.verStepNumber}>2</span>
                                <p>التقط صورة للجانب الخلفي من البطاقة</p>
                              </div>
                              <div className={styles.verStep}>
                                <span className={styles.verStepNumber}>3</span>
                                <p>التقط صورة شخصية (سيلفي)</p>
                              </div>
                            </div>

                            <button
                              className={styles.verifyButton}
                              onClick={startVerification}
                              disabled={verificationLoading}
                            >
                              {verificationLoading
                                ? "جاري التحويل..."
                                : "بدء التحقق"}
                            </button>
                          </>
                        )}

                        {(verificationStatus === "checking" ||
                          verificationStatus === "retry") && (
                          <div className={styles.verificationStatus}>
                            <div className={styles.loadingSpinner}></div>
                            <p className={styles.statusMessage}>
                              {verificationMessage}
                            </p>
                          </div>
                        )}

                        {verificationStatus === "failed" && (
                          <div className={styles.verificationStatus}>
                            <div className={styles.failedIcon}>❌</div>
                            <p className={styles.statusMessage}>
                              {verificationMessage}
                            </p>
                            <button
                              className={styles.retryButton}
                              onClick={() => {
                                setVerificationStatus("idle");
                                setVerificationMessage("");
                              }}
                            >
                              حاول مرة أخرى
                            </button>
                          </div>
                        )}

                        {verificationStatus === "approved" && (
                          <div className={styles.verificationStatus}>
                            <div className={styles.successIcon}>✅</div>
                            <p className={styles.statusMessage}>
                              {verificationMessage}
                            </p>
                            <p className={styles.redirectMessage}>
                              سيتم توجيهك تلقائياً...
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className={styles.verifiedCard}>
                      <div className={styles.successIcon}>✅</div>
                      <h3 className={styles.verifiedTitle}>تم التحقق بنجاح!</h3>
                      <p className={styles.verifiedDesc}>هويتك موثقة الآن</p>

                      {/* Additional fields after verification */}
                      <form
                        onSubmit={handleAdditionalInfoSubmit}
                        className={styles.additionalForm}
                      >
                        {userType === "teacher" && (
                          <>
                            <div className={styles.formGroup}>
                              <label htmlFor="specialization">التخصص</label>
                              <select
                                id="specialization"
                                {...teacherAdditionalForm.register(
                                  "specialization"
                                )}
                                className={
                                  teacherAdditionalForm.formState.errors
                                    .specialization
                                    ? styles.inputError
                                    : ""
                                }
                              >
                                <option value="">اختر التخصص</option>
                                <option value="math">رياضيات</option>
                                <option value="science">علوم</option>
                                <option value="arabic">لغة عربية</option>
                                <option value="english">لغة إنجليزية</option>
                                <option value="physics">فيزياء</option>
                                <option value="chemistry">كيمياء</option>
                                <option value="biology">أحياء</option>
                                <option value="history">تاريخ</option>
                                <option value="geography">جغرافيا</option>
                              </select>
                              {teacherAdditionalForm.formState.errors
                                .specialization && (
                                <span className={styles.errorMessage}>
                                  {
                                    teacherAdditionalForm.formState.errors
                                      .specialization.message
                                  }
                                </span>
                              )}
                            </div>
                            <div className={styles.formGroup}>
                              <label htmlFor="yearsOfExperience">
                                سنوات الخبرة
                              </label>
                              <select
                                id="yearsOfExperience"
                                {...teacherAdditionalForm.register(
                                  "yearsOfExperience"
                                )}
                                className={
                                  teacherAdditionalForm.formState.errors
                                    .yearsOfExperience
                                    ? styles.inputError
                                    : ""
                                }
                              >
                                <option value="">اختر سنوات الخبرة</option>
                                <option value="0-2">0-2 سنة</option>
                                <option value="3-5">3-5 سنوات</option>
                                <option value="6-10">6-10 سنوات</option>
                                <option value="10+">أكثر من 10 سنوات</option>
                              </select>
                              {teacherAdditionalForm.formState.errors
                                .yearsOfExperience && (
                                <span className={styles.errorMessage}>
                                  {
                                    teacherAdditionalForm.formState.errors
                                      .yearsOfExperience.message
                                  }
                                </span>
                              )}
                            </div>
                          </>
                        )}

                        {userType === "parent" && (
                          <div className={styles.formGroup}>
                            <label htmlFor="childrenCount">عدد الأبناء</label>
                            <select
                              id="childrenCount"
                              {...parentAdditionalForm.register(
                                "childrenCount"
                              )}
                              className={
                                parentAdditionalForm.formState.errors
                                  .childrenCount
                                  ? styles.inputError
                                  : ""
                              }
                            >
                              <option value="">اختر عدد الأبناء</option>
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5+">5 أو أكثر</option>
                            </select>
                            {parentAdditionalForm.formState.errors
                              .childrenCount && (
                              <span className={styles.errorMessage}>
                                {
                                  parentAdditionalForm.formState.errors
                                    .childrenCount.message
                                }
                              </span>
                            )}
                            <p className={styles.childrenNote}>
                              ستتمكن من إضافة بيانات أبنائك بعد إكمال التسجيل
                            </p>
                          </div>
                        )}

                        <div className={styles.formActions}>
                          <button
                            type="button"
                            className={styles.backButton}
                            onClick={handleBack}
                          >
                            رجوع
                          </button>
                          <button type="submit" className={styles.nextButton}>
                            التالي
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </>
              ) : (
                /* Additional info for students */
                <>
                  <h2 className={styles.stepTitle}>معلومات إضافية</h2>
                  <p className={styles.subtitle}>
                    ساعدنا في تخصيص تجربتك التعليمية
                  </p>

                  <div className={styles.preferencesCard}>
                    <h3 className={styles.cardTitle}>المواد المفضلة</h3>
                    <p className={styles.cardDesc}>
                      اختر المواد التي تهتم بدراستها
                    </p>
                    <div className={styles.subjectsGrid}>
                      {[
                        "رياضيات",
                        "علوم",
                        "لغة عربية",
                        "لغة إنجليزية",
                        "فيزياء",
                        "كيمياء",
                        "أحياء",
                      ].map((subject) => (
                        <label key={subject} className={styles.checkboxLabel}>
                          <input type="checkbox" />
                          <span>{subject}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className={styles.goalsCard}>
                    <h3 className={styles.cardTitle}>هدفك من المنصة</h3>
                    <select className={styles.goalSelect}>
                      <option value="">اختر هدفك</option>
                      <option value="improve">تحسين مستواي الدراسي</option>
                      <option value="exam">التحضير للامتحانات</option>
                      <option value="learn">تعلم مهارات جديدة</option>
                      <option value="help">
                        الحصول على مساعدة في الواجبات
                      </option>
                    </select>
                  </div>

                  <div className={styles.formActions}>
                    <button
                      type="button"
                      className={styles.backButton}
                      onClick={handleBack}
                    >
                      رجوع
                    </button>
                    <button
                      type="button"
                      className={styles.nextButton}
                      onClick={() => setStep(4)}
                    >
                      التالي
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 4: Terms and Submit */}
          {step === 4 && (
            <div className={styles.stepContent}>
              <h2 className={styles.stepTitle}>الشروط والأحكام</h2>
              <p className={styles.subtitle}>
                آخر خطوة قبل الانضمام لعائلة EduEgypt
              </p>

              <div className={styles.termsCard}>
                <div className={styles.termsContent}>
                  <h3 className={styles.termsTitle}>
                    باستخدامك للمنصة، فأنت توافق على:
                  </h3>
                  <ul className={styles.termsList}>
                    <li>استخدام المنصة للأغراض التعليمية فقط</li>
                    <li>احترام جميع المستخدمين والمعلمين</li>
                    <li>عدم مشاركة المحتوى المسجل بدون إذن</li>
                    <li>الحفاظ على سرية بيانات حسابك</li>
                    <li>الإبلاغ عن أي سلوك غير لائق</li>
                  </ul>
                </div>

                <label className={styles.termsCheckbox}>
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    onChange={(e) => {
                      const checkbox = e.target as HTMLInputElement;
                      if (checkbox.checked) {
                        checkbox.classList.remove(styles.checkboxError);
                      }
                    }}
                    required
                  />
                  <span>
                    أوافق على <Link href="/terms">الشروط والأحكام</Link> و
                    <Link href="/privacy">سياسة الخصوصية</Link>
                  </span>
                </label>
              </div>

              <div className={styles.newsletterCard}>
                <label className={styles.newsletterCheckbox}>
                  <input type="checkbox" />
                  <span>أرغب في تلقي نصائح تعليمية وتحديثات المنصة</span>
                </label>
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.backButton}
                  onClick={handleBack}
                >
                  رجوع
                </button>
                <button
                  type="button"
                  className={styles.submitButton}
                  onClick={() => {
                    const termsCheckbox = document.querySelector(
                      'input[name="acceptTerms"]'
                    ) as HTMLInputElement;
                    if (!termsCheckbox.checked) {
                      termsCheckbox.classList.add(styles.checkboxError);
                      alert("يجب الموافقة على الشروط والأحكام للمتابعة");
                      return;
                    }
                    handleFinalSubmit();
                  }}
                >
                  إنشاء الحساب
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Success State */}
          {step === 5 && (
            <div className={styles.successContent}>
              <div className={styles.successAnimation}>
                <div className={styles.successCheckmark}>
                  <div className={styles.checkIcon}>
                    <span className={styles.iconLineTip}></span>
                    <span className={styles.iconLineLong}></span>
                  </div>
                </div>
              </div>
              <h1 className={styles.successTitle}>
                مرحباً بك في عائلة EduEgypt!
              </h1>
              <p className={styles.successText}>تم إنشاء حسابك بنجاح</p>
              <p className={styles.successSubtext}>
                تم إرسال رسالة تأكيد إلى بريدك الإلكتروني
              </p>
              <Link href="/login" className={styles.loginButton}>
                تسجيل الدخول
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    }>
      <SignupContent />
    </Suspense>
  );
}