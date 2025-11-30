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

---

## Technical Deep Dive

### 1. Authentication Flow Architecture

**Login State Machine:**
```
User submits credentials
    ↓
[Client] Validate format (email, password length)
    ↓
[Client] POST /api/auth/login with formData
    ↓
[Server] Validate credentials (email exists, password matches)
    ↓
[Server] Check user status (approved, not suspended)
    ↓
[Server] Generate Sanctum token (24hrs or 90 days)
    ↓
[Server] Update last_login_at, last_login_ip
    ↓
[Server] Return: {user, token, expires_at}
    ↓
[Client] Store token in localStorage + cookies
    ↓
[Client] Redirect based on user.type
```

**Token Storage Strategy:**
```tsx
// Triple storage for redundancy and server-side access
localStorage.setItem('authToken', token)              // JS access
localStorage.setItem('user', JSON.stringify(user))    // User data
document.cookie = `authToken=${token}; SameSite=Strict`  // Server access
document.cookie = `userType=${user.type}`             // Quick type check
```

**Why multiple storage locations?**
- localStorage: Fast client-side access
- Cookies: Server-side rendering can read (SSR)
- SameSite=Strict: Prevents CSRF attacks

---

### 2. Axios Interceptors for Auth

**Request Interceptor (Attaches token):**
```tsx
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api'
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)
```

**Response Interceptor (Handles 401):**
```tsx
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

**Usage:**
```tsx
// All requests automatically include auth token
const response = await api.get('/teacher/courses')
```

---

### 3. Form State Management

**Complex State Pattern (Course Creation):**
```tsx
interface CourseFormData {
  title: string
  description: string
  category: string
  grade: string
  price: number
  courseType: 'recorded' | 'live'
  // Live-specific
  maxSeats?: number
  startDate?: string
  endDate?: string
  sessionsPerWeek?: number
  // Recorded-specific
  lessons?: LessonData[]
}

const [formData, setFormData] = useState<CourseFormData>({
  title: '',
  description: '',
  courseType: 'recorded',
  // ... defaults
})

// Update helper
const updateField = (field: keyof CourseFormData, value: any) => {
  setFormData(prev => ({ ...prev, [field]: value }))
}
```

**Computed properties pattern:**
```tsx
const isLiveCourse = formData.courseType === 'live'
const canSubmit = formData.title && formData.price > 0

{isLiveCourse && (
  <input name="maxSeats" onChange={e => updateField('maxSeats', e.target.value)} />
)}
```

---

### 4. File Upload Handling

**FormData for Multipart Uploads:**
```tsx
const handleLessonUpload = async (lessonData: LessonData) => {
  const formData = new FormData()
  
  // Text fields
  formData.append('title', lessonData.title)
  formData.append('description', lessonData.description)
  formData.append('duration', String(lessonData.duration))
  
  // File field
  formData.append('video', lessonData.videoFile) // File object from input
  
  // Boolean as string
  formData.append('is_preview', lessonData.isPreview ? '1' : '0')
  
  const response = await axios.post(
    `/teacher/courses/${courseId}/lessons`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      },
      onUploadProgress: (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        setUploadProgress(percent)
      }
    }
  )
}
```

**File Input Handling:**
```tsx
<input
  type="file"
  accept="video/*"
  onChange={(e) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate size (max 500MB)
      if (file.size > 500 * 1024 * 1024) {
        alert('File too large')
        return
      }
      // Validate type
      if (!file.type.startsWith('video/')) {
        alert('Must be a video file')
        return
      }
      setVideoFile(file)
    }
  }}
/>
```

---

### 5. Video Streaming Implementation

**HTML5 Video Element:**
```tsx
<video
  src={`http://localhost:8000/api/stream/lesson/${lessonId}?token=${authToken}`}
  controls
  className="w-full"
  onTimeUpdate={(e) => {
    const video = e.target as HTMLVideoElement
    const watchedSeconds = Math.floor(video.currentTime)
    
    // Update progress every 10 seconds
    if (watchedSeconds % 10 === 0) {
      updateLessonProgress(lessonId, watchedSeconds)
    }
  }}
  onEnded={() => {
    markLessonComplete(lessonId)
  }}
