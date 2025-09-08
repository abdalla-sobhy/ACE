"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import "./login.css";
import NavigationBar from '@/components/Nav/Nav';
import "./loginIndex.css";
import Link from "next/link";

interface LoginData {
  emailOrUsername: string;
  password: string;
}

export default function LoginRTL() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>();

  const onSubmit: SubmitHandler<LoginData> = async (data) => {
    try {
      const res = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.emailOrUsername.includes("@")
            ? data.emailOrUsername
            : undefined,
          username: !data.emailOrUsername.includes("@")
            ? data.emailOrUsername
            : undefined,
          password: data.password,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Login failed");
      }

      localStorage.setItem("token", result.token);

      switch (result.user.role) {
        case "student":
          router.push("/dashboard/student");
          break;
        case "teacher":
          router.push("/dashboard/teacher");
          break;
        case "parent":
          router.push("/dashboard/parent");
          break;
        default:
          router.push("/dashboard");
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div id="wholePageWrapper" dir="rtl">
      
      <nav>
        <div id="navContainer">
          <div id="leftNav">
            <Link href="/" id="logo">
              EduEgypt
            </Link>
          </div>
          <div id="rightNav">
            <Link href="/signup" id="signIn">
              انضم مجاناً
            </Link>
          </div>
        </div>
      </nav>

      <div id="contentWrapper">
        {/* <div id="logoImg">
          <img src={book.src} alt="logo" />
        </div> */}
        <h1>تسجيل الدخول</h1>

        <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ textAlign: "right" }}>
          {/* email or username */}
          <div className="formGroup">
            <label htmlFor="emailOrUsername" id="emailLabel">
              البريد الإلكتروني أو اسم المستخدم
            </label>
            <input
              id="emailOrUsername"
              type="text"
              placeholder="example@email.com"
              style={{ direction: "rtl", textAlign: "right" }}
              {...register("emailOrUsername", {
                required: "هذة الخانة مطلوبة",
                minLength: {
                  value: 8,
                  message: "يجب أن يتكون من 8 احرف عل الأقل",
                },
                validate: (value) => {
                  const emailRegex =
                    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                  const usernameRegex = /^[a-zA-Z0-9._]+$/;
                  if (value.includes("@")) {
                    return (
                      emailRegex.test(value) || "أدخل ايميل صحيح"
                    );
                  } else {
                    return (
                      usernameRegex.test(value) || "أدخل إسم مستخدم صحيح"
                    );
                  }
                },
              })}
            />
            {errors.emailOrUsername && (
              <p className="error" style={{ textAlign: "right" }}>
                {errors.emailOrUsername.message}
              </p>
            )}
          </div>

          {/* password */}
          <div className="formGroup">
            <label htmlFor="password" id="passwordLabel">
              كلمة المرور
            </label>
            <input
              id="password"
              type="password"
              placeholder="أدخل كلمة المرور"
              style={{ direction: "rtl"}}
              {...register("password", {
                required: "كلمة المرور مطلوبة",
                minLength: {
                  value: 8,
                  message: "يجب أن يتكون من 8 احرف على الأقل",
                },
                pattern: {
                  value: /^(?=.*[A-Z])(?=.*\d).+$/,
                  message: "يجب أن يحتوي على أرقام و حرف Capital على الأقل",
                },
              })}
            />
            {errors.password && (
              <p className="error">
                {errors.password.message}
              </p>
            )}
          </div>

          <button type="submit">تسجيل الدخول</button>
        </form>

        <div id="orWrapper">
          <div className="line"></div>
          <p>أو</p>
          <div className="line"></div>
        </div>
        <button id="signWithGoogleBtn" type="button">
          <img src="./googleIcon.svg" alt="google" />
          المتابعة باستخدام Google
        </button>
        <div className="switchSignIn-Up">
          <p>جديد على LMS؟</p>
          <a href="#">إنشاء حساب</a>
        </div>
      </div>
    </div>
  );
}
