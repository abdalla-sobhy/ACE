# ملك - Login, Teacher & Student Documentation

## Overview
You worked on three major areas:
1. **Login System** - Authentication for all users
2. **Teacher Portal** - Course creation, management, and live classes
3. **Student Portal** - Course enrollment, learning, and progress tracking

---

## Part 1: Login System

### Login Page (`/login`)
**File:** `/home/user/ACE/frontend/app/login/page.tsx`

### What It Does
- Authenticates users of ALL types (student, teacher, parent, company, admin, university student)
- Validates credentials with backend
- Stores authentication token
- Redirects to appropriate dashboard based on user type

### Login Flow Diagram
```
User enters email & password
    ↓
Frontend validates format
    ↓
POST /api/auth/login
    ↓
Backend checks credentials
    ├─ Invalid → Show error
    ├─ Suspended → Show "Account suspended"
    ├─ Pending Approval (Teacher) → Show "Pending approval"
    └─ Valid → Generate token
         ↓
    Store token in localStorage + cookies
         ↓
    Redirect to dashboard:
    ├─ student → /student/dashboard
    ├─ teacher → /teacher/dashboard
    ├─ parent → /parent/profile
    ├─ university_student → /university_student/dashboard
    ├─ company → /company/dashboard
    └─ admin → /admin/dashboard
```

### Code Implementation

```tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember_me: false
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      // Call backend API
      const response = await axios.post(
        'http://localhost:8000/api/auth/login',
        formData
      )

      const { token, user, expires_at, remember_me } = response.data

      // Store authentication data
      localStorage.setItem('authToken', token)
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('authData', JSON.stringify({
        token,
        expiresAt: expires_at,
        rememberMe: remember_me
      }))

      // Store in cookies for server-side access
      document.cookie = `authToken=${token}; path=/; SameSite=Strict`
      document.cookie = `userType=${user.type}; path=/; SameSite=Strict`

      // Remember email if checked
      if (remember_me) {
        localStorage.setItem('rememberedEmail', formData.email)
      }

      // Redirect based on user type
      const redirectMap = {
        student: '/student/dashboard',
        teacher: '/teacher/dashboard',
        parent: '/parent/profile',
        university_student: '/university_student/dashboard',
        company: '/company/dashboard',
        admin: '/admin/dashboard'
      }

      router.push(redirectMap[user.type] || '/')

    } catch (error) {
      if (error.response?.status === 401) {
        setErrors({ general: 'Invalid email or password' })
      } else if (error.response?.status === 403) {
        setErrors({ general: error.response.data.message })
      } else if (error.response?.status === 429) {
        setErrors({ general: 'Too many login attempts. Try again later.' })
      } else {
        setErrors({ general: 'Login failed. Please try again.' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Login to ACE
        </h1>

        {errors.general && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({
                ...formData,
                email: e.target.value
              })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({
                ...formData,
                password: e.target.value
              })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Remember Me */}
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.remember_me}
                onChange={(e) => setFormData({
                  ...formData,
                  remember_me: e.target.checked
                })}
                className="mr-2"
              />
              <span className="text-sm">Remember me (90 days)</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Links */}
        <div className="mt-4 text-center text-sm">
          <p>
            Don't have an account?{' '}
            <a href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
```

### Key Features
- **Email validation** - Must be valid email format
- **Password requirement** - Minimum 8 characters
- **Remember me** - Extends token from 24 hours to 90 days
- **Rate limiting** - Max 5 attempts per 15 minutes
- **Error handling** - Shows specific error messages
- **Auto-redirect** - Based on user type

---

## Part 2: Teacher Portal

### Teacher Dashboard (`/teacher/dashboard`)
**File:** `/home/user/ACE/frontend/app/teacher/dashboard/page.tsx`

### What Teachers Can Do
1. **Create Courses** (recorded or live)
2. **Manage Courses** (edit, delete, view students)
3. **Upload Lessons** (videos and materials)
4. **Host Live Sessions** (via Agora)
5. **Track Revenue** (earnings from course sales)
6. **View Analytics** (student count, ratings, views)

### Dashboard Overview

```tsx
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function TeacherDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    averageRating: 0
  })
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('authToken')

      // Fetch statistics
      const statsRes = await axios.get(
        'http://localhost:8000/api/teacher/stats',
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setStats(statsRes.data)

      // Fetch courses
      const coursesRes = await axios.get(
        'http://localhost:8000/api/teacher/courses',
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setCourses(coursesRes.data.courses)

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Teacher Dashboard</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Courses"
          value={stats.totalCourses}
          icon="📚"
        />
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon="👥"
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue}`}
          icon="💰"
        />
        <StatCard
          title="Average Rating"
          value={stats.averageRating.toFixed(1)}
          icon="⭐"
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <button
          onClick={() => router.push('/teacher/courses/create')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          + Create New Course
        </button>
      </div>

      {/* Courses List */}
      <div>
        <h2 className="text-2xl font-bold mb-4">My Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              onEdit={() => router.push(`/teacher/courses/${course.id}/edit`)}
              onView={() => router.push(`/teacher/courses/${course.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
```

### Create Course Page (`/teacher/courses/create`)
**File:** `/home/user/ACE/frontend/app/teacher/courses/create/page.tsx`

Teachers can create two types:

#### 1. Recorded Courses
- Upload pre-recorded video lessons
- Set course price
- Add lesson descriptions
- Create course structure

#### 2. Live Courses
- Schedule live sessions
- Set max seats (capacity)
- Define session times
- Set sessions per week

```tsx
export default function CreateCourse() {
  const [courseType, setCourseType] = useState('recorded') // or 'live'
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    grade: '',
    price: 0,
    duration: 0,

    // Live course specific
    maxSeats: 30,
    startDate: '',
    endDate: '',
    sessionsPerWeek: 2
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem('authToken')

      const response = await axios.post(
        'http://localhost:8000/api/teacher/courses',
        {
          ...formData,
          course_type: courseType
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      const courseId = response.data.course.id

      // Redirect to add lessons (for recorded) or schedule (for live)
      if (courseType === 'recorded') {
        router.push(`/teacher/courses/${courseId}`)
      } else {
        router.push(`/teacher/courses/${courseId}/schedule`)
      }

    } catch (error) {
      alert('Failed to create course')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Course</h1>

      {/* Course Type Selection */}
      <div className="mb-6">
        <label className="block font-medium mb-2">Course Type</label>
        <div className="flex gap-4">
          <button
            onClick={() => setCourseType('recorded')}
            className={`px-6 py-3 rounded ${
              courseType === 'recorded'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200'
            }`}
          >
            📹 Recorded Course
          </button>
          <button
            onClick={() => setCourseType('live')}
            className={`px-6 py-3 rounded ${
              courseType === 'live'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200'
            }`}
          >
            🎥 Live Course
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Common Fields */}
        <input
          type="text"
          placeholder="Course Title"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          required
        />

        <textarea
          placeholder="Course Description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          required
        />

        <select
          value={formData.grade}
          onChange={(e) => setFormData({...formData, grade: e.target.value})}
          required
        >
          <option value="">Select Grade Level</option>
          <option value="Grade 1">Grade 1</option>
          <option value="Grade 2">Grade 2</option>
          {/* ... more grades */}
        </select>

        <input
          type="number"
          placeholder="Price ($)"
          value={formData.price}
          onChange={(e) => setFormData({...formData, price: e.target.value})}
          required
        />

        {/* Live Course Specific Fields */}
        {courseType === 'live' && (
          <>
            <input
              type="number"
              placeholder="Max Students"
              value={formData.maxSeats}
              onChange={(e) => setFormData({...formData, maxSeats: e.target.value})}
            />

            <input
              type="date"
              placeholder="Start Date"
              value={formData.startDate}
              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
            />

            <input
              type="date"
              placeholder="End Date"
              value={formData.endDate}
              onChange={(e) => setFormData({...formData, endDate: e.target.value})}
            />

            <input
              type="number"
              placeholder="Sessions per Week"
              value={formData.sessionsPerWeek}
              onChange={(e) => setFormData({...formData, sessionsPerWeek: e.target.value})}
            />
          </>
        )}

        <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded">
          Create Course
        </button>
      </form>
    </div>
  )
}
```

### Manage Course Lessons (`/teacher/courses/[id]`)
**File:** `/home/user/ACE/frontend/app/teacher/courses/[id]/page.tsx`

```tsx
export default function ManageCourseLessons({ params }) {
  const courseId = params.id
  const [course, setCourse] = useState(null)
  const [lessons, setLessons] = useState([])

  const handleAddLesson = async (lessonData) => {
    const token = localStorage.getItem('authToken')

    const formData = new FormData()
    formData.append('title', lessonData.title)
    formData.append('description', lessonData.description)
    formData.append('video', lessonData.videoFile) // File upload
    formData.append('duration', lessonData.duration)
    formData.append('is_preview', lessonData.isPreview)

    try {
      await axios.post(
        `http://localhost:8000/api/teacher/courses/${courseId}/lessons`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      // Refresh lessons list
      fetchLessons()

    } catch (error) {
      alert('Failed to add lesson')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        Manage Course: {course?.title}
      </h1>

      {/* Course Info */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <p>Students Enrolled: {course?.students_count}</p>
        <p>Total Lessons: {course?.lessons_count}</p>
        <p>Status: {course?.status}</p>
      </div>

      {/* Add Lesson Form */}
      <LessonForm onSubmit={handleAddLesson} />

      {/* Lessons List */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Lessons</h2>
        {lessons.map((lesson, index) => (
          <LessonItem
            key={lesson.id}
            lesson={lesson}
            index={index}
            onEdit={() => {/* Edit lesson */}}
            onDelete={() => {/* Delete lesson */}}
          />
        ))}
      </div>
    </div>
  )
}
```

### Live Class Hosting (`/teacher/live-class/[sessionId]`)
**File:** `/home/user/ACE/frontend/app/teacher/live-class/[sessionId]/page.tsx`

Uses **Agora RTC SDK** for video streaming:

```tsx
import AgoraRTC from 'agora-rtc-sdk-ng'

export default function TeacherLiveClass({ params }) {
  const sessionId = params.sessionId
  const [client, setClient] = useState(null)
  const [localTracks, setLocalTracks] = useState({
    videoTrack: null,
    audioTrack: null
  })
  const [isLive, setIsLive] = useState(false)
  const [students, setStudents] = useState([])

  const startLiveSession = async () => {
    try {
      // Initialize Agora client
      const agoraClient = AgoraRTC.createClient({
        mode: 'rtc',
        codec: 'vp8'
      })

      // Join channel
      const token = await getAgoraToken(sessionId) // From backend
      await agoraClient.join(
        AGORA_APP_ID,
        `session-${sessionId}`,
        token,
        userId
      )

      // Create local tracks
      const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks()

      setLocalTracks({ audioTrack, videoTrack })

      // Publish tracks
      await agoraClient.publish([audioTrack, videoTrack])

      // Play local video
      videoTrack.play('local-player')

      setIsLive(true)
      setClient(agoraClient)

      // Notify backend session started
      await axios.post(
        `http://localhost:8000/api/live/session/${sessionId}/start`,
        {},
        { headers: { Authorization: `Bearer ${authToken}` } }
      )

    } catch (error) {
      alert('Failed to start live session')
    }
  }

  const endLiveSession = async () => {
    // Unpublish and close tracks
    localTracks.audioTrack?.close()
    localTracks.videoTrack?.close()

    await client?.leave()

    setIsLive(false)

    // Notify backend
    await axios.post(
      `http://localhost:8000/api/live/session/${sessionId}/end`,
      {},
      { headers: { Authorization: `Bearer ${authToken}` } }
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Live Class Session</h1>

        {/* Video Container */}
        <div className="grid grid-cols-3 gap-4">
          {/* Teacher Video (Large) */}
          <div className="col-span-2">
            <div
              id="local-player"
              className="w-full h-96 bg-black rounded"
            />
          </div>

          {/* Student List */}
          <div className="bg-gray-800 p-4 rounded">
            <h3 className="font-bold mb-4">
              Students ({students.length})
            </h3>
            <ul>
              {students.map(student => (
                <li key={student.id} className="mb-2">
                  {student.name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-8 flex gap-4">
          {!isLive ? (
            <button
              onClick={startLiveSession}
              className="bg-green-600 px-6 py-3 rounded hover:bg-green-700"
            >
              Start Session
            </button>
          ) : (
            <button
              onClick={endLiveSession}
              className="bg-red-600 px-6 py-3 rounded hover:bg-red-700"
            >
              End Session
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
```

---

## Part 3: Student Portal

### Student Dashboard (`/student/dashboard`)
**File:** `/home/user/ACE/frontend/app/student/dashboard/page.tsx`

### What Students Can Do
1. **Browse Courses** - Explore available courses
2. **Enroll in Courses** - Purchase and enroll
3. **Watch Lessons** - Stream video content
4. **Track Progress** - See completion percentage
5. **Join Live Classes** - Attend live sessions
6. **View Certificates** - Download completion certificates

### Dashboard Overview

```tsx
export default function StudentDashboard() {
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [availableCourses, setAvailableCourses] = useState([])
  const [stats, setStats] = useState({
    coursesEnrolled: 0,
    coursesCompleted: 0,
    hoursWatched: 0
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    const token = localStorage.getItem('authToken')

    // Fetch enrolled courses
    const enrolledRes = await axios.get(
      'http://localhost:8000/api/student/my-courses',
      { headers: { Authorization: `Bearer ${token}` } }
    )
    setEnrolledCourses(enrolledRes.data.courses)

    // Fetch available courses
    const coursesRes = await axios.get(
      'http://localhost:8000/api/courses'
    )
    setAvailableCourses(coursesRes.data.courses)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Student Dashboard</h1>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <StatCard title="Enrolled Courses" value={stats.coursesEnrolled} />
        <StatCard title="Completed Courses" value={stats.coursesCompleted} />
        <StatCard title="Hours Watched" value={stats.hoursWatched} />
      </div>

      {/* Continue Learning */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Continue Learning</h2>
        <div className="grid grid-cols-3 gap-6">
          {enrolledCourses.map(course => (
            <EnrolledCourseCard
              key={course.id}
              course={course}
              progress={course.progress}
            />
          ))}
        </div>
      </section>

      {/* Browse Courses */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Explore Courses</h2>
        <div className="grid grid-cols-3 gap-6">
          {availableCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>
    </div>
  )
}
```

### Course Enrollment & Payment (`/student/payment/[courseId]`)
**File:** `/home/user/ACE/frontend/app/student/payment/[courseId]/page.tsx`

Supports **Stripe** and **PayPal**:

```tsx
export default function CoursePayment({ params }) {
  const courseId = params.courseId
  const [course, setCourse] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('stripe')

  const handleStripePayment = async () => {
    const token = localStorage.getItem('authToken')

    // Create payment intent
    const response = await axios.post(
      `http://localhost:8000/api/payment/stripe/create-intent/${courseId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )

    const { clientSecret } = response.data

    // Use Stripe SDK to handle payment
    const stripe = await loadStripe(STRIPE_PUBLIC_KEY)
    const { error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: { name: userName }
      }
    })

    if (!error) {
      // Payment successful, confirm with backend
      await axios.post(
        'http://localhost:8000/api/payment/stripe/confirm',
        { courseId, paymentIntentId: response.data.paymentIntentId },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      router.push('/student/my-courses')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Complete Enrollment</h1>

      {/* Course Summary */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-2xl font-bold">{course?.title}</h2>
        <p className="text-gray-600 mt-2">{course?.description}</p>
        <p className="text-3xl font-bold mt-4">${course?.price}</p>
      </div>

      {/* Payment Method Selection */}
      <div className="mb-6">
        <button
          onClick={() => setPaymentMethod('stripe')}
          className={paymentMethod === 'stripe' ? 'selected' : ''}
        >
          💳 Credit Card (Stripe)
        </button>
        <button
          onClick={() => setPaymentMethod('paypal')}
          className={paymentMethod === 'paypal' ? 'selected' : ''}
        >
          PayPal
        </button>
      </div>

      {/* Payment Form */}
      {paymentMethod === 'stripe' ? (
        <StripePaymentForm onSubmit={handleStripePayment} />
      ) : (
        <PayPalButton courseId={courseId} />
      )}
    </div>
  )
}
```

### Watch Course (`/student/courses/[id]`)
**File:** `/home/user/ACE/frontend/app/student/courses/[id]/page.tsx`

```tsx
export default function WatchCourse({ params }) {
  const courseId = params.id
  const [course, setCourse] = useState(null)
  const [lessons, setLessons] = useState([])
  const [currentLesson, setCurrentLesson] = useState(null)

  const handleLessonComplete = async (lessonId) => {
    const token = localStorage.getItem('authToken')

    await axios.post(
      `http://localhost:8000/api/student/lessons/${lessonId}/progress`,
      { is_completed: true },
      { headers: { Authorization: `Bearer ${token}` } }
    )

    // Refresh course data
    fetchCourseData()
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="grid grid-cols-4 gap-4">
        {/* Video Player (Left 3 columns) */}
        <div className="col-span-3 bg-black">
          <video
            src={`http://localhost:8000/api/stream/lesson/${currentLesson?.id}?token=${authToken}`}
            controls
            className="w-full"
            onEnded={() => handleLessonComplete(currentLesson.id)}
          />

          <div className="bg-white p-6">
            <h2 className="text-2xl font-bold">{currentLesson?.title}</h2>
            <p className="text-gray-600 mt-2">{currentLesson?.description}</p>
          </div>
        </div>

        {/* Lesson List (Right column) */}
        <div className="bg-white p-4">
          <h3 className="font-bold mb-4">Course Content</h3>
          <ul>
            {lessons.map((lesson, index) => (
              <li
                key={lesson.id}
                onClick={() => setCurrentLesson(lesson)}
                className={`p-3 cursor-pointer hover:bg-gray-100 ${
                  currentLesson?.id === lesson.id ? 'bg-blue-100' : ''
                }`}
              >
                <div className="flex items-center">
                  {lesson.is_completed ? '✅' : '⭕'}
                  <span className="ml-2">
                    {index + 1}. {lesson.title}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {Math.floor(lesson.duration / 60)} min
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
```

---

## Testing Questions

### Login System
**1. What happens when user logs in?**
- Credentials validated
- Token generated and stored
- Redirected to dashboard based on user type

**2. How long is the auth token valid?**
- 24 hours normal, 90 days if "remember me"

**3. What if wrong password?**
- Show error, increment attempt counter
- After 5 attempts: locked for 15 minutes

### Teacher Portal
**4. What can teachers create?**
- Recorded courses (pre-recorded videos)
- Live courses (scheduled sessions)

**5. How do teachers add lessons?**
- Upload video files
- Add title, description, duration
- Set lesson order

**6. What technology is used for live classes?**
- Agora RTC SDK

**7. Can teachers see their earnings?**
- Yes, dashboard shows total revenue

### Student Portal
**8. How do students enroll in courses?**
- Click course → Go to payment → Pay via Stripe/PayPal → Enroll

**9. How is progress tracked?**
- Each lesson watched updates progress
- Video completion triggers progress update

**10. Can students watch lessons multiple times?**
- Yes, unlimited access after enrollment

---

## Your Impact

✅ **Login System:** Secure authentication for all user types
✅ **Teacher Portal:** Full course creation and management
✅ **Student Portal:** Complete learning experience
✅ **Live Streaming:** Real-time video classes
✅ **Payment Integration:** Stripe and PayPal

You built the core learning experience of ACE! 🎓
