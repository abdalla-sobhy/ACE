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
  cv: FileList;
}

// Parent additional form data
interface ParentAdditionalData {
  childrenCount: string;
}

interface DiditVerificationData {
  sessionId: string;
  sessionNumber: number;
  status: string;
  vendorData: string;
  metadata?: Record<string, any>;
  // Personal Information from ID
  personalInfo?: {
    firstName?: string;
    lastName?: string;
    firstNameNative?: string;
    lastNameNative?: string;
    fullName?: string;
    dateOfBirth?: string;
    gender?: string;
    nationality?: string;
    nationalId?: string;
    documentNumber?: string;
    documentType?: string;
    issuingCountry?: string;
    issuingState?: string;
    expiryDate?: string;
    address?: string;
    maritalStatus?: string;
  };
  // Verification checks results
  checks?: {
    documentVerification?: boolean;
    faceMatch?: boolean;
    liveness?: boolean;
    ageVerification?: boolean;
    amlCheck?: boolean;
  };
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
  cv: z
    .custom<FileList>()
    .refine((files) => files?.length > 0, "يرجى رفع السيرة الذاتية")
    .refine(
      (files) => files?.[0]?.size <= 5 * 1024 * 1024, // 5MB limit
      "حجم الملف يجب أن يكون أقل من 5 ميجابايت"
    )
    .refine(
      (files) => {
        const allowedTypes = ["application/pdf", "application/msword", 
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
        return files?.[0] && allowedTypes.includes(files[0].type);
      },
      "الملف يجب أن يكون PDF أو Word"
    ),
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
  const [diditVerificationData, setDiditVerificationData] = useState<DiditVerificationData | null>(null);

  // Didit verification functions
  useEffect(() => {
    if (searchParams && searchParams.get("verification") === "complete") {
      const savedState = sessionStorage.getItem("registrationState");
      const savedSessionId = sessionStorage.getItem("diditSessionId");
      const savedDiditData = sessionStorage.getItem("diditVerificationData");

      if (savedState) {
        const state = JSON.parse(savedState);

        setStep(state.step);
        setUserType(state.userType);

        if (state.userType === "student" && state.formData) {
          Object.keys(state.formData).forEach((key) => {
            studentForm.setValue(key as any, state.formData[key]);
          });
        } else if (state.formData) {
          Object.keys(state.formData).forEach((key) => {
            baseForm.setValue(key as any, state.formData[key]);
          });
        }

        if (state.userType === "teacher" && state.teacherData) {
          Object.keys(state.teacherData).forEach((key) => {
            teacherAdditionalForm.setValue(key as any, state.teacherData[key]);
          });
        } else if (state.userType === "parent" && state.parentData) {
          Object.keys(state.parentData).forEach((key) => {
            parentAdditionalForm.setValue(key as any, state.parentData[key]);
          });
        }

        if (savedDiditData) {
          setDiditVerificationData(JSON.parse(savedDiditData));
        }

        if (savedSessionId) {
          setDiditSessionId(savedSessionId);
          checkVerificationStatus(savedSessionId);
        }

        sessionStorage.removeItem("registrationState");
        sessionStorage.removeItem("diditVerificationData");

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
  const formData = new FormData();
  
  // Add user type
  formData.append("userType", userType || "");

  // Prepare the data object to send
  const dataToSend: any = {
    userType: userType || ""
  };

  // Get basic data based on user type
  if (userType === "student") {
    const studentData = studentForm.getValues();
    dataToSend.basicData = studentData;
    
    // Add student data to FormData
    Object.keys(studentData).forEach((key) => {
      formData.append(`basicData[${key}]`, studentData[key as keyof StudentFormData]);
    });
  } else {
    const baseData = baseForm.getValues();
    dataToSend.basicData = baseData;
    
    // Add basic data to FormData
    Object.keys(baseData).forEach((key) => {
      formData.append(`basicData[${key}]`, baseData[key as keyof BaseFormData]);
    });
  }

  // Handle teacher-specific data
  if (userType === "teacher") {
    const teacherData = teacherAdditionalForm.getValues();
    
    // Add teacher data except CV
    formData.append("teacherData[specialization]", teacherData.specialization);
    formData.append("teacherData[yearsOfExperience]", teacherData.yearsOfExperience);
    
    // Add CV file separately
    if (teacherData.cv && teacherData.cv[0]) {
      formData.append("cv", teacherData.cv[0]);
    }
    
    dataToSend.teacherData = {
      specialization: teacherData.specialization,
      yearsOfExperience: teacherData.yearsOfExperience
    };
  }
  
  // Handle parent-specific data
  if (userType === "parent") {
    const parentData = parentAdditionalForm.getValues();
    formData.append("parentData[childrenCount]", parentData.childrenCount);
    dataToSend.parentData = parentData;
  }

  // Add Didit verification data for teachers and parents
  if ((userType === "teacher" || userType === "parent") && diditVerificationData) {
    // Extract only the needed fields from diditData
    const diditDataToSend = {
      sessionId: diditVerificationData.sessionId,
      sessionNumber: diditVerificationData.sessionNumber,
      status: diditVerificationData.status
    };
    
    // Add to FormData
    formData.append("diditData[sessionId]", diditDataToSend.sessionId);
    formData.append("diditData[sessionNumber]", diditDataToSend.sessionNumber.toString());
    formData.append("diditData[status]", diditDataToSend.status);
    
    dataToSend.diditData = diditDataToSend;
    
    // Extract personal info fields
    if (diditVerificationData.personalInfo) {
      const personalInfo = {
        dateOfBirth: diditVerificationData.personalInfo.dateOfBirth || "",
        gender: diditVerificationData.personalInfo.gender || "",
        nationalId: diditVerificationData.personalInfo.nationalId || "",
        documentNumber: diditVerificationData.personalInfo.documentNumber || "",
        documentType: diditVerificationData.personalInfo.documentType || "",
        issuingCountry: diditVerificationData.personalInfo.issuingCountry || "",
        expiryDate: diditVerificationData.personalInfo.expiryDate || "",
        address: diditVerificationData.personalInfo.address || "",
        maritalStatus: diditVerificationData.personalInfo.maritalStatus || ""
      };
      
      // Add personal info to FormData
      Object.keys(personalInfo).forEach((key) => {
        formData.append(`personalInfo[${key}]`, personalInfo[key as keyof typeof personalInfo]);
      });
      
      dataToSend.personalInfo = personalInfo;
    }
  }

  // Log the data being sent
  console.log("Data being sent to backend:", dataToSend);

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/auth/register`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      if (userType === "teacher") {
        setStep(6);
      } else {
        setStep(5);
      }
    } else {
      alert(data.message || "حدث خطأ في التسجيل");
    }
  } catch (error) {
    console.error("Registration error:", error);
    alert("حدث خطأ في الاتصال بالخادم");
  }
};

  const startVerification = async () => {
    try {
      setVerificationLoading(true);

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

      if (diditVerificationData) {
        sessionStorage.setItem("diditVerificationData", JSON.stringify(diditVerificationData));
      }

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
          phone: userData.phone,
          userType: userType,
          vendorData: `${userType}_${userData.email}`,
          metadata: {
            userType: userType,
            registrationDate: new Date().toISOString(),
            platform: "web"
          }
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
    
    let attempts = 0;
    const maxAttempts = 10;
    const pollInterval = 3000;

    const checkStatus = async () => {
      const response = await fetch(`/api/didit/session-status/${sessionId}`);
      const data = await response.json();

      if (!response.ok && response.status !== 404) {
        throw new Error(data.error || 'Failed to check status');
      }

      const status = data.status;
      
      if (status === "Approved") {
        // Use the decision data directly from the session-status response
        if (data.decision) {
          const verificationData: DiditVerificationData = {
            sessionId: data.sessionId,
            sessionNumber: data.decision.session_number,
            status: data.status,
            vendorData: data.decision.vendor_data,
            metadata: data.decision.metadata,
            personalInfo: {
              firstName: data.decision.id_verification?.first_name,
              lastName: data.decision.id_verification?.last_name,
              fullName: data.decision.id_verification?.full_name,
              dateOfBirth: data.decision.id_verification?.date_of_birth,
              gender: data.decision.id_verification?.gender,
              nationality: data.decision.id_verification?.nationality,
              nationalId: data.decision.id_verification?.personal_number,
              documentNumber: data.decision.id_verification?.document_number,
              documentType: data.decision.id_verification?.document_type,
              issuingCountry: data.decision.id_verification?.issuing_state,
              issuingState: data.decision.id_verification?.issuing_state_name,
              expiryDate: data.decision.id_verification?.expiration_date,
              address: data.decision.id_verification?.address,
              maritalStatus: data.decision.id_verification?.marital_status,
            },
            checks: {
              documentVerification: data.decision.id_verification?.status === "Approved",
              faceMatch: data.decision.face_match?.status === "Approved",
              liveness: data.decision.liveness?.status === "Approved",
              ageVerification: data.decision.id_verification?.age >= 18,
              amlCheck: data.decision.aml?.status === "Approved",
            }
          };
          
          setDiditVerificationData(verificationData);
          
          // Check nationality for teachers
          if (userType === "teacher") {
            const isEgyptian = 
              data.decision.id_verification?.issuing_state === "EGY" ||
              data.decision.id_verification?.issuing_state_name?.toLowerCase() === "egypt";
              
            if (!isEgyptian) {
              setDiditVerified(false);
              setVerificationStatus("failed");
              setVerificationMessage("عذراً، يجب أن تكون مصري الجنسية للتسجيل كمحاضر في المنصة");
              sessionStorage.removeItem("diditSessionId");
              return true;
            }
          }
        }
        
        setDiditVerified(true);
        setVerificationStatus("approved");
        setVerificationMessage("تم التحقق من هويتك بنجاح! ✅");
        sessionStorage.removeItem("diditSessionId");
        
        // Auto-proceed after verification for better UX
        setTimeout(() => {
          if (userType === "teacher" || userType === "parent") {
            // Trigger form submit to move to next step
            handleAdditionalInfoSubmit(new Event('submit') as any);
          }
        }, 2000);
        
        return true;
      } else if (["Declined", "Failed", "Rejected"].includes(status)) {
        setDiditVerified(false);
        setVerificationStatus("failed");
        setVerificationMessage("فشل التحقق من الهوية. يرجى المحاولة مرة أخرى.");
        return true;
      } else if (status === "In Review") {
        setVerificationStatus("checking");
        setVerificationMessage("يتم مراجعة هويتك يدوياً. سنخطرك عند الانتهاء.");
        localStorage.setItem('pendingVerificationSession', sessionId);
        return true;
      } else if (["Not Started", "In Progress", "Pending"].includes(status)) {
        return false;
      }
      
      return false;
    };

    while (attempts < maxAttempts) {
      const isDone = await checkStatus();
      if (isDone) break;
      
      attempts++;
      if (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, pollInterval));
      }
    }

    if (attempts >= maxAttempts) {
      setVerificationStatus("retry");
      setVerificationMessage("التحقق يستغرق وقتاً أطول من المتوقع. يرجى المحاولة لاحقاً.");
    }

  } catch (error) {
    console.error('Status check error:', error);
    setVerificationStatus("failed");
    setVerificationMessage("حدث خطأ في التحقق من الحالة.");
  } finally {
    setVerificationLoading(false);
  }
};

const VerificationSummary = ({ data }: { data: DiditVerificationData }) => {
  if (!data?.personalInfo) return null;
  
  return (
    <div className={styles.verificationSummary}>
      <h4>بيانات التحقق</h4>
      <div className={styles.summaryGrid}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>الاسم:</span>
          <span>{data.personalInfo.fullName || `${data.personalInfo.firstName} ${data.personalInfo.lastName}`}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>تاريخ الميلاد:</span>
          <span>{data.personalInfo.dateOfBirth}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>الجنسية:</span>
          <span>{data.personalInfo.nationality}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>رقم الهوية:</span>
          <span>{data.personalInfo.nationalId || data.personalInfo.documentNumber}</span>
        </div>
      </div>
    </div>
  );
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
        // If failed due to nationality, don't allow retry
        if (verificationMessage.includes("مصري الجنسية")) {
          router.push("/");
        } else {
          setVerificationStatus("idle");
          setVerificationMessage("");
        }
      }}
    >
      {verificationMessage.includes("مصري الجنسية") ? "العودة للرئيسية" : "حاول مرة أخرى"}
    </button>
  </div>
)}

                        {verificationStatus === "approved" && (
                          <div className={styles.verificationStatus}>
                            <div className={styles.successIcon}>✅</div>
                            <p className={styles.statusMessage}>
                              {verificationMessage}
                            </p>
                            {diditVerificationData && (
                              <VerificationSummary data={diditVerificationData} />
                            )}
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

                            <div className={styles.formGroup}>
                              <label htmlFor="cv">السيرة الذاتية (CV)</label>
                              <div className={styles.fileUploadContainer}>
                                <input
                                  type="file"
                                  id="cv"
                                  {...teacherAdditionalForm.register("cv")}
                                  accept=".pdf,.doc,.docx"
                                  className={`${styles.fileInput} ${
                                    teacherAdditionalForm.formState.errors.cv
                                      ? styles.inputError
                                      : ""
                                  }`}
                                />
                                <label htmlFor="cv" className={styles.fileUploadLabel}>
                                  <span className={styles.uploadIcon}>📄</span>
                                  <span>اختر ملف السيرة الذاتية</span>
                                  <small>PDF أو Word (حد أقصى 5 ميجابايت)</small>
                                </label>
                                {teacherAdditionalForm.watch("cv")?.[0] && (
                                  <p className={styles.fileName}>
                                    {teacherAdditionalForm.watch("cv")?.[0].name}
                                  </p>
                                )}
                              </div>
                              {teacherAdditionalForm.formState.errors.cv && (
                                <span className={styles.errorMessage}>
                                  {teacherAdditionalForm.formState.errors.cv.message}
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


              {/* Add this debug section - remove it later */}
    {process.env.NODE_ENV === 'development' && (
      <div style={{ 
        background: '#1a1a1a', 
        padding: '1rem', 
        borderRadius: '8px', 
        marginBottom: '2rem',
        border: '1px solid #333'
      }}>
        <h4 style={{ color: '#58a6ff', marginBottom: '0.5rem' }}>Debug Info:</h4>
        <pre style={{ 
          color: '#c9d1d9', 
          fontSize: '12px', 
          overflow: 'auto',
          whiteSpace: 'pre-wrap'
        }}>
          {JSON.stringify({
            userType,
            basicData: userType === "student" ? studentForm.getValues() : baseForm.getValues(),
            teacherData: userType === "teacher" ? teacherAdditionalForm.getValues() : null,
            parentData: userType === "parent" ? parentAdditionalForm.getValues() : null,
            diditData: diditVerificationData,
            diditSessionId
          }, null, 2)}
        </pre>
      </div>
    )}




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

          {step === 6 && (
            <div className={styles.successContent}>
              <div className={styles.pendingAnimation}>
                <div className={styles.pendingIcon}>⏳</div>
              </div>
              <h1 className={styles.successTitle}>تم إرسال طلبك بنجاح!</h1>
              <p className={styles.successText}>
                سيراجع فريقنا سيرتك الذاتية وسيتم إخطارك عند الموافقة
              </p>
              <p className={styles.successSubtext}>
                يستغرق هذا عادة من 1-2 يوم عمل
              </p>
              <div className={styles.pendingInfo}>
                <h3>ماذا بعد؟</h3>
                <ul>
                  <li>سنراجع سيرتك الذاتية ومؤهلاتك</li>
                  <li>ستتلقى بريد إلكتروني عند الموافقة على حسابك</li>
                  <li>بعد الموافقة، يمكنك تسجيل الدخول وبدء التدريس</li>
                </ul>
              </div>
              <Link href="/" className={styles.homeButton}>
                العودة للصفحة الرئيسية
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