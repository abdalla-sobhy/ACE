# محمد - Signup, Parent & Company Documentation

## Overview
You worked on three critical areas:
1. **Signup System** - User registration for all user types
2. **Parent Portal** - Child monitoring and follow system
3. **Company Portal** - Job posting and recruitment features

---

## Part 1: Signup System

### Signup Page (`/signup`)
**File:** `/home/user/ACE/frontend/app/signup/page.tsx`

### What It Does
The signup page is a **multi-step wizard** that adapts based on user type. Different fields are shown depending on whether someone is signing up as:
- Student
- Teacher
- Parent
- University Student
- Company

### Signup Flow Diagram
```
User lands on /signup
    ↓
Step 1: Select User Type
    ├─ Student
    ├─ Teacher
    ├─ Parent
    ├─ University Student
    └─ Company
    ↓
Step 2: Basic Information
    - First Name, Last Name
    - Email, Phone
    - Password
    ↓
Step 3: Type-Specific Information
    ├─ Student → Grade, Birth Date
    ├─ Teacher → Specialization, CV, Didit Verification
    ├─ Parent → Children Count, Didit Verification
    ├─ Uni Student → Faculty, University Email
    └─ Company → Company Name, Industry, Size
    ↓
Submit to Backend
    ↓
Backend Creates:
    - User record
    - Profile record (specific to type)
    - Auth token
    ↓
Redirect:
    ├─ Approved immediately → Dashboard
    └─ Needs approval → Waiting page
```

### Code Implementation

```tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [userType, setUserType] = useState('')
  const [formData, setFormData] = useState({
    // Basic info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',

    // Student-specific
    grade: '',
    birthDate: '',

    // Teacher-specific
    specialization: '',
    yearsOfExperience: '',
    cv: null,
    diditSessionId: '',
    diditSessionNumber: '',
    diditStatus: '',

    // Parent-specific
    childrenCount: '',

    // University Student-specific
    faculty: '',
    goal: '',

    // Company-specific
    companyName: '',
    industry: '',
    companySize: '',
    location: '',
    website: '',
    registrationNumber: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  // Step 1: Select User Type
  const renderUserTypeSelection = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <UserTypeCard
        type="student"
        title="Student"
        icon="🎓"
        description="K-12 students (ages 6-25)"
        selected={userType === 'student'}
        onClick={() => {
          setUserType('student')
          setStep(2)
        }}
      />

      <UserTypeCard
        type="teacher"
        title="Teacher"
        icon="👨‍🏫"
        description="Create and sell courses"
        selected={userType === 'teacher'}
        onClick={() => {
          setUserType('teacher')
          setStep(2)
        }}
      />

      <UserTypeCard
        type="parent"
        title="Parent"
        icon="👪"
        description="Monitor your children's progress"
        selected={userType === 'parent'}
        onClick={() => {
          setUserType('parent')
          setStep(2)
        }}
      />

      <UserTypeCard
        type="university_student"
        title="University Student"
        icon="🎯"
        description="Find internships and jobs"
        selected={userType === 'university_student'}
        onClick={() => {
          setUserType('university_student')
          setStep(2)
        }}
      />

      <UserTypeCard
        type="company"
        title="Company"
        icon="🏢"
        description="Post jobs and hire talent"
        selected={userType === 'company'}
        onClick={() => {
          setUserType('company')
          setStep(2)
        }}
      />
    </div>
  )

  // Step 2: Basic Information
  const renderBasicInfo = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Basic Information</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            First Name *
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({
              ...formData,
              firstName: e.target.value
            })}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Last Name *
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({
              ...formData,
              lastName: e.target.value
            })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Email *
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({
            ...formData,
            email: e.target.value
          })}
          className="w-full p-2 border rounded"
          placeholder={
            userType === 'university_student'
              ? 'your.name@university.edu.eg'
              : 'your.email@example.com'
          }
          required
        />
        {userType === 'university_student' && (
          <p className="text-sm text-gray-600 mt-1">
            Must be a valid Egyptian university email
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Phone *
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({
            ...formData,
            phone: e.target.value
          })}
          className="w-full p-2 border rounded"
          placeholder="+20123456789"
          pattern="^\+20[0-9]{10}$"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Password *
        </label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({
            ...formData,
            password: e.target.value
          })}
          className="w-full p-2 border rounded"
          minLength={8}
          required
        />
        <p className="text-sm text-gray-600 mt-1">
          At least 8 characters, including uppercase and number
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Confirm Password *
        </label>
        <input
          type="password"
          value={formData.password_confirmation}
          onChange={(e) => setFormData({
            ...formData,
            password_confirmation: e.target.value
          })}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={() => setStep(1)}
          className="px-6 py-2 border rounded hover:bg-gray-100"
        >
          Back
        </button>
        <button
          onClick={() => setStep(3)}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Next
        </button>
      </div>
    </div>
  )

  // Step 3: Type-Specific Information
  const renderTypeSpecificInfo = () => {
    switch (userType) {
      case 'student':
        return renderStudentFields()
      case 'teacher':
        return renderTeacherFields()
      case 'parent':
        return renderParentFields()
      case 'university_student':
        return renderUniversityStudentFields()
      case 'company':
        return renderCompanyFields()
      default:
        return null
    }
  }

  // Student-specific fields
  const renderStudentFields = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Student Information</h2>

      <div>
        <label className="block text-sm font-medium mb-2">
          Grade Level *
        </label>
        <select
          value={formData.grade}
          onChange={(e) => setFormData({
            ...formData,
            grade: e.target.value
          })}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Grade</option>
          <option value="Grade 1">Grade 1</option>
          <option value="Grade 2">Grade 2</option>
          <option value="Grade 3">Grade 3</option>
          {/* ... up to Grade 12 */}
          <option value="Secondary">Secondary</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Birth Date * (Age 6-25)
        </label>
        <input
          type="date"
          value={formData.birthDate}
          onChange={(e) => setFormData({
            ...formData,
            birthDate: e.target.value
          })}
          className="w-full p-2 border rounded"
          max={new Date(new Date().setFullYear(new Date().getFullYear() - 6)).toISOString().split('T')[0]}
          min={new Date(new Date().setFullYear(new Date().getFullYear() - 25)).toISOString().split('T')[0]}
          required
        />
      </div>

      {renderSubmitButton()}
    </div>
  )

  // Teacher-specific fields
  const renderTeacherFields = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Teacher Information</h2>

      <div>
        <label className="block text-sm font-medium mb-2">
          Specialization *
        </label>
        <input
          type="text"
          value={formData.specialization}
          onChange={(e) => setFormData({
            ...formData,
            specialization: e.target.value
          })}
          className="w-full p-2 border rounded"
          placeholder="e.g., Mathematics, Physics, English"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Years of Experience *
        </label>
        <input
          type="number"
          value={formData.yearsOfExperience}
          onChange={(e) => setFormData({
            ...formData,
            yearsOfExperience: e.target.value
          })}
          className="w-full p-2 border rounded"
          min="0"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Upload CV * (PDF or DOC, max 5MB)
        </label>
        <input
          type="file"
          onChange={(e) => setFormData({
            ...formData,
            cv: e.target.files[0]
          })}
          className="w-full p-2 border rounded"
          accept=".pdf,.doc,.docx"
          required
        />
      </div>

      {/* Didit Verification */}
      <div className="bg-blue-50 p-4 rounded border border-blue-200">
        <h3 className="font-bold mb-2">Identity Verification Required</h3>
        <p className="text-sm text-gray-700 mb-4">
          Teachers must complete identity verification via Didit
        </p>
        <button
          type="button"
          onClick={initiateDiditVerification}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Start Verification
        </button>

        {formData.diditStatus === 'Approved' && (
          <div className="mt-4 p-3 bg-green-100 text-green-800 rounded">
            ✅ Verification Completed
          </div>
        )}
      </div>

      {renderSubmitButton()}
    </div>
  )

  // Parent-specific fields
  const renderParentFields = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Parent Information</h2>

      <div>
        <label className="block text-sm font-medium mb-2">
          Number of Children *
        </label>
        <input
          type="number"
          value={formData.childrenCount}
          onChange={(e) => setFormData({
            ...formData,
            childrenCount: e.target.value
          })}
          className="w-full p-2 border rounded"
          min="1"
          required
        />
      </div>

      {/* Didit Verification */}
      <div className="bg-blue-50 p-4 rounded border border-blue-200">
        <h3 className="font-bold mb-2">Identity Verification Required</h3>
        <p className="text-sm text-gray-700 mb-4">
          Parents must complete identity verification via Didit
        </p>
        <button
          type="button"
          onClick={initiateDiditVerification}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Start Verification
        </button>

        {formData.diditStatus === 'Approved' && (
          <div className="mt-4 p-3 bg-green-100 text-green-800 rounded">
            ✅ Verification Completed
          </div>
        )}
      </div>

      {renderSubmitButton()}
    </div>
  )

  // University Student-specific fields
  const renderUniversityStudentFields = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">University Information</h2>

      <div>
        <label className="block text-sm font-medium mb-2">
          Faculty *
        </label>
        <input
          type="text"
          value={formData.faculty}
          onChange={(e) => setFormData({
            ...formData,
            faculty: e.target.value
          })}
          className="w-full p-2 border rounded"
          placeholder="e.g., Engineering, Medicine, Business"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Career Goal (Optional)
        </label>
        <textarea
          value={formData.goal}
          onChange={(e) => setFormData({
            ...formData,
            goal: e.target.value
          })}
          className="w-full p-2 border rounded"
          rows={3}
          placeholder="What are you looking for? (internship, full-time job, etc.)"
        />
      </div>

      {renderSubmitButton()}
    </div>
  )

  // Company-specific fields
  const renderCompanyFields = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Company Information</h2>

      <div>
        <label className="block text-sm font-medium mb-2">
          Company Name *
        </label>
        <input
          type="text"
          value={formData.companyName}
          onChange={(e) => setFormData({
            ...formData,
            companyName: e.target.value
          })}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Industry *
        </label>
        <select
          value={formData.industry}
          onChange={(e) => setFormData({
            ...formData,
            industry: e.target.value
          })}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Industry</option>
          <option value="Technology">Technology</option>
          <option value="Finance">Finance</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Education">Education</option>
          <option value="Manufacturing">Manufacturing</option>
          <option value="Retail">Retail</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Company Size *
        </label>
        <select
          value={formData.companySize}
          onChange={(e) => setFormData({
            ...formData,
            companySize: e.target.value
          })}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Size</option>
          <option value="1-10">1-10 employees</option>
          <option value="11-50">11-50 employees</option>
          <option value="51-200">51-200 employees</option>
          <option value="201-500">201-500 employees</option>
          <option value="501+">501+ employees</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Location *
        </label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => setFormData({
            ...formData,
            location: e.target.value
          })}
          className="w-full p-2 border rounded"
          placeholder="City, Country"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Website (Optional)
        </label>
        <input
          type="url"
          value={formData.website}
          onChange={(e) => setFormData({
            ...formData,
            website: e.target.value
          })}
          className="w-full p-2 border rounded"
          placeholder="https://example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Company Registration Number (Optional)
        </label>
        <input
          type="text"
          value={formData.registrationNumber}
          onChange={(e) => setFormData({
            ...formData,
            registrationNumber: e.target.value
          })}
          className="w-full p-2 border rounded"
        />
      </div>

      {renderSubmitButton()}
    </div>
  )

  const renderSubmitButton = () => (
    <div className="flex gap-4 mt-6">
      <button
        onClick={() => setStep(2)}
        className="px-6 py-2 border rounded hover:bg-gray-100"
      >
        Back
      </button>
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Creating Account...' : 'Create Account'}
      </button>
    </div>
  )

  // Didit verification integration
  const initiateDiditVerification = async () => {
    try {
      // Call backend to create Didit session
      const response = await axios.post(
        'http://localhost:8000/api/didit/create-session'
      )

      const { sessionId, sessionUrl } = response.data

      // Open Didit verification in popup
      const popup = window.open(sessionUrl, 'didit', 'width=600,height=800')

      // Poll for verification status
      const checkInterval = setInterval(async () => {
        const statusRes = await axios.get(
          `http://localhost:8000/api/didit/session-status/${sessionId}`
        )

        if (statusRes.data.status === 'Approved') {
          setFormData({
            ...formData,
            diditSessionId: sessionId,
            diditSessionNumber: statusRes.data.sessionNumber,
            diditStatus: 'Approved'
          })

          clearInterval(checkInterval)
          popup?.close()
        }
      }, 3000)

    } catch (error) {
      alert('Failed to start verification')
    }
  }

  // Submit registration
  const handleSubmit = async () => {
    setLoading(true)
    setErrors({})

    try {
      const submitData = new FormData()

      // Add all form data
      Object.keys(formData).forEach(key => {
        if (formData[key] !== '' && formData[key] !== null) {
          submitData.append(key, formData[key])
        }
      })

      submitData.append('userType', userType)

      const response = await axios.post(
        'http://localhost:8000/api/auth/register',
        submitData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      )

      const { token, user } = response.data

      // Store auth data
      localStorage.setItem('authToken', token)
      localStorage.setItem('user', JSON.stringify(user))

      // Check if user needs approval
      if (!user.is_approved) {
        router.push('/waiting-approval')
      } else {
        // Redirect to dashboard
        const dashboardMap = {
          student: '/student/dashboard',
          teacher: '/teacher/dashboard',
          parent: '/parent/profile',
          university_student: '/university_student/dashboard',
          company: '/company/dashboard'
        }
        router.push(dashboardMap[userType])
      }

    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors)
      } else {
        setErrors({ general: 'Registration failed. Please try again.' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-center mb-8">
            Create Your ACE Account
          </h1>

          {/* Progress Indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center">
              <StepIndicator step={1} currentStep={step} label="User Type" />
              <div className="w-12 h-1 bg-gray-300" />
              <StepIndicator step={2} currentStep={step} label="Basic Info" />
              <div className="w-12 h-1 bg-gray-300" />
              <StepIndicator step={3} currentStep={step} label="Details" />
            </div>
          </div>

          {/* Error Display */}
          {errors.general && (
            <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
              {errors.general}
            </div>
          )}

          {/* Step Content */}
          {step === 1 && renderUserTypeSelection()}
          {step === 2 && renderBasicInfo()}
          {step === 3 && renderTypeSpecificInfo()}

          {/* Login Link */}
          <div className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:underline">
              Log in
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

## Part 2: Parent Portal

### Parent Profile (`/parent/profile`)
**File:** `/home/user/ACE/frontend/app/parent/profile/page.tsx`

### What Parents Can Do
1. **Search for Students** - Find children by email or name
2. **Send Follow Requests** - Request to monitor a student
3. **View Followed Students** - See all children they're monitoring
4. **Track Progress** - View courses, grades, activity

### Parent Dashboard

```tsx
export default function ParentProfile() {
  const [followedStudents, setFollowedStudents] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])

  const handleSearchStudent = async () => {
    const token = localStorage.getItem('authToken')

    try {
      const response = await axios.post(
        'http://localhost:8000/api/parent/search-student',
        { query: searchQuery },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setSearchResults(response.data.students)
    } catch (error) {
      alert('Search failed')
    }
  }

  const handleSendFollowRequest = async (studentId) => {
    const token = localStorage.getItem('authToken')

    try {
      await axios.post(
        'http://localhost:8000/api/parent/follow-request',
        { student_id: studentId },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      alert('Follow request sent! Waiting for student approval.')
    } catch (error) {
      alert('Failed to send request')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Parent Dashboard</h1>

      {/* Search Students */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-2xl font-bold mb-4">Add Student to Monitor</h2>

        <div className="flex gap-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 p-2 border rounded"
            placeholder="Enter student email or name..."
          />
          <button
            onClick={handleSearchStudent}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Search
          </button>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mt-4">
            <h3 className="font-bold mb-2">Search Results</h3>
            {searchResults.map(student => (
              <div
                key={student.id}
                className="flex items-center justify-between p-3 border-b"
              >
                <div>
                  <p className="font-medium">
                    {student.first_name} {student.last_name}
                  </p>
                  <p className="text-sm text-gray-600">{student.email}</p>
                </div>
                <button
                  onClick={() => handleSendFollowRequest(student.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Send Request
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Followed Students */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">
          My Children ({followedStudents.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {followedStudents.map(student => (
            <StudentCard
              key={student.id}
              student={student}
              onViewDetails={() => router.push(`/parent/student/${student.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
```

### Student Detail View (`/parent/student/[id]`)

```tsx
export default function StudentDetails({ params }) {
  const studentId = params.id
  const [student, setStudent] = useState(null)
  const [courses, setCourses] = useState([])
  const [stats, setStats] = useState({
    coursesEnrolled: 0,
    coursesCompleted: 0,
    averageProgress: 0
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {student?.first_name}'s Progress
      </h1>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Enrolled Courses"
          value={stats.coursesEnrolled}
        />
        <StatCard
          title="Completed Courses"
          value={stats.coursesCompleted}
        />
        <StatCard
          title="Average Progress"
          value={`${stats.averageProgress}%`}
        />
      </div>

      {/* Enrolled Courses */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Current Courses</h2>

        {courses.map(course => (
          <div key={course.id} className="border-b py-4">
            <h3 className="font-bold">{course.title}</h3>
            <div className="mt-2">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{course.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded h-2">
                <div
                  className="bg-blue-600 h-2 rounded"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

## Part 3: Company Portal

### Company Dashboard (`/company/dashboard`)
**File:** `/home/user/ACE/frontend/app/company/dashboard/page.tsx`

### What Companies Can Do
1. **Post Jobs** - Create job openings
2. **Manage Jobs** - Edit, delete, activate/deactivate
3. **View Applications** - Review candidate applications
4. **Download CVs** - Access candidate resumes
5. **Track Applications** - Update application status

### Dashboard Overview

```tsx
export default function CompanyDashboard() {
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    pendingApplications: 0
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Company Dashboard</h1>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Jobs" value={stats.totalJobs} />
        <StatCard title="Active Jobs" value={stats.activeJobs} />
        <StatCard title="Total Applications" value={stats.totalApplications} />
        <StatCard title="Pending Review" value={stats.pendingApplications} />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <button
          onClick={() => router.push('/company/jobs/new')}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          + Post New Job
        </button>
      </div>

      {/* Recent Applications */}
      <RecentApplicationsList />
    </div>
  )
}
```

### Post Job (`/company/jobs/new`)
**File:** `/home/user/ACE/frontend/app/company/jobs/new/page.tsx`

```tsx
export default function PostJob() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    jobType: 'full-time',
    workLocation: 'onsite',
    location: '',
    salaryRange: '',
    experienceLevel: 'entry',
    positionsAvailable: 1,
    applicationDeadline: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    const token = localStorage.getItem('authToken')

    try {
      const response = await axios.post(
        'http://localhost:8000/api/company/jobs',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      router.push(`/company/jobs/${response.data.job.id}`)
    } catch (error) {
      alert('Failed to post job')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Post New Job</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-2">Job Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-2 border rounded"
              rows={6}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-2">Job Type *</label>
              <select
                value={formData.jobType}
                onChange={(e) => setFormData({...formData, jobType: e.target.value})}
                className="w-full p-2 border rounded"
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="internship">Internship</option>
                <option value="contract">Contract</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-2">Work Location *</label>
              <select
                value={formData.workLocation}
                onChange={(e) => setFormData({...formData, workLocation: e.target.value})}
                className="w-full p-2 border rounded"
              >
                <option value="remote">Remote</option>
                <option value="onsite">Onsite</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium mb-2">Location *</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className="w-full p-2 border rounded"
              placeholder="City, Country"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Salary Range</label>
            <input
              type="text"
              value={formData.salaryRange}
              onChange={(e) => setFormData({...formData, salaryRange: e.target.value})}
              className="w-full p-2 border rounded"
              placeholder="e.g., $50,000 - $70,000"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-2">Experience Level *</label>
              <select
                value={formData.experienceLevel}
                onChange={(e) => setFormData({...formData, experienceLevel: e.target.value})}
                className="w-full p-2 border rounded"
              >
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-2">Positions Available *</label>
              <input
                type="number"
                value={formData.positionsAvailable}
                onChange={(e) => setFormData({...formData, positionsAvailable: e.target.value})}
                className="w-full p-2 border rounded"
                min="1"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-2">Application Deadline</label>
            <input
              type="date"
              value={formData.applicationDeadline}
              onChange={(e) => setFormData({...formData, applicationDeadline: e.target.value})}
              className="w-full p-2 border rounded"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
          >
            Post Job
          </button>
        </div>
      </form>
    </div>
  )
}
```

### View Applications (`/company/applications`)
**File:** `/home/user/ACE/frontend/app/company/applications/page.tsx`

```tsx
export default function ViewApplications() {
  const [applications, setApplications] = useState([])
  const [filter, setFilter] = useState('all') // all, applied, interview, accepted, rejected

  const handleUpdateStatus = async (applicationId, newStatus) => {
    const token = localStorage.getItem('authToken')

    try {
      await axios.put(
        `http://localhost:8000/api/company/applications/${applicationId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      // Refresh applications
      fetchApplications()
    } catch (error) {
      alert('Failed to update status')
    }
  }

  const handleDownloadCV = async (studentId) => {
    const token = localStorage.getItem('authToken')

    try {
      const response = await axios.get(
        `http://localhost:8000/api/company/students/${studentId}/cv`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      )

      // Download file
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `CV_${studentId}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      alert('Failed to download CV')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Job Applications</h1>

      {/* Filter */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'btn-active' : 'btn'}
        >
          All
        </button>
        <button
          onClick={() => setFilter('applied')}
          className={filter === 'applied' ? 'btn-active' : 'btn'}
        >
          New Applications
        </button>
        <button
          onClick={() => setFilter('interview')}
          className={filter === 'interview' ? 'btn-active' : 'btn'}
        >
          Interview
        </button>
        <button
          onClick={() => setFilter('accepted')}
          className={filter === 'accepted' ? 'btn-active' : 'btn'}
        >
          Accepted
        </button>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded shadow">
        {applications.map(app => (
          <div key={app.id} className="border-b p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold">
                  {app.student.first_name} {app.student.last_name}
                </h3>
                <p className="text-gray-600">{app.student.email}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Applied for: <strong>{app.job.title}</strong>
                </p>
                <p className="text-sm text-gray-500">
                  Applied on: {new Date(app.application_date).toLocaleDateString()}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleDownloadCV(app.student.id)}
                  className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                >
                  Download CV
                </button>

                <select
                  value={app.status}
                  onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                  className="p-2 border rounded"
                >
                  <option value="applied">Applied</option>
                  <option value="interview">Schedule Interview</option>
                  <option value="accepted">Accept</option>
                  <option value="rejected">Reject</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

## Testing Questions

### Signup System
**1. What user types can register?**
- Student, Teacher, Parent, University Student, Company

**2. What's different about teacher signup?**
- Requires CV upload
- Requires Didit verification
- Account pending approval

**3. What's special about university student email?**
- Must be Egyptian university domain (.edu.eg)

**4. What information do companies provide?**
- Company name, industry, size, location
- Optional: website, registration number

### Parent Portal
**5. How do parents add students?**
- Search by email/name
- Send follow request
- Student must approve

**6. What can parents see?**
- Student's enrolled courses
- Course progress
- Completion status

### Company Portal
**7. What job types can companies post?**
- Full-time, part-time, internship, contract

**8. What application statuses exist?**
- Applied, Interview, Accepted, Rejected

**9. Can companies download CVs?**
- Yes, via download button on application

**10. What work locations are supported?**
- Remote, Onsite, Hybrid

---

## Your Impact

✅ **Signup:** Onboarding for all 5 user types
✅ **Parent Portal:** Child monitoring system
✅ **Company Portal:** Complete recruitment platform
✅ **Identity Verification:** Didit integration
✅ **Multi-step Forms:** Complex validation logic

You built the entry point and key user portals! 🌟

---

## Technical Deep Dive

### 1. Multi-Step Form Architecture

**Wizard Pattern Implementation:**
```tsx
const [step, setStep] = useState(1) // Current step (1, 2, or 3)
const [userType, setUserType] = useState('') // Selected user type
const [formData, setFormData] = useState({}) // All form data

// Step progression
const nextStep = () => setStep(prev => prev + 1)
const prevStep = () => setStep(prev => prev - 1)

// Conditional rendering based on step
{step === 1 && <UserTypeSelection />}
{step === 2 && <BasicInformation />}
{step === 3 && <TypeSpecificFields />}
```

**State Management Strategy:**
- Single state object holds ALL form data
- Step counter tracks progress
- User type determines which fields to show in step 3
- Data persists across steps (doesn't reset)

---

### 2. Conditional Validation

**Dynamic Validation Rules:**
```tsx
const getValidationRules = (userType) => {
  const baseRules = {
    email: 'required|email|unique:users',
    password: 'required|min:8|confirmed|regex:/^(?=.*[A-Z])(?=.*[0-9])/',
    phone: 'required|regex:/^\+20[0-9]{10}$/'
  }

  const typeSpecificRules = {
    student: {
      grade: 'required|string',
      birthDate: 'required|date|before:-6 years|after:-25 years'
    },
    teacher: {
      specialization: 'required|string',
      yearsOfExperience: 'required|integer|min:0',
      cv: 'required|file|mimes:pdf,doc,docx|max:5120',
      diditStatus: 'required|in:Approved'
    },
    university_student: {
      email: 'required|regex:/@(cu|aus|alexu|helwan|...)\.edu\.eg$/',
      faculty: 'required|string'
    },
    parent: {
      childrenCount: 'required|integer|min:1',
      diditStatus: 'required|in:Approved'
    },
    company: {
      companyName: 'required|string',
      industry: 'required|string',
      companySize: 'required|string',
      location: 'required|string'
    }
  }

  return { ...baseRules, ...(typeSpecificRules[userType] || {}) }
}
```

**Frontend Validation:**
```tsx
const validateCurrentStep = () => {
  const errors = {}

  if (step === 2) {
    // Basic info validation
    if (!formData.email?.includes('@')) {
      errors.email = 'Invalid email format'
    }
    if (formData.password !== formData.password_confirmation) {
      errors.password_confirmation = 'Passwords do not match'
    }
    if (!formData.phone?.match(/^\+20[0-9]{10}$/)) {
      errors.phone = 'Phone must be +20 followed by 10 digits'
    }
  }

  if (step === 3) {
    // Type-specific validation
    if (userType === 'student' && !formData.grade) {
      errors.grade = 'Grade is required'
    }
    if (userType === 'teacher' && !formData.cv) {
      errors.cv = 'CV is required'
    }
  }

  setErrors(errors)
  return Object.keys(errors).length === 0
}

const handleNext = () => {
  if (validateCurrentStep()) {
    nextStep()
  }
}
```

---

### 3. Third-Party API Integration (Didit)

**Didit Verification Flow:**
```
User clicks "Start Verification"
    ↓
Frontend: POST /api/didit/create-session
    ↓
Backend: Creates session with Didit API
    ↓
Backend: Returns sessionId and sessionUrl
    ↓
Frontend: Opens Didit popup (600x800)
    ↓
User completes verification on Didit
    ↓
Frontend: Polls /api/didit/session-status/{sessionId} every 3 seconds
    ↓
Didit webhook → Backend (status update)
    ↓
Frontend poll receives status="Approved"
    ↓
Frontend: Stores sessionId, sessionNumber, status
    ↓
Frontend: Closes popup, shows ✅ Verified
```

**Implementation:**
```tsx
const initiateDiditVerification = async () => {
  try {
    // 1. Create Didit session
    const { data } = await axios.post('/api/didit/create-session')
    const { sessionId, sessionUrl } = data

    // 2. Open verification popup
    const popup = window.open(
      sessionUrl,
      'didit-verification',
      'width=600,height=800,scrollbars=yes'
    )

    // 3. Poll for status
    const pollInterval = setInterval(async () => {
      try {
        const statusRes = await axios.get(
          `/api/didit/session-status/${sessionId}`
        )

        if (statusRes.data.status === 'Approved') {
          // Verification successful
          setFormData(prev => ({
            ...prev,
            diditSessionId: sessionId,
            diditSessionNumber: statusRes.data.sessionNumber,
            diditStatus: 'Approved'
          }))

          clearInterval(pollInterval)
          popup?.close()
          alert('Verification successful!')
        }

        if (statusRes.data.status === 'Rejected') {
          clearInterval(pollInterval)
          popup?.close()
          alert('Verification failed. Please try again.')
        }

      } catch (error) {
        console.error('Poll error:', error)
      }
    }, 3000) // Poll every 3 seconds

    // 4. Cleanup on popup close
    const checkPopup = setInterval(() => {
      if (popup?.closed) {
        clearInterval(pollInterval)
        clearInterval(checkPopup)
      }
    }, 1000)

  } catch (error) {
    alert('Failed to start verification')
  }
}
```

**Backend Webhook Handler:**
```php
public function handleDiditWebhook(Request $request)
{
    $sessionId = $request->input('sessionId');
    $status = $request->input('status');
    $personalInfo = $request->input('personalInfo');

    // Update verification record
    DiditVerification::where('session_id', $sessionId)->update([
        'status' => $status,
        'personal_info' => $personalInfo,
        'metadata' => $request->all()
    ]);

    // If approved, mark user as approved
    if ($status === 'Approved') {
        $verification = DiditVerification::where('session_id', $sessionId)->first();
        User::where('id', $verification->user_id)->update(['is_approved' => true]);
    }

    return response()->json(['success' => true]);
}
```

---

### 4. Parent Follow System

**Search Implementation:**
```tsx
const handleSearchStudent = async () => {
  setLoading(true)
  try {
    const { data } = await axios.post(
      '/api/parent/search-student',
      { query: searchQuery },
      { headers: { Authorization: `Bearer ${token}` } }
    )

    setSearchResults(data.students)
  } catch (error) {
    alert('Search failed')
  } finally {
    setLoading(false)
  }
}
```

**Backend Search Logic:**
```php
public function searchStudent(Request $request)
{
    $query = $request->input('query');

    $students = User::where('user_type', 'student')
        ->where(function($q) use ($query) {
            $q->where('email', 'LIKE', "%{$query}%")
              ->orWhereRaw("CONCAT(first_name, ' ', last_name) LIKE ?", ["%{$query}%"]);
        })
        ->with('studentProfile')
        ->limit(10)
        ->get();

    return response()->json(['students' => $students]);
}
```

**Follow Request:**
```tsx
const handleSendFollowRequest = async (studentId) => {
  try {
    await axios.post(
      '/api/parent/follow-request',
      { student_id: studentId },
      { headers: { Authorization: `Bearer ${token}` } }
    )

    alert('Follow request sent! Waiting for student approval.')
    setSearchResults([]) // Clear search
  } catch (error) {
    if (error.response?.status === 400) {
      alert('Already sent follow request')
    } else {
      alert('Failed to send request')
    }
  }
}
```

**Backend:**
```php
public function sendFollowRequest(Request $request)
{
    $parentId = auth()->id();
    $studentId = $request->input('student_id');

    // Check if already following or request pending
    $existing = ParentStudentFollowRequest::where('parent_id', $parentId)
        ->where('student_id', $studentId)
        ->whereIn('status', ['pending', 'approved'])
        ->first();

    if ($existing) {
        return response()->json(['message' => 'Request already sent'], 400);
    }

    // Create follow request
    ParentStudentFollowRequest::create([
        'parent_id' => $parentId,
        'student_id' => $studentId,
        'status' => 'pending'
    ]);

    // Notify student
    $student = User::find($studentId);
    $student->notify(new FollowRequestNotification(auth()->user()));

    return response()->json(['success' => true]);
}
```

**Student Approval:**
```tsx
const handleApproveRequest = async (requestId) => {
  try {
    await axios.post(
      `/api/follow-request/${requestId}`,
      { action: 'approve' },
      { headers: { Authorization: `Bearer ${token}` } }
    )

    alert('Parent can now view your progress')
    fetchFollowRequests()
  } catch (error) {
    alert('Failed to approve')
  }
}
```

---

### 5. Company Job Posting

**Form State:**
```tsx
interface JobFormData {
  title: string
  description: string
  jobType: 'full-time' | 'part-time' | 'internship' | 'contract'
  workLocation: 'remote' | 'onsite' | 'hybrid'
  location: string
  salaryRange?: string
  experienceLevel: 'entry' | 'mid' | 'senior'
  positionsAvailable: number
  applicationDeadline?: string
}

const [formData, setFormData] = useState<JobFormData>({
  title: '',
  description: '',
  jobType: 'full-time',
  workLocation: 'onsite',
  location: '',
  experienceLevel: 'entry',
  positionsAvailable: 1
})
```

**Rich Text Editor (Description):**
```tsx
import dynamic from 'next/dynamic'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

<ReactQuill
  value={formData.description}
  onChange={(value) => setFormData({...formData, description: value})}
  modules={{
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link']
    ]
  }}
/>
```

**Submission:**
```tsx
const handleSubmit = async (e) => {
  e.preventDefault()

  // Validation
  if (!formData.title || !formData.description) {
    alert('Please fill required fields')
    return
  }

  try {
    const { data } = await axios.post(
      '/api/company/jobs',
      formData,
      { headers: { Authorization: `Bearer ${token}` } }
    )

    router.push(`/company/jobs/${data.job.id}`)
  } catch (error) {
    alert('Failed to post job')
  }
}
```

---

### 6. Application Management

**Application Statuses:**
```
applied → interview → accepted
              ↓
           rejected
```

**Update Status:**
```tsx
const handleUpdateStatus = async (applicationId, newStatus) => {
  try {
    await axios.put(
      `/api/company/applications/${applicationId}/status`,
      { status: newStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    )

    // Optimistic update
    setApplications(prev =>
      prev.map(app =>
        app.id === applicationId
          ? { ...app, status: newStatus }
          : app
      )
    )

    // Notify candidate
    if (newStatus === 'interview') {
      alert('Candidate notified about interview')
    }

  } catch (error) {
    alert('Failed to update status')
    fetchApplications() // Revert on error
  }
}
```

**Filter Applications:**
```tsx
const [filter, setFilter] = useState('all')

const filteredApplications = useMemo(() => {
  if (filter === 'all') return applications

  return applications.filter(app => app.status === filter)
}, [applications, filter])

// UI
<select value={filter} onChange={e => setFilter(e.target.value)}>
  <option value="all">All</option>
  <option value="applied">New</option>
  <option value="interview">Interview</option>
  <option value="accepted">Accepted</option>
  <option value="rejected">Rejected</option>
</select>
```

**Download CV:**
```tsx
const handleDownloadCV = async (studentId) => {
  try {
    const response = await axios.get(
      `/api/company/students/${studentId}/cv`,
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob' // Important for file download
      }
    )

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `CV_${studentId}.pdf`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)

  } catch (error) {
    alert('Failed to download CV')
  }
}
```

---

### 7. Complex Form Patterns

**Dependent Fields:**
```tsx
// Show salary range only for full-time jobs
{formData.jobType === 'full-time' && (
  <input
    type="text"
    placeholder="Salary Range"
    value={formData.salaryRange || ''}
    onChange={e => setFormData({...formData, salaryRange: e.target.value})}
  />
)}

// Deadline must be in future
<input
  type="date"
  min={new Date().toISOString().split('T')[0]} // Today
  value={formData.applicationDeadline || ''}
  onChange={e => setFormData({...formData, applicationDeadline: e.target.value})}
/>
```

**Field Array (Multiple Children for Parent):**
```tsx
const [children, setChildren] = useState([{ name: '', age: '' }])

const addChild = () => {
  setChildren([...children, { name: '', age: '' }])
}

const removeChild = (index) => {
  setChildren(children.filter((_, i) => i !== index))
}

const updateChild = (index, field, value) => {
  const updated = children.map((child, i) =>
    i === index ? { ...child, [field]: value } : child
  )
  setChildren(updated)
}

// Render
{children.map((child, index) => (
  <div key={index}>
    <input
      value={child.name}
      onChange={e => updateChild(index, 'name', e.target.value)}
      placeholder="Child Name"
    />
    <input
      type="number"
      value={child.age}
      onChange={e => updateChild(index, 'age', e.target.value)}
      placeholder="Age"
    />
    <button onClick={() => removeChild(index)}>Remove</button>
  </div>
))}

<button onClick={addChild}>+ Add Child</button>
```

---

## Technical Interview Questions (60+ Questions)

### Multi-Step Forms (15 questions)

**1. How do you implement a multi-step form?**
- Use step counter state
- Conditional rendering based on step
- Single state object for all data
- Navigation buttons (Next/Back)

**2. How do you preserve form data between steps?**
- Store all data in single state object
- Data persists across steps
- Don't reset state when changing steps

**3. How do you validate each step?**
- Create step-specific validation functions
- Validate before allowing next step
- Show errors for current step only

**4. Should you POST data after each step?**
- No, collect all data first
- Submit once at the end
- Saves API calls and improves UX

**5. How do you handle "Back" button?**
```tsx
const prevStep = () => {
  setStep(prev => Math.max(1, prev - 1))
  // Keep existing data intact
}
```

**6. How do you show progress indicator?**
```tsx
<div className="flex justify-between mb-8">
  {[1, 2, 3].map(num => (
    <div
      key={num}
      className={`w-8 h-8 rounded-full ${
        step >= num ? 'bg-blue-600' : 'bg-gray-300'
      }`}
    >
      {num}
    </div>
  ))}
</div>
```

**7. How do you handle conditional fields?**
```tsx
{userType === 'teacher' && (
  <input name="specialization" required />
)}
```

**8. What is the wizard pattern?**
- UI pattern for multi-step processes
- One step visible at a time
- Clear progress indication
- Easy navigation

**9. How do you prevent skipping steps?**
- Disable "Next" until validation passes
- Don't show step numbers as links
- Programmatic navigation only

**10. How do you handle form submission?**
```tsx
const handleSubmit = async () => {
  const formData = new FormData()
  Object.keys(data).forEach(key => {
    formData.append(key, data[key])
  })
  await axios.post('/api/register', formData)
}
```

**11. Should you save draft progress?**
- Optional: Save to localStorage
- Auto-save every N seconds
- Restore on page load
```tsx
useEffect(() => {
  localStorage.setItem('signupDraft', JSON.stringify(formData))
}, [formData])
```

**12. How do you handle errors from backend?**
```tsx
catch (error) {
  if (error.response?.status === 422) {
    // Validation errors
    const errors = error.response.data.errors
    setErrors(errors)
    
    // Go back to step with error
    if (errors.email) setStep(2)
    if (errors.grade) setStep(3)
  }
}
```

**13. What is optimistic UI update?**
- Update UI before API responds
- Makes app feel faster
- Revert if API fails

**14. How do you test multi-step forms?**
- Test each step individually
- Test navigation (Next/Back)
- Test validation
- Test submission
- Test error handling

**15. What accessibility considerations?**
- ARIA labels for progress
- Keyboard navigation
- Focus management
- Screen reader announcements
```tsx
<div role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={3}>
```

---

### Validation (15 questions)

**16. What is client-side validation?**
- Validation in browser before submission
- Improves UX (immediate feedback)
- Not secure (can be bypassed)

**17. What is server-side validation?**
- Validation on backend
- Secure (can't be bypassed)
- Required for security

**18. Should you do both?**
- Yes! Client for UX, server for security

**19. How do you validate email format?**
```tsx
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
```

**20. How do you validate Egyptian phone numbers?**
```tsx
const isValidPhone = (phone) => {
  return /^\+20[0-9]{10}$/.test(phone)
}
// Must be: +20 followed by exactly 10 digits
```

**21. How do you validate university emails?**
```tsx
const validDomains = [
  'cu.edu.eg', 'aus.edu.eg', 'alexu.edu.eg',
  'helwan.edu.eg', 'mans.edu.eg'
]

const isUniversityEmail = (email) => {
  return validDomains.some(domain => email.endsWith('@' + domain))
}
```

**22. How do you validate password strength?**
```tsx
const validatePassword = (password) => {
  const minLength = password.length >= 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  
  return minLength && hasUppercase && hasNumber
}
```

**23. How do you validate password confirmation?**
```tsx
if (formData.password !== formData.password_confirmation) {
  errors.password_confirmation = 'Passwords do not match'
}
```

**24. How do you validate file uploads?**
```tsx
const validateFile = (file) => {
  // Size check (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return 'File too large (max 5MB)'
  }
  
  // Type check
  const allowedTypes = ['application/pdf', 'application/msword']
  if (!allowedTypes.includes(file.type)) {
    return 'Invalid file type (PDF or DOC only)'
  }
  
  return null
}
```

**25. How do you show validation errors?**
```tsx
{errors.email && (
  <p className="text-red-600 text-sm mt-1">{errors.email}</p>
)}

// Or
<input
  className={errors.email ? 'border-red-500' : 'border-gray-300'}
/>
```

**26. When should validation run?**
- onChange: Real-time feedback
- onBlur: When field loses focus
- onSubmit: Before submission
- Combination based on UX needs

**27. What is debounced validation?**
```tsx
const debouncedValidate = useCallback(
  debounce((value) => {
    if (!isValidEmail(value)) {
      setErrors({email: 'Invalid email'})
    }
  }, 500),
  []
)

<input onChange={e => debouncedValidate(e.target.value)} />
```
- Delays validation until user stops typing
- Prevents validation on every keystroke

**28. How do you validate date ranges?**
```tsx
// Student must be 6-25 years old
const minDate = new Date()
minDate.setFullYear(minDate.getFullYear() - 25)

const maxDate = new Date()
maxDate.setFullYear(maxDate.getFullYear() - 6)

<input
  type="date"
  min={minDate.toISOString().split('T')[0]}
  max={maxDate.toISOString().split('T')[0]}
/>
```

**29. What are HTML5 validation attributes?**
- required, min, max, minLength, maxLength
- pattern (regex), type (email, url, tel)
- Browser provides basic validation

**30. Should you rely on HTML5 validation?**
- No, add JavaScript validation too
- HTML5 can be disabled
- JS provides better UX and error messages

---

### Third-Party APIs (10 questions)

**31. What is an API webhook?**
- URL that receives POST requests from external service
- Used for real-time updates
- Didit sends status updates via webhook

**32. How do you secure webhooks?**
- Verify signature/secret key
- Check source IP
- Validate payload structure
```php
if ($request->header('X-Webhook-Secret') !== config('didit.secret')) {
    return response()->json(['error' => 'Unauthorized'], 401);
}
```

**33. What is polling?**
- Repeatedly checking for updates
- Alternative to webhooks
- Less efficient but simpler

**34. How often should you poll?**
- Balance freshness vs server load
- 3-5 seconds for active processes
- 30-60 seconds for background updates

**35. How do you stop polling?**
```tsx
useEffect(() => {
  const interval = setInterval(() => {
    checkStatus()
  }, 3000)
  
  return () => clearInterval(interval) // Cleanup
}, [])
```

**36. What is exponential backoff?**
```tsx
let retryDelay = 1000
const retry = async () => {
  try {
    await apiCall()
  } catch (error) {
    setTimeout(retry, retryDelay)
    retryDelay *= 2 // 1s, 2s, 4s, 8s...
  }
}
```

**37. How do you handle API rate limits?**
- Respect Retry-After header
- Implement exponential backoff
- Cache responses when possible

**38. What is CORS?**
- Cross-Origin Resource Sharing
- Security feature in browsers
- Backend must allow frontend origin

**39. How do you call third-party APIs from backend?**
```php
$response = Http::withHeaders([
    'Authorization' => 'Bearer ' . config('didit.api_key'),
])->post('https://api.didit.io/sessions', [
    'userId' => $user->id,
]);

return $response->json();
```

**40. What is an API key vs OAuth?**
- API Key: Simple, single string for auth
- OAuth: Complex, token-based, more secure

---

### State Management (10 questions)

**41. How do you manage complex form state?**
```tsx
const [formData, setFormData] = useState({
  // All fields in one object
  email: '',
  password: '',
  grade: '',
  // ...
})

// Generic update handler
const handleChange = (e) => {
  const { name, value } = e.target
  setFormData(prev => ({ ...prev, [name]: value }))
}
```

**42. What is the spread operator?**
```tsx
{...formData, email: newValue}
// Copies all fields from formData
// Then overrides email with newValue
```

**43. How do you handle nested state?**
```tsx
setUser(prev => ({
  ...prev,
  profile: {
    ...prev.profile,
    name: 'New Name'
  }
}))
```

**44. What is computed state?**
```tsx
const isValid = formData.email && formData.password
// Derived from other state
// Don't need separate useState
```

**45. When to split state?**
- Split if independently updated
- Combine if always updated together

**46. What is state initialization?**
```tsx
// Simple
const [count, setCount] = useState(0)

// From props
const [value, setValue] = useState(props.initialValue)

// From localStorage
const [theme, setTheme] = useState(() => {
  return localStorage.getItem('theme') || 'light'
})
```

**47. What is lazy initialization?**
```tsx
const [state, setState] = useState(() => {
  // Expensive calculation
  return heavyComputation()
})
// Function only runs once on mount
```

**48. How do you reset form state?**
```tsx
const initialState = {
  email: '',
  password: ''
}

const [formData, setFormData] = useState(initialState)

const resetForm = () => setFormData(initialState)
```

**49. What is controlled vs uncontrolled?**
- Controlled: React state controls value
- Uncontrolled: DOM controls value (refs)

**50. When to use refs?**
- File inputs (uncontrolled by nature)
- Focus management
- DOM measurements
- Third-party libraries

---

### Company Features (10 questions)

**51. How do you implement job search?**
```tsx
const [filters, setFilters] = useState({
  jobType: '',
  location: '',
  experienceLevel: ''
})

const filteredJobs = jobs.filter(job => {
  if (filters.jobType && job.jobType !== filters.jobType) return false
  if (filters.location && !job.location.includes(filters.location)) return false
  return true
})
```

**52. How do you sort job listings?**
```tsx
const [sortBy, setSortBy] = useState('date')

const sortedJobs = [...jobs].sort((a, b) => {
  if (sortBy === 'date') {
    return new Date(b.created_at) - new Date(a.created_at)
  }
  if (sortBy === 'salary') {
    return b.salary - a.salary
  }
})
```

**53. How do you paginate results?**
```tsx
const [page, setPage] = useState(1)
const perPage = 10

const paginatedJobs = jobs.slice(
  (page - 1) * perPage,
  page * perPage
)

const totalPages = Math.ceil(jobs.length / perPage)
```

**54. How do you track application views?**
```php
// Backend
public function viewApplication($id) {
    $application = JobApplication::findOrFail($id);
    $application->increment('view_count');
    $application->update(['last_viewed_at' => now()]);
}
```

**55. How do you implement favorite/bookmark?**
```tsx
const [favorites, setFavorites] = useState([])

const toggleFavorite = async (applicationId) => {
  await axios.post(`/api/company/applications/${applicationId}/favorite`)
  
  setFavorites(prev =>
    prev.includes(applicationId)
      ? prev.filter(id => id !== applicationId)
      : [...prev, applicationId]
  )
}
```

**56. How do you send notifications to candidates?**
```php
public function updateApplicationStatus($id, $status) {
    $application = JobApplication::findOrFail($id);
    $application->update(['status' => $status]);
    
    // Notify candidate
    $student = $application->student;
    $student->notify(new ApplicationStatusChanged($application));
}
```

**57. How do you export applications to CSV?**
```tsx
const exportToCSV = () => {
  const csv = applications.map(app => ({
    Name: app.student.name,
    Email: app.student.email,
    Status: app.status,
    Date: app.application_date
  }))
  
  const csvString = Papa.unparse(csv)
  const blob = new Blob([csvString], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'applications.csv'
  link.click()
}
```

**58. How do you bulk update applications?**
```tsx
const [selected, setSelected] = useState([])

const bulkUpdateStatus = async (newStatus) => {
  await Promise.all(
    selected.map(id =>
      axios.put(`/api/company/applications/${id}/status`, { status: newStatus })
    )
  )
  
  fetchApplications()
  setSelected([])
}
```

**59. How do you implement search across applications?**
```tsx
const [searchTerm, setSearchTerm] = useState('')

const searchedApplications = applications.filter(app => {
  const searchStr = searchTerm.toLowerCase()
  return (
    app.student.name.toLowerCase().includes(searchStr) ||
    app.student.email.toLowerCase().includes(searchStr) ||
    app.job.title.toLowerCase().includes(searchStr)
  )
})
```

**60. What is an ATS (Applicant Tracking System)?**
- Software to manage recruitment
- Track applications through hiring pipeline
- Features: Search, filter, status updates
- We built a simple ATS for companies

