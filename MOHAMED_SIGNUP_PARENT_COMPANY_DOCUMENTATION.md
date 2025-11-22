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