/>
```

**Progress Tracking:**
```tsx
const updateLessonProgress = async (lessonId: number, watchedDuration: number) => {
  await axios.post(
    `/student/lessons/${lessonId}/progress`,
    {
      watched_duration: watchedDuration,
      is_completed: false
    },
    { headers: { Authorization: `Bearer ${token}` } }
  )
}
```

**Backend Streaming (Laravel):**
```php
public function streamLesson($lessonId, Request $request)
{
    $lesson = CourseLesson::findOrFail($lessonId)
    $filePath = storage_path('app/' . $lesson->video_file_path)
    
    // Support range requests for seeking
    $fileSize = filesize($filePath)
    $range = $request->header('Range')
    
    if ($range) {
        [$start, $end] = explode('-', substr($range, 6));
        $end = $end ?: $fileSize - 1;
        $length = $end - $start + 1;
        
        return response()->stream(
            function () use ($filePath, $start, $length) {
                $file = fopen($filePath, 'rb');
                fseek($file, $start);
                echo fread($file, $length);
                fclose($file);
            },
            206,
            [
                'Content-Type' => 'video/mp4',
                'Content-Length' => $length,
                'Content-Range' => "bytes $start-$end/$fileSize",
                'Accept-Ranges' => 'bytes'
            ]
        );
    }
    
    return response()->file($filePath);
}
```

---

### 6. Agora RTC Integration (Live Streaming)

**Initialize Agora Client:**
```tsx
import AgoraRTC, { IAgoraRTCClient } from 'agora-rtc-sdk-ng'

const client: IAgoraRTCClient = AgoraRTC.createClient({
  mode: 'rtc',  // Real-time communication
  codec: 'vp8'  // Video codec
})

const APP_ID = 'your_agora_app_id'
```

**Teacher - Start Live Class:**
```tsx
const startLiveSession = async (sessionId: number) => {
  try {
    // 1. Get Agora token from backend
    const { data } = await axios.post(
      `/live/session/${sessionId}/start`,
      {},
      { headers: { Authorization: `Bearer ${authToken}` } }
    )
    
    const { agoraToken, channel } = data
    
    // 2. Join Agora channel
    const uid = await client.join(APP_ID, channel, agoraToken, userId)
    
    // 3. Create local video/audio tracks
    const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks()
    
    // 4. Play local video
    videoTrack.play('local-player')
    
    // 5. Publish tracks to channel
    await client.publish([audioTrack, videoTrack])
    
    setIsLive(true)
    
  } catch (error) {
    console.error('Failed to start session:', error)
  }
}
```

**Student - Join Live Class:**
```tsx
const joinLiveSession = async (sessionId: number) => {
  try {
    // 1. Get Agora token
    const { data } = await axios.post(
      `/live/session/${sessionId}/join`,
      {},
      { headers: { Authorization: `Bearer ${authToken}` } }
    )
    
    // 2. Join channel (same as teacher)
    await client.join(APP_ID, data.channel, data.agoraToken, userId)
    
    // 3. Subscribe to remote users
    client.on('user-published', async (user, mediaType) => {
      await client.subscribe(user, mediaType)
      
      if (mediaType === 'video') {
        const remoteVideoTrack = user.videoTrack
        remoteVideoTrack.play('remote-player')
      }
      
      if (mediaType === 'audio') {
        const remoteAudioTrack = user.audioTrack
        remoteAudioTrack.play()
      }
    })
    
  } catch (error) {
    console.error('Failed to join session:', error)
  }
}
```

**Cleanup:**
```tsx
const endSession = async () => {
  // Stop local tracks
  localAudioTrack?.stop()
  localVideoTrack?.stop()
  localAudioTrack?.close()
  localVideoTrack?.close()
  
  // Leave channel
  await client.leave()
  
  setIsLive(false)
}

// Cleanup on unmount
useEffect(() => {
  return () => {
    endSession()
  }
}, [])
```

---

### 7. Payment Integration (Stripe)

**Create Payment Intent:**
```tsx
const handleEnrollment = async (courseId: number) => {
  try {
    // 1. Create payment intent on backend
    const { data } = await axios.post(
      `/payment/stripe/create-intent/${courseId}`,
      {},
      { headers: { Authorization: `Bearer ${authToken}` } }
    )
    
    const { clientSecret, paymentIntentId } = data
    
    // 2. Confirm payment with Stripe.js
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!)
    
    const cardElement = elements.getElement(CardElement)
    
    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: userName,
            email: userEmail
          }
        }
      }
    )
    
    if (error) {
      setError(error.message)
      return
    }
    
    // 3. Confirm with backend
    if (paymentIntent.status === 'succeeded') {
      await axios.post(
        '/payment/stripe/confirm',
        {
          courseId,
          paymentIntentId
        },
        { headers: { Authorization: `Bearer ${authToken}` } }
      )
      
      router.push('/student/my-courses')
    }
    
  } catch (error) {
    console.error('Payment failed:', error)
  }
}
```

**Stripe CardElement Component:**
```tsx
import { CardElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!)

function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()
  
  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }}
      />
      <button type="submit" disabled={!stripe}>
        Pay ${course.price}
      </button>
    </form>
  )
}

// Wrap in Elements provider
<Elements stripe={stripePromise}>
  <CheckoutForm />
</Elements>
```

---

### 8. Real-time Data Sync

**Polling Pattern (Dashboard Stats):**
```tsx
useEffect(() => {
  const fetchStats = async () => {
    const { data } = await axios.get('/teacher/stats')
    setStats(data)
  }
  
  // Initial fetch
  fetchStats()
  
  // Poll every 30 seconds
  const interval = setInterval(fetchStats, 30000)
  
  // Cleanup
  return () => clearInterval(interval)
}, [])
```

**Optimistic UI Updates:**
```tsx
const handleDeleteLesson = async (lessonId: number) => {
  // 1. Optimistically update UI
  setLessons(prev => prev.filter(l => l.id !== lessonId))
  
  try {
    // 2. Make API call
    await axios.delete(`/teacher/lessons/${lessonId}`)
  } catch (error) {
    // 3. Revert on error
    fetchLessons() // Re-fetch to restore state
    alert('Failed to delete lesson')
  }
}
```

---

### 9. Error Handling Patterns

**Centralized Error Handler:**
```tsx
const handleApiError = (error: any) => {
  if (error.response) {
    // Server responded with error
    const { status, data } = error.response
    
    switch (status) {
      case 401:
        // Unauthorized - redirect to login
        localStorage.clear()
        router.push('/login')
        break
      case 403:
        // Forbidden
        alert('You do not have permission')
        break
      case 422:
        // Validation error
        setErrors(data.errors)
        break
      case 429:
        // Rate limit
        alert('Too many requests. Please wait.')
        break
      default:
        alert('An error occurred')
    }
  } else if (error.request) {
    // Request made but no response
    alert('Network error. Please check your connection.')
  } else {
    // Error setting up request
    alert('An unexpected error occurred')
  }
}

// Usage
try {
  await api.post('/teacher/courses', formData)
} catch (error) {
  handleApiError(error)
}
```

---

### 10. Performance Optimization

**Lazy Loading Routes:**
```tsx
import dynamic from 'next/dynamic'

// Lazy load heavy components
const VideoPlayer = dynamic(() => import('@/components/VideoPlayer'), {
  loading: () => <p>Loading player...</p>,
  ssr: false // Don't render on server
})
```

**Memoization:**
```tsx
import { useMemo, useCallback } from 'react'

const TeacherDashboard = () => {
  const [courses, setCourses] = useState([])
  
  // Memoize expensive calculation
  const totalRevenue = useMemo(() => {
    return courses.reduce((sum, course) => {
      return sum + (course.price * course.students_count * 0.7) // 70% revenue share
    }, 0)
  }, [courses]) // Only recalculate when courses change
  
  // Memoize callback
  const handleDelete = useCallback((id) => {
    setCourses(prev => prev.filter(c => c.id !== id))
  }, [])
  
  return (
    <div>
      <p>Total Revenue: ${totalRevenue}</p>
      {courses.map(course => (
        <CourseCard key={course.id} course={course} onDelete={handleDelete} />
      ))}
    </div>
  )
}
```

---

## Technical Interview Questions (60+ Questions)

### Authentication & Security (15 questions)

**1. How does token-based authentication work?**
- User logs in with credentials
- Server verifies and generates token
- Client stores token (localStorage/cookies)
- Client sends token in Authorization header for subsequent requests
- Server verifies token on each request

**2. Where should you store auth tokens?**
- localStorage: Easy access, XSS vulnerable
- httpOnly cookie: XSS safe, CSRF vulnerable
- Both: httpOnly cookie + CSRF token (best)

**3. What is the difference between localStorage and sessionStorage?**
- localStorage: Persists until manually cleared
- sessionStorage: Cleared when tab closes

**4. How do you implement "Remember Me" functionality?**
```tsx
if (rememberMe) {
  // Long-lived token (90 days)
  token = createToken(user, { expiresIn: '90d' })
} else {
  // Short-lived token (24 hours)
  token = createToken(user, { expiresIn: '24h' })
}
```

**5. What is JWT and how is it structured?**
- JSON Web Token
- Three parts: Header.Payload.Signature
- Header: Algorithm and type
- Payload: Claims (user data)
- Signature: Verification

**6. How do you handle token expiration?**
```tsx
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 401) {
      // Token expired
      logout()
      router.push('/login')
    }
    return Promise.reject(error)
  }
)
```

**7. What is CSRF and how to prevent it?**
- Cross-Site Request Forgery
- Attacker tricks user into making unwanted request
- Prevention: CSRF tokens, SameSite cookies

**8. What is XSS and how to prevent it?**
- Cross-Site Scripting
- Injecting malicious scripts
- Prevention: Escape user input, Content Security Policy

**9. How do you validate user permissions on frontend?**
```tsx
const canEditCourse = (course) => {
  return user?.id === course.teacher_id && user?.type === 'teacher'
}

{canEditCourse(course) && (
  <button onClick={() => editCourse(course.id)}>Edit</button>
)}
```

**10. Should you trust frontend validation?**
- No! Always validate on backend
- Frontend validation is for UX only
- Attackers can bypass frontend

**11. How do you handle rate limiting on frontend?**
```tsx
if (error.response.status === 429) {
  const retryAfter = error.response.headers['retry-after']
  alert(`Too many requests. Try again in ${retryAfter} seconds`)
}
```

**12. What is the purpose of the Authorization header?**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
- Sends authentication token with request
- Bearer scheme for API tokens

**13. How do you implement logout?**
```tsx
const logout = async () => {
  try {
    // Call backend to invalidate token
    await axios.post('/auth/logout', {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
  } finally {
    // Clear local storage regardless
    localStorage.clear()
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC'
    router.push('/login')
  }
}
```

**14. What are refresh tokens?**
- Long-lived token to get new access token
- Access token: Short-lived (15min)
- Refresh token: Long-lived (90 days)
- More secure than long-lived access tokens

**15. How do you prevent brute force login attacks?**
- Rate limiting (5 attempts per 15 minutes)
- CAPTCHA after failed attempts
- Account lockout after too many failures
- Email notification on failed login

---

### File Upload & Media (10 questions)

**16. How do you handle file uploads in React?**
```tsx
<input
  type="file"
  onChange={(e) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }}
/>
```

**17. How do you send files to backend?**
```tsx
const formData = new FormData()
formData.append('video', fileObject)
formData.append('title', 'Lesson Title')

await axios.post('/api/lessons', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
})
```

**18. How do you show upload progress?**
```tsx
await axios.post('/api/lessons', formData, {
  onUploadProgress: (progressEvent) => {
    const percent = Math.round(
      (progressEvent.loaded * 100) / progressEvent.total
    )
    setUploadProgress(percent)
  }
})
```

**19. How do you validate file size?**
```tsx
const MAX_SIZE = 500 * 1024 * 1024 // 500MB

if (file.size > MAX_SIZE) {
  alert('File too large (max 500MB)')
  return
}
```

**20. How do you validate file type?**
```tsx
const ALLOWED_TYPES = ['video/mp4', 'video/webm']

if (!ALLOWED_TYPES.includes(file.type)) {
  alert('Invalid file type')
  return
}
```

**21. How does HTML5 video streaming work?**
```tsx
<video
  src="/api/stream/lesson/123"
  controls
  onLoadedMetadata={(e) => {
    const video = e.target as HTMLVideoElement
    setDuration(video.duration)
  }}
/>
```

**22. What are video range requests?**
- HTTP Range header allows seeking
- Request specific byte range of video
- Enables video scrubbing (jump to timestamp)

**23. How do you track video watch progress?**
```tsx
<video
  onTimeUpdate={(e) => {
    const currentTime = e.target.currentTime
    if (currentTime % 10 === 0) {
      updateProgress(currentTime)
    }
  }}
/>
```

**24. What is adaptive bitrate streaming?**
- Multiple video qualities
- Switch based on network speed
- Technologies: HLS, DASH
- Better user experience

**25. How do you implement video thumbnails?**
```tsx
<video poster="/thumbnails/lesson-123.jpg">
```
Or generate from video:
```bash
ffmpeg -i video.mp4 -ss 00:00:05 -vframes 1 thumbnail.jpg
```

---

### State Management (10 questions)

**26. When should you use useState vs useReducer?**
- useState: Simple state (strings, numbers, booleans)
- useReducer: Complex state (objects with many fields)

**27. What is lifting state up?**
- Moving state to common parent component
- Share state between sibling components
- Pass down via props

**28. How do you manage form state efficiently?**
```tsx
const [formData, setFormData] = useState({
  title: '',
  description: '',
  price: 0
})

const handleChange = (e) => {
  const { name, value } = e.target
  setFormData(prev => ({ ...prev, [name]: value }))
}

<input name="title" onChange={handleChange} />
```

**29. What are controlled vs uncontrolled components?**
- Controlled: React state controls value
- Uncontrolled: DOM controls value (use refs)

**30. How do you prevent unnecessary re-renders?**
- Use React.memo for components
- Use useMemo for expensive calculations
- Use useCallback for event handlers
- Optimize dependency arrays

**31. What is the useEffect dependency array?**
```tsx
useEffect(() => {
  fetchCourses()
}, [userId]) // Only re-run when userId changes
```
- Empty []: Run once on mount
- No array: Run on every render
- [deps]: Run when dependencies change

**32. How do you handle asynchronous state updates?**
```tsx
const [loading, setLoading] = useState(false)
const [data, setData] = useState(null)
const [error, setError] = useState(null)

useEffect(() => {
  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get('/courses')
      setData(response.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  fetchData()
}, [])
```

**33. What is the Context API and when to use it?**
- Share data across component tree
- Avoid prop drilling
- Use for: theme, auth, language
```tsx
const AuthContext = createContext()

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

const { user } = useContext(AuthContext)
```

**34. How do you optimize large lists?**
- Virtual scrolling (react-window, react-virtualized)
- Pagination
- Infinite scroll
- Only render visible items

**35. What is the difference between client and server state?**
- Client state: UI state, form inputs, modals
- Server state: Data from API, cached on client
- Libraries: React Query, SWR for server state

---

### API Integration (10 questions)

**36. How do you make API calls in React?**
```tsx
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get('/api/courses')
      setCourses(response.data)
    } catch (error) {
      console.error(error)
    }
  }
  fetchData()
}, [])
```

**37. What is axios and why use it over fetch?**
- axios: Promise-based HTTP client
- Automatic JSON parsing
- Request/response interceptors
- Better error handling
- Request cancellation

**38. How do you cancel API requests?**
```tsx
useEffect(() => {
  const source = axios.CancelToken.source()
  
  axios.get('/api/courses', {
    cancelToken: source.token
  })
  
  return () => {
    source.cancel('Component unmounted')
  }
}, [])
```

**39. What are axios interceptors?**
```tsx
// Request interceptor (add auth token)
axios.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${token}`
  return config
})

// Response interceptor (handle errors)
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 401) {
      logout()
    }
    return Promise.reject(error)
  }
)
```

**40. How do you handle loading states?**
```tsx
const [loading, setLoading] = useState(false)

const fetchData = async () => {
  setLoading(true)
  try {
    const data = await api.get('/courses')
    setCourses(data)
  } finally {
    setLoading(false)
  }
}

if (loading) return <Spinner />
```

