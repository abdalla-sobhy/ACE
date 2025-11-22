# Abdalla - University Student, Admin & Integration Documentation

## Overview
You worked on the most diverse set of features across the platform:
1. **University Student Portal** - Job search and application system
2. **Admin Portal** - Platform management and moderation
3. **Supporting Features** - Payment, notifications, video streaming
4. **Backend Integration** - Connecting all the pieces together

---

## Part 1: University Student Portal

### University Student Dashboard (`/university_student/dashboard`)
**File:** `/home/user/ACE/frontend/app/university_student/dashboard/page.tsx`

### What University Students Can Do
1. **Browse Jobs** - Explore job and internship opportunities
2. **Apply for Jobs** - Submit applications with CV
3. **Track Applications** - Monitor application status
4. **Manage Profile** - Update CV, skills, and portfolio
5. **Take Courses** - Enroll in courses (shares student functionality)

### Dashboard Overview

```tsx
export default function UniversityStudentDashboard() {
  const [profile, setProfile] = useState(null)
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [stats, setStats] = useState({
    profileViews: 0,
    applicationsSent: 0,
    interviewsScheduled: 0
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    const token = localStorage.getItem('authToken')

    // Fetch profile stats
    const statsRes = await axios.get(
      'http://localhost:8000/api/university/profile-stats',
      { headers: { Authorization: `Bearer ${token}` } }
    )
    setStats(statsRes.data)

    // Fetch recommended jobs
    const jobsRes = await axios.get(
      'http://localhost:8000/api/university/jobs',
      { headers: { Authorization: `Bearer ${token}` } }
    )
    setJobs(jobsRes.data.jobs)

    // Fetch my applications
    const appsRes = await axios.get(
      'http://localhost:8000/api/university/applications',
      { headers: { Authorization: `Bearer ${token}` } }
    )
    setApplications(appsRes.data.applications)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Profile Completion Alert */}
      {!profile?.cv_path && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded mb-6">
          <p className="font-bold">⚠️ Complete your profile</p>
          <p className="text-sm">Upload your CV to start applying for jobs</p>
          <button
            onClick={() => router.push('/university_student/profile')}
            className="mt-2 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
          >
            Complete Profile
          </button>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Profile Views"
          value={stats.profileViews}
          icon="👁️"
        />
        <StatCard
          title="Applications Sent"
          value={stats.applicationsSent}
          icon="📄"
        />
        <StatCard
          title="Interviews Scheduled"
          value={stats.interviewsScheduled}
          icon="🤝"
        />
      </div>

      {/* My Applications */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">My Applications</h2>
        <div className="bg-white rounded shadow">
          {applications.map(app => (
            <ApplicationCard
              key={app.id}
              application={app}
              onView={() => router.push(`/university_student/applications/${app.id}`)}
            />
          ))}
        </div>
      </section>

      {/* Recommended Jobs */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Recommended Jobs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {jobs.map(job => (
            <JobCard
              key={job.id}
              job={job}
              onApply={() => router.push(`/university_student/jobs/${job.id}`)}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
```

### Job Board (`/university_student/jobs`)
**File:** `/home/user/ACE/frontend/app/university_student/jobs/page.tsx`

```tsx
export default function JobBoard() {
  const [jobs, setJobs] = useState([])
  const [filters, setFilters] = useState({
    jobType: '',
    workLocation: '',
    experienceLevel: ''
  })

  const handleApplyFilters = async () => {
    const token = localStorage.getItem('authToken')

    const params = new URLSearchParams()
    if (filters.jobType) params.append('job_type', filters.jobType)
    if (filters.workLocation) params.append('work_location', filters.workLocation)
    if (filters.experienceLevel) params.append('experience_level', filters.experienceLevel)

    const response = await axios.get(
      `http://localhost:8000/api/university/jobs?${params.toString()}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )

    setJobs(response.data.jobs)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Job Board</h1>

      {/* Filters */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h3 className="font-bold mb-4">Filters</h3>
        <div className="grid grid-cols-3 gap-4">
          <select
            value={filters.jobType}
            onChange={(e) => setFilters({...filters, jobType: e.target.value})}
            className="p-2 border rounded"
          >
            <option value="">All Job Types</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="internship">Internship</option>
          </select>

          <select
            value={filters.workLocation}
            onChange={(e) => setFilters({...filters, workLocation: e.target.value})}
            className="p-2 border rounded"
          >
            <option value="">All Locations</option>
            <option value="remote">Remote</option>
            <option value="onsite">Onsite</option>
            <option value="hybrid">Hybrid</option>
          </select>

          <select
            value={filters.experienceLevel}
            onChange={(e) => setFilters({...filters, experienceLevel: e.target.value})}
            className="p-2 border rounded"
          >
            <option value="">All Levels</option>
            <option value="entry">Entry Level</option>
            <option value="mid">Mid Level</option>
            <option value="senior">Senior Level</option>
          </select>
        </div>

        <button
          onClick={handleApplyFilters}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Apply Filters
        </button>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {jobs.map(job => (
          <div key={job.id} className="bg-white p-6 rounded shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold">{job.title}</h3>
                <p className="text-gray-600">
                  {job.company.company_name} • {job.location}
                </p>
                <div className="flex gap-4 mt-2 text-sm">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {job.job_type}
                  </span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                    {job.work_location}
                  </span>
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                    {job.experience_level}
                  </span>
                </div>
                <p className="mt-3 text-gray-700">
                  {job.description.substring(0, 200)}...
                </p>
              </div>

              <button
                onClick={() => router.push(`/university_student/jobs/${job.id}`)}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### Job Application (`/university_student/jobs/[id]`)
**File:** `/home/user/ACE/frontend/app/university_student/jobs/[id]/page.tsx`

```tsx
export default function JobDetails({ params }) {
  const jobId = params.id
  const [job, setJob] = useState(null)
  const [hasApplied, setHasApplied] = useState(false)

  const handleApply = async () => {
    const token = localStorage.getItem('authToken')

    // Check if CV is uploaded
    const profileRes = await axios.get(
      'http://localhost:8000/api/university/profile',
      { headers: { Authorization: `Bearer ${token}` } }
    )

    if (!profileRes.data.profile.cv_path) {
      alert('Please upload your CV before applying')
      router.push('/university_student/profile')
      return
    }

    try {
      await axios.post(
        `http://localhost:8000/api/university/jobs/${jobId}/apply`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )

      alert('Application submitted successfully!')
      setHasApplied(true)
    } catch (error) {
      if (error.response?.status === 400) {
        alert('You have already applied for this job')
      } else {
        alert('Failed to apply')
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white p-8 rounded shadow">
        {/* Job Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{job?.title}</h1>
          <p className="text-xl text-gray-600">
            {job?.company.company_name}
          </p>
        </div>

        {/* Job Details */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-600">Job Type</p>
            <p className="font-medium">{job?.job_type}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Work Location</p>
            <p className="font-medium">{job?.work_location}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Location</p>
            <p className="font-medium">{job?.location}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Experience Level</p>
            <p className="font-medium">{job?.experience_level}</p>
          </div>
          {job?.salary_range && (
            <div>
              <p className="text-sm text-gray-600">Salary Range</p>
              <p className="font-medium">{job?.salary_range}</p>
            </div>
          )}
          {job?.application_deadline && (
            <div>
              <p className="text-sm text-gray-600">Application Deadline</p>
              <p className="font-medium">
                {new Date(job?.application_deadline).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-3">Job Description</h2>
          <p className="text-gray-700 whitespace-pre-line">
            {job?.description}
          </p>
        </div>

        {/* Apply Button */}
        {!hasApplied ? (
          <button
            onClick={handleApply}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-bold"
          >
            Apply Now
          </button>
        ) : (
          <div className="bg-green-100 text-green-800 p-4 rounded text-center">
            ✅ You have applied for this position
          </div>
        )}
      </div>
    </div>
  )
}
```

### Profile Management (`/university_student/profile`)
**File:** `/home/user/ACE/frontend/app/university_student/profile/page.tsx`

```tsx
export default function UniversityStudentProfile() {
  const [profile, setProfile] = useState(null)
  const [cvFile, setCvFile] = useState(null)

  const handleUploadCV = async () => {
    if (!cvFile) return

    const token = localStorage.getItem('authToken')
    const formData = new FormData()
    formData.append('cv', cvFile)

    try {
      await axios.post(
        'http://localhost:8000/api/university/upload-cv',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      alert('CV uploaded successfully!')
      fetchProfile()
    } catch (error) {
      alert('Failed to upload CV')
    }
  }

  const handleDownloadCV = async () => {
    const token = localStorage.getItem('authToken')

    try {
      const response = await axios.get(
        'http://localhost:8000/api/university/download-cv',
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      )

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'my-cv.pdf')
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      alert('Failed to download CV')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      {/* CV Section */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-2xl font-bold mb-4">CV / Resume</h2>

        {profile?.cv_path ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-4 rounded">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 012-2h8l4 4v10a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/>
                </svg>
              </div>
              <div>
                <p className="font-medium">CV Uploaded</p>
                <p className="text-sm text-gray-600">
                  Last updated: {new Date(profile.updated_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDownloadCV}
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              >
                Download
              </button>
              <button
                onClick={() => setCvFile(null)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Replace
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 mb-4">
              Upload your CV to start applying for jobs
            </p>
            <input
              type="file"
              onChange={(e) => setCvFile(e.target.files[0])}
              accept=".pdf,.doc,.docx"
              className="mb-4"
            />
            <button
              onClick={handleUploadCV}
              disabled={!cvFile}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              Upload CV
            </button>
          </div>
        )}
      </div>

      {/* Profile Information */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Profile Information</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Faculty</label>
            <input
              type="text"
              value={profile?.faculty || ''}
              onChange={(e) => setProfile({...profile, faculty: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Career Goal</label>
            <textarea
              value={profile?.goal || ''}
              onChange={(e) => setProfile({...profile, goal: e.target.value})}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>

          <button
            onClick={handleUpdateProfile}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
```

---

## Part 2: Admin Portal

### Admin Dashboard (`/admin/dashboard`)
**File:** `/home/user/ACE/frontend/app/admin/dashboard/page.tsx`

### What Admins Can Do
1. **Manage Users** - View, suspend, activate, delete users
2. **Approve Teachers** - Review and approve teacher registrations
3. **Moderate Courses** - Review and manage course content
4. **Verify Companies** - Verify company authenticity
5. **View Analytics** - Platform statistics and trends

### Dashboard Overview

```tsx
export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalJobs: 0,
    pendingTeachers: 0,
    activeStudents: 0,
    totalRevenue: 0
  })
  const [analyticsData, setAnalyticsData] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    const token = localStorage.getItem('authToken')

    // Fetch statistics
    const statsRes = await axios.get(
      'http://localhost:8000/api/admin/dashboard/stats',
      { headers: { Authorization: `Bearer ${token}` } }
    )
    setStats(statsRes.data)

    // Fetch analytics (last 30 days)
    const analyticsRes = await axios.get(
      'http://localhost:8000/api/admin/analytics/30days',
      { headers: { Authorization: `Bearer ${token}` } }
    )
    setAnalyticsData(analyticsRes.data)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon="👥"
          color="blue"
        />
        <StatCard
          title="Total Courses"
          value={stats.totalCourses}
          icon="📚"
          color="green"
        />
        <StatCard
          title="Total Jobs"
          value={stats.totalJobs}
          icon="💼"
          color="purple"
        />
        <StatCard
          title="Pending Teachers"
          value={stats.pendingTeachers}
          icon="⏳"
          color="yellow"
        />
        <StatCard
          title="Active Students"
          value={stats.activeStudents}
          icon="🎓"
          color="indigo"
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon="💰"
          color="green"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <button
          onClick={() => router.push('/admin/teachers')}
          className="bg-yellow-600 text-white p-6 rounded-lg hover:bg-yellow-700"
        >
          <p className="text-3xl mb-2">⏳</p>
          <p className="font-bold">Review Teachers</p>
          <p className="text-sm">{stats.pendingTeachers} pending approval</p>
        </button>

        <button
          onClick={() => router.push('/admin/users')}
          className="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700"
        >
          <p className="text-3xl mb-2">👥</p>
          <p className="font-bold">Manage Users</p>
          <p className="text-sm">View all platform users</p>
        </button>

        <button
          onClick={() => router.push('/admin/courses')}
          className="bg-green-600 text-white p-6 rounded-lg hover:bg-green-700"
        >
          <p className="text-3xl mb-2">📚</p>
          <p className="font-bold">Manage Courses</p>
          <p className="text-sm">Review course content</p>
        </button>
      </div>

      {/* Analytics Chart */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Analytics (Last 30 Days)</h2>
        {/* Chart component here - could use Chart.js or similar */}
        <AnalyticsChart data={analyticsData} />
      </div>
    </div>
  )
}
```

### Teacher Approval (`/admin/teachers`)
**File:** `/home/user/ACE/frontend/app/admin/teachers/page.tsx`

```tsx
export default function TeacherManagement() {
  const [pendingTeachers, setPendingTeachers] = useState([])

  const fetchPendingTeachers = async () => {
    const token = localStorage.getItem('authToken')

    const response = await axios.get(
      'http://localhost:8000/api/admin/teachers/pending',
      { headers: { Authorization: `Bearer ${token}` } }
    )

    setPendingTeachers(response.data.teachers)
  }

  const handleApprove = async (teacherId) => {
    const token = localStorage.getItem('authToken')

    try {
      await axios.post(
        `http://localhost:8000/api/admin/teachers/${teacherId}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )

      alert('Teacher approved successfully!')
      fetchPendingTeachers()
    } catch (error) {
      alert('Failed to approve teacher')
    }
  }

  const handleReject = async (teacherId) => {
    const reason = prompt('Enter reason for rejection:')
    if (!reason) return

    const token = localStorage.getItem('authToken')

    try {
      await axios.post(
        `http://localhost:8000/api/admin/teachers/${teacherId}/reject`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      alert('Teacher rejected')
      fetchPendingTeachers()
    } catch (error) {
      alert('Failed to reject teacher')
    }
  }

  const handleDownloadCV = async (teacherId) => {
    const token = localStorage.getItem('authToken')

    try {
      const response = await axios.get(
        `http://localhost:8000/api/admin/teachers/${teacherId}/cv`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      )

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `teacher_${teacherId}_cv.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      alert('Failed to download CV')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        Teacher Approvals ({pendingTeachers.length})
      </h1>

      <div className="space-y-4">
        {pendingTeachers.map(teacher => (
          <div key={teacher.id} className="bg-white p-6 rounded shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold">
                  {teacher.first_name} {teacher.last_name}
                </h3>
                <p className="text-gray-600">{teacher.email}</p>

                <div className="mt-4 space-y-2">
                  <p>
                    <strong>Specialization:</strong>{' '}
                    {teacher.teacher_profile.specialization}
                  </p>
                  <p>
                    <strong>Experience:</strong>{' '}
                    {teacher.teacher_profile.years_of_experience} years
                  </p>
                  <p>
                    <strong>Verification Status:</strong>{' '}
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                      Didit Verified ✅
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleDownloadCV(teacher.id)}
                  className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                >
                  Download CV
                </button>

                <button
                  onClick={() => handleApprove(teacher.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  ✅ Approve
                </button>

                <button
                  onClick={() => handleReject(teacher.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  ❌ Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### User Management (`/admin/users`)
**File:** `/home/user/ACE/frontend/app/admin/users/page.tsx`

```tsx
export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [filters, setFilters] = useState({
    userType: '',
    status: ''
  })

  const handleSuspendUser = async (userId) => {
    if (!confirm('Are you sure you want to suspend this user?')) return

    const token = localStorage.getItem('authToken')

    try {
      await axios.post(
        `http://localhost:8000/api/admin/users/${userId}/suspend`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )

      alert('User suspended')
      fetchUsers()
    } catch (error) {
      alert('Failed to suspend user')
    }
  }

  const handleActivateUser = async (userId) => {
    const token = localStorage.getItem('authToken')

    try {
      await axios.post(
        `http://localhost:8000/api/admin/users/${userId}/activate`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )

      alert('User activated')
      fetchUsers()
    } catch (error) {
      alert('Failed to activate user')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">User Management</h1>

      {/* Filters */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <div className="flex gap-4">
          <select
            value={filters.userType}
            onChange={(e) => setFilters({...filters, userType: e.target.value})}
            className="p-2 border rounded"
          >
            <option value="">All User Types</option>
            <option value="student">Students</option>
            <option value="teacher">Teachers</option>
            <option value="parent">Parents</option>
            <option value="university_student">University Students</option>
            <option value="company">Companies</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="p-2 border rounded"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>

          <button
            onClick={fetchUsers}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Type</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Joined</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-t">
                <td className="px-6 py-4">
                  {user.first_name} {user.last_name}
                </td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  <span className="capitalize">{user.user_type.replace('_', ' ')}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-sm ${
                    user.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  {user.status === 'active' ? (
                    <button
                      onClick={() => handleSuspendUser(user.id)}
                      className="text-red-600 hover:underline"
                    >
                      Suspend
                    </button>
                  ) : (
                    <button
                      onClick={() => handleActivateUser(user.id)}
                      className="text-green-600 hover:underline"
                    >
                      Activate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

---

## Part 3: Supporting Features

### Payment Integration
**Backend Controller:** `PaymentController.php`

#### Stripe Payment Flow
```php
// Create payment intent
public function createPaymentIntent($courseId)
{
    $course = Course::findOrFail($courseId);

    Stripe::setApiKey(config('services.stripe.secret'));

    $paymentIntent = PaymentIntent::create([
        'amount' => $course->price * 100, // Convert to cents
        'currency' => 'usd',
        'metadata' => [
            'course_id' => $courseId,
            'user_id' => auth()->id()
        ]
    ]);

    return response()->json([
        'clientSecret' => $paymentIntent->client_secret,
        'paymentIntentId' => $paymentIntent->id
    ]);
}

// Confirm payment
public function confirmPayment(Request $request)
{
    $validated = $request->validate([
        'courseId' => 'required|exists:courses,id',
        'paymentIntentId' => 'required|string'
    ]);

    // Create payment record
    $payment = Payment::create([
        'user_id' => auth()->id(),
        'course_id' => $validated['courseId'],
        'amount' => Course::find($validated['courseId'])->price,
        'payment_method' => 'stripe',
        'status' => 'completed',
        'transaction_id' => $validated['paymentIntentId']
    ]);

    // Enroll student in course
    CourseEnrollment::create([
        'student_id' => auth()->id(),
        'course_id' => $validated['courseId'],
        'price_paid' => $payment->amount,
        'enrolled_at' => now()
    ]);

    // Update course student count
    Course::where('id', $validated['courseId'])->increment('students_count');

    return response()->json([
        'success' => true,
        'message' => 'Enrollment successful'
    ]);
}
```

### Video Streaming
**Backend Controller:** `VideoStreamController.php`

```php
public function streamLesson($lessonId, Request $request)
{
    // Verify user has access to this lesson
    $lesson = CourseLesson::findOrFail($lessonId);
    $course = $lesson->course;

    $isEnrolled = CourseEnrollment::where('student_id', auth()->id())
        ->where('course_id', $course->id)
        ->exists();

    if (!$isEnrolled && !$lesson->is_preview) {
        return response()->json(['error' => 'Unauthorized'], 403);
    }

    // Get video file path
    $filePath = storage_path('app/' . $lesson->video_file_path);

    if (!file_exists($filePath)) {
        return response()->json(['error' => 'Video not found'], 404);
    }

    // Stream video with range support (for seeking)
    $fileSize = filesize($filePath);
    $range = $request->header('Range');

    if ($range) {
        // Parse range header
        list($start, $end) = explode('-', substr($range, 6));
        $end = $end ?: $fileSize - 1;

        $length = $end - $start + 1;

        $file = fopen($filePath, 'rb');
        fseek($file, $start);

        return response()->stream(
            function () use ($file, $length) {
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

    // No range, stream entire file
    return response()->file($filePath, [
        'Content-Type' => 'video/mp4',
        'Content-Length' => $fileSize
    ]);
}
```

### Notifications System
**Backend Controller:** `NotificationController.php`

```php
public function index()
{
    $notifications = auth()->user()
        ->notifications()
        ->orderBy('created_at', 'desc')
        ->paginate(20);

    return response()->json($notifications);
}

public function getUnreadCount()
{
    $count = auth()->user()
        ->notifications()
        ->where('is_read', false)
        ->count();

    return response()->json(['count' => $count]);
}

public function markAsRead($id)
{
    $notification = auth()->user()
        ->notifications()
        ->findOrFail($id);

    $notification->update(['is_read' => true]);

    return response()->json(['success' => true]);
}

public function markAllAsRead()
{
    auth()->user()
        ->notifications()
        ->where('is_read', false)
        ->update(['is_read' => true]);

    return response()->json(['success' => true]);
}
```

**Frontend Component:** `NotificationDropdown.tsx`

```tsx
export function NotificationDropdown() {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    fetchNotifications()
    fetchUnreadCount()

    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleMarkAsRead = async (notificationId) => {
    const token = localStorage.getItem('authToken')

    await axios.put(
      `http://localhost:8000/api/notifications/${notificationId}/read`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )

    fetchNotifications()
    fetchUnreadCount()
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded hover:bg-gray-100"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded shadow-lg z-50">
          <div className="p-4 border-b">
            <h3 className="font-bold">Notifications</h3>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.map(notif => (
              <div
                key={notif.id}
                className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                  !notif.is_read ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleMarkAsRead(notif.id)}
              >
                <p className="font-medium">{notif.title}</p>
                <p className="text-sm text-gray-600">{notif.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(notif.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
```

---

## Testing Questions

### University Student Portal
**1. How do uni students apply for jobs?**
- Browse jobs → Click job → Click "Apply Now" → CV submitted

**2. What's required before applying?**
- Must upload CV first

**3. What job filters are available?**
- Job type, work location, experience level

**4. Can they withdraw applications?**
- Yes, via DELETE /university/applications/{id}

### Admin Portal
**5. What can admins do with teachers?**
- Approve or reject pending registrations
- Download CVs for review

**6. What user actions can admins take?**
- Suspend users
- Activate users
- Delete users

**7. How do admins verify companies?**
- POST /admin/companies/{id}/verify

**8. What statistics are shown?**
- Total users, courses, jobs, pending teachers, revenue

### Supporting Features
**9. What payment methods are supported?**
- Stripe (credit card) and PayPal

**10. How does video streaming work?**
- Token-authenticated endpoint
- Range header support for seeking
- Checks enrollment before streaming

---

## Your Impact

✅ **University Student Portal:** Complete job search and application system
✅ **Admin Portal:** Full platform management and moderation
✅ **Payment Integration:** Stripe and PayPal implementation
✅ **Video Streaming:** Secure video delivery with range support
✅ **Notifications:** Real-time notification system
✅ **Backend Integration:** Connecting all features together

You built the platform's infrastructure and key management features! 🚀

---

## Final Notes

**Key Technologies You Used:**
- **Frontend:** Next.js 15, React 19, TailwindCSS, Axios
- **Backend:** Laravel, PostgreSQL, Sanctum
- **Third-party:** Stripe, PayPal, Agora, Didit
- **Video:** Range-based streaming, token authentication

**Architecture Decisions:**
- RESTful API design
- Token-based authentication
- Role-based access control
- File storage for CVs and videos
- Real-time notifications

Good luck with your presentation! 🎯