**41. How do you implement retry logic?**
```tsx
const fetchWithRetry = async (url, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await axios.get(url)
    } catch (error) {
      if (i === retries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
    }
  }
}
```

**42. What is CORS and how do you handle it?**
- Cross-Origin Resource Sharing
- Browser security feature
- Backend must set CORS headers
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
```

**43. How do you handle API errors globally?**
```tsx
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      const { status, data } = error.response
      switch (status) {
        case 400: toast.error(data.message); break
        case 401: logout(); break
        case 500: toast.error('Server error'); break
      }
    }
    return Promise.reject(error)
  }
)
```

**44. What is the difference between GET and POST?**
- GET: Retrieve data, parameters in URL, cacheable
- POST: Send data, parameters in body, not cacheable

**45. How do you implement pagination?**
```tsx
const [page, setPage] = useState(1)
const [courses, setCourses] = useState([])

useEffect(() => {
  axios.get(`/api/courses?page=${page}`)
    .then(res => setCourses(res.data.data))
}, [page])

<button onClick={() => setPage(p => p + 1)}>Next</button>
```

---

### Payment Integration (5 questions)

**46. How does Stripe payment flow work?**
1. Create payment intent on backend
2. Get client secret
3. Confirm payment on frontend with Stripe.js
4. Stripe processes payment
5. Confirm with backend
6. Enroll user in course

**47. What is a payment intent?**
- Represents intention to collect payment
- Tracks payment lifecycle
- Contains amount, currency, status

**48. How do you handle payment errors?**
```tsx
const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret)

if (error) {
  setError(error.message)
  return
}

if (paymentIntent.status === 'succeeded') {
  // Success
}
```

**49. What is PCI compliance?**
- Payment Card Industry Data Security Standard
- Rules for handling credit card data
- Never store card numbers
- Use Stripe.js (handles card data)

**50. How do you implement PayPal integration?**
```tsx
import { PayPalButtons } from '@paypal/react-paypal-js'

<PayPalButtons
  createOrder={(data, actions) => {
    return actions.order.create({
      purchase_units: [{
        amount: { value: course.price }
      }]
    })
  }}
  onApprove={async (data, actions) => {
    await actions.order.capture()
    await enrollInCourse(courseId)
  }}
/>
```

---

### Live Streaming (Agora) (5 questions)

**51. What is WebRTC?**
- Web Real-Time Communication
- Peer-to-peer audio/video
- Low latency
- Used by Agora, Zoom, Google Meet

**52. How does Agora work?**
- SDK connects to Agora servers
- Creates audio/video tracks
- Publishes to channel
- Other users subscribe to tracks

**53. What is a channel in Agora?**
- Virtual room for communication
- Users join same channel
- Can publish/subscribe to streams

**54. How do you handle remote users?**
```tsx
client.on('user-published', async (user, mediaType) => {
  await client.subscribe(user, mediaType)
  
  if (mediaType === 'video') {
    user.videoTrack.play('remote-player')
  }
})
```

**55. How do you clean up WebRTC connections?**
```tsx
useEffect(() => {
  return () => {
    localTracks.forEach(track => {
      track.stop()
      track.close()
    })
    client.leave()
  }
}, [])
```

---

### Debugging & Testing (10 questions)

**56. How do you debug API calls?**
- Browser DevTools Network tab
- Console.log responses
- axios interceptors
- React DevTools

**57. How do you test authentication flows?**
- Manual testing with different user types
- Check token storage
- Test token expiration
- Test unauthorized access

**58. What tools help with debugging React?**
- React DevTools
- Redux DevTools (if using Redux)
- console.log
- debugger statement
- Browser DevTools

**59. How do you handle errors in async functions?**
```tsx
try {
  await api.post('/courses', data)
} catch (error) {
  console.error('Error:', error)
  setError(error.message)
}
```

**60. What is error boundary in React?**
```tsx
class ErrorBoundary extends React.Component {
  componentDidCatch(error, info) {
    console.log(error, info)
  }
  
  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong</h1>
    }
    return this.props.children
  }
}
```

