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

---

## Technical Deep Dive

### 1. Admin RBAC (Role-Based Access Control)

**Middleware Implementation:**
```php
class UserTypeMiddleware
{
    public function handle($request, Closure $next, $allowedType)
    {
        if (!auth()->check()) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        if (auth()->user()->user_type !== $allowedType) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return $next($request);
    }
}

// Usage in routes
Route::middleware(['auth:sanctum', 'userType:admin'])->group(function() {
    Route::get('/admin/users', [AdminController::class, 'index']);
});
```

**Authorization Checks:**
```tsx
// Frontend guard
const isAdmin = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  return user.type === 'admin'
}

// Protect routes
useEffect(() => {
  if (!isAdmin()) {
    router.push('/')
  }
}, [])
```

---

### 2. Dashboard Analytics

**Aggregation Queries:**
```php
public function getDashboardStats()
{
    $stats = [
        'totalUsers' => User::count(),
        'totalCourses' => Course::count(),
        'totalRevenue' => Payment::where('status', 'completed')->sum('amount'),
        'pendingTeachers' => User::where('user_type', 'teacher')
            ->where('is_approved', false)
            ->count(),
        
        // Group by user type
        'usersByType' => User::select('user_type', DB::raw('count(*) as count'))
            ->groupBy('user_type')
            ->pluck('count', 'user_type'),
        
        // Revenue by month
        'revenueByMonth' => Payment::where('status', 'completed')
            ->select(
                DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'),
                DB::raw('SUM(amount) as total')
            )
            ->groupBy('month')
            ->orderBy('month')
            ->get()
    ];

    return response()->json($stats);
}
```

**Chart Visualization:**
```tsx
import { Line, Bar, Pie } from 'react-chartjs-2'

const AdminAnalytics = () => {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const chartData = {
    labels: data?.revenueByMonth.map(m => m.month),
    datasets: [{
      label: 'Revenue',
      data: data?.revenueByMonth.map(m => m.total),
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  }

  return (
    <div>
      <Line data={chartData} />
    </div>
  )
}
```

---

### 3. Payment Integration Deep Dive

**Stripe Backend:**
```php
use Stripe\Stripe;
use Stripe\PaymentIntent;

public function createPaymentIntent($courseId)
{
    Stripe::setApiKey(config('services.stripe.secret'));

    $course = Course::findOrFail($courseId);
    
    $paymentIntent = PaymentIntent::create([
        'amount' => $course->price * 100, // Convert to cents
        'currency' => 'usd',
        'metadata' => [
            'course_id' => $courseId,
            'user_id' => auth()->id(),
            'user_email' => auth()->user()->email
        ]
    ]);

    // Store payment record
    Payment::create([
        'user_id' => auth()->id(),
        'course_id' => $courseId,
        'amount' => $course->price,
        'payment_method' => 'stripe',
        'status' => 'pending',
        'transaction_id' => $paymentIntent->id
    ]);

    return response()->json([
        'clientSecret' => $paymentIntent->client_secret,
        'paymentIntentId' => $paymentIntent->id
    ]);
}
```

**Stripe Webhook Handling:**
```php
public function handleStripeWebhook(Request $request)
{
    $payload = $request->getContent();
    $sigHeader = $request->header('Stripe-Signature');
    $endpointSecret = config('services.stripe.webhook_secret');

    try {
        $event = \Stripe\Webhook::constructEvent(
            $payload,
            $sigHeader,
            $endpointSecret
        );
    } catch (\Exception $e) {
        return response()->json(['error' => 'Invalid signature'], 400);
    }

    switch ($event->type) {
        case 'payment_intent.succeeded':
            $paymentIntent = $event->data->object;
            
            // Update payment status
            $payment = Payment::where('transaction_id', $paymentIntent->id)->first();
            $payment->update(['status' => 'completed']);
            
            // Enroll user in course
            CourseEnrollment::create([
                'student_id' => $payment->user_id,
                'course_id' => $payment->course_id,
                'price_paid' => $payment->amount
            ]);
            
            // Notify user
            User::find($payment->user_id)->notify(new EnrollmentConfirmed($payment->course));
            
            break;
            
        case 'payment_intent.payment_failed':
            $paymentIntent = $event->data->object;
            
            Payment::where('transaction_id', $paymentIntent->id)
                ->update(['status' => 'failed']);
            break;
    }

    return response()->json(['success' => true]);
}
```

---

### 4. Video Streaming Optimization

**Range Request Handling:**
```php
public function streamLesson($lessonId, Request $request)
{
    $lesson = CourseLesson::findOrFail($lessonId);
    
    // Authorization check
    $isEnrolled = CourseEnrollment::where('student_id', auth()->id())
        ->where('course_id', $lesson->course_id)
        ->exists();
    
    if (!$isEnrolled && !$lesson->is_preview) {
        return response()->json(['error' => 'Unauthorized'], 403);
    }
    
    $filePath = storage_path('app/' . $lesson->video_file_path);
    
    if (!file_exists($filePath)) {
        return response()->json(['error' => 'Video not found'], 404);
    }
    
    $fileSize = filesize($filePath);
    $range = $request->header('Range');
    
    if ($range) {
        // Parse range: bytes=0-1024
        preg_match('/bytes=(\d+)-(\d*)/', $range, $matches);
        $start = intval($matches[1]);
        $end = $matches[2] ? intval($matches[2]) : $fileSize - 1;
        
        $length = $end - $start + 1;
        
        $file = fopen($filePath, 'rb');
        fseek($file, $start);
        $data = fread($file, $length);
        fclose($file);
        
        return response($data, 206)
            ->header('Content-Type', 'video/mp4')
            ->header('Content-Length', $length)
            ->header('Content-Range', "bytes $start-$end/$fileSize")
            ->header('Accept-Ranges', 'bytes');
    }
    
    // No range header - stream entire file
    return response()->file($filePath, [
        'Content-Type' => 'video/mp4',
        'Content-Length' => $fileSize
    ]);
}
```

**Progressive Download:**
```tsx
<video
  src={`/api/stream/lesson/${lessonId}?token=${token}`}
  controls
  preload="metadata" // Only load metadata initially
  onLoadedMetadata={(e) => {
    const video = e.target as HTMLVideoElement
    console.log('Duration:', video.duration)
  }}
  onProgress={(e) => {
    const video = e.target as HTMLVideoElement
    const buffered = video.buffered
    if (buffered.length > 0) {
      const bufferedEnd = buffered.end(buffered.length - 1)
      const bufferedPercent = (bufferedEnd / video.duration) * 100
      setBufferedPercent(bufferedPercent)
    }
  }}
/>
```

---

### 5. Advanced Search & Filtering

**Full-Text Search:**
```php
public function searchJobs(Request $request)
{
    $query = $request->input('q');
    $filters = $request->only(['job_type', 'work_location', 'experience_level']);
    
    $jobs = JobPosting::where('is_active', true)
        ->when($query, function($q) use ($query) {
            $q->where(function($subQuery) use ($query) {
                $subQuery->where('title', 'LIKE', "%{$query}%")
                    ->orWhere('description', 'LIKE', "%{$query}%")
                    ->orWhere('location', 'LIKE', "%{$query}%");
            });
        })
        ->when($filters['job_type'], function($q) use ($filters) {
            $q->where('job_type', $filters['job_type']);
        })
        ->when($filters['work_location'], function($q) use ($filters) {
            $q->where('work_location', $filters['work_location']);
        })
        ->when($filters['experience_level'], function($q) use ($filters) {
            $q->where('experience_level', $filters['experience_level']);
        })
        ->with('company')
        ->paginate(20);
    
    return response()->json($jobs);
}
```

**Faceted Search (Frontend):**
```tsx
const JobSearch = () => {
  const [jobs, setJobs] = useState([])
  const [filters, setFilters] = useState({
    q: '',
    job_type: '',
    work_location: '',
    experience_level: ''
  })
  const [facets, setFacets] = useState({
    jobTypes: {},
    workLocations: {},
    experienceLevels: {}
  })

  useEffect(() => {
    searchJobs()
  }, [filters])

  const searchJobs = async () => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value)
    })

    const { data } = await axios.get(`/university/jobs?${params}`)
    setJobs(data.data)

    // Calculate facets (counts for each filter option)
    const types = {}
    const locations = {}
    const levels = {}

    data.data.forEach(job => {
      types[job.job_type] = (types[job.job_type] || 0) + 1
      locations[job.work_location] = (locations[job.work_location] || 0) + 1
      levels[job.experience_level] = (levels[job.experience_level] || 0) + 1
    })

    setFacets({
      jobTypes: types,
      workLocations: locations,
      experienceLevels: levels
    })
  }

  return (
    <div className="grid grid-cols-4 gap-6">
      {/* Filters Sidebar */}
      <div className="col-span-1">
        <h3>Filters</h3>

        <div>
          <h4>Job Type</h4>
          {Object.entries(facets.jobTypes).map(([type, count]) => (
            <label key={type}>
              <input
                type="radio"
                name="job_type"
                value={type}
                checked={filters.job_type === type}
                onChange={(e) => setFilters({...filters, job_type: e.target.value})}
              />
              {type} ({count})
            </label>
          ))}
        </div>

        {/* More filters... */}
      </div>

      {/* Results */}
      <div className="col-span-3">
        {jobs.map(job => <JobCard key={job.id} job={job} />)}
      </div>
    </div>
  )
}
```

---

## Technical Interview Questions (60+ Questions)

### Admin & RBAC (15 questions)

**1. What is RBAC?**
- Role-Based Access Control
- Users assigned roles (admin, teacher, student)
- Permissions based on role

**2. How do you implement RBAC in Laravel?**
- Middleware checks user_type
- Routes protected with middleware
- Gates and Policies for fine-grained control

**3. What is the difference between authentication and authorization?**
- Authentication: Who are you? (login)
- Authorization: What can you do? (permissions)

**4. How do you protect admin routes?**
```php
Route::middleware(['auth:sanctum', 'userType:admin'])->group(function() {
    // Admin routes
});
```

**5. Should you trust frontend authorization checks?**
- No! Always verify on backend
- Frontend checks are for UX only
- Attackers can bypass frontend

**6. How do you implement audit logs?**
```php
// Log admin actions
AuditLog::create([
    'admin_id' => auth()->id(),
    'action' => 'user.suspend',
    'target_id' => $userId,
    'ip_address' => request()->ip(),
    'user_agent' => request()->userAgent()
]);
```

**7. What is the principle of least privilege?**
- Users should only have minimum permissions needed
- Don't give admin access unless necessary
- Reduces security risk

**8. How do you implement user suspension?**
```php
public function suspend($userId) {
    $user = User::findOrFail($userId);
    $user->update(['status' => 'suspended']);
    
    // Invalidate all tokens
    $user->tokens()->delete();
    
    // Notify user
    $user->notify(new AccountSuspended());
}
```

**9. How do you prevent privilege escalation?**
- Validate user permissions on backend
- Don't allow users to change their own role
- Audit permission changes

**10. What is two-factor authentication (2FA)?**
- Second authentication factor beyond password
- Examples: SMS code, authenticator app, email code
- Increases security

**11. How do you implement activity monitoring?**
- Log user actions (login, logout, changes)
- Track IP addresses and user agents
- Alert on suspicious activity

**12. What is session hijacking?**
- Attacker steals user's session token
- Prevention: HTTPS, secure cookies, token rotation

**13. How do you implement user impersonation (for support)?**
```php
public function impersonate($userId) {
    $admin = auth()->user();
    $targetUser = User::findOrFail($userId);
    
    session(['impersonating' => $userId, 'admin_id' => $admin->id]);
    
    auth()->login($targetUser);
}
```

**14. What are database transactions and when to use them?**
```php
DB::transaction(function() {
    $user->update(['status' => 'suspended']);
    $user->tokens()->delete();
    AuditLog::create([...]);
});
```
- All or nothing - if one fails, all revert
- Use for related operations

**15. How do you implement soft deletes?**
```php
use SoftDeletes;

// Soft delete
$user->delete(); // Sets deleted_at timestamp

// Restore
$user->restore();

// Force delete (permanent)
$user->forceDelete();

// Include soft deleted
User::withTrashed()->get();
```

---

### Payment Systems (15 questions)

**16. How does Stripe payment flow work?**
1. Create payment intent on backend
2. Frontend gets client secret
3. Frontend collects card details (Stripe.js)
4. Stripe processes payment
5. Webhook confirms to backend
6. Backend enrolls user

**17. What is a payment intent?**
- Stripe object representing payment
- Tracks payment through lifecycle
- Contains amount, currency, status

**18. Why use Stripe.js instead of posting card data to your backend?**
- PCI compliance
- Stripe handles card data securely
- You never touch sensitive data

**19. What is PCI DSS?**
- Payment Card Industry Data Security Standard
- Rules for handling credit card data
- Non-compliance = fines and liability

**20. How do you handle payment failures?**
```tsx
const { error } = await stripe.confirmCardPayment(clientSecret)

if (error) {
  // Show user-friendly message
  if (error.code === 'card_declined') {
    alert('Your card was declined')
  } else if (error.code === 'insufficient_funds') {
    alert('Insufficient funds')
  } else {
    alert('Payment failed: ' + error.message)
  }
}
```

**21. What is idempotency in payments?**
- Same request multiple times = same result
- Prevents duplicate charges
- Use idempotency keys

**22. How do you implement refunds?**
```php
Stripe::setApiKey(config('services.stripe.secret'));

$refund = \Stripe\Refund::create([
    'payment_intent' => $paymentIntentId,
    'amount' => $amount * 100 // Full or partial
]);

// Update database
$payment->update(['status' => 'refunded']);
```

**23. What are webhooks and why use them?**
- Server-to-server HTTP POST requests
- Real-time payment status updates
- Reliable (Stripe retries if fails)

**24. How do you secure payment webhooks?**
```php
$payload = $request->getContent();
$sigHeader = $request->header('Stripe-Signature');

$event = \Stripe\Webhook::constructEvent(
    $payload,
    $sigHeader,
    $webhookSecret
);
// Verifies signature from Stripe
```

**25. What payment statuses exist?**
- pending: Payment initiated
- processing: Being processed
- completed: Successfully paid
- failed: Payment failed
- refunded: Money returned

**26. How do you handle PayPal integration?**
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
    const order = await actions.order.capture()
    await enrollInCourse(courseId, order.id)
  }}
/>
```

**27. What is 3D Secure?**
- Additional authentication for card payments
- Reduces fraud
- Required in Europe (SCA)

**28. How do you test payments in development?**
- Stripe test mode
- Test card numbers (4242 4242 4242 4242)
- Test different scenarios (declined, insufficient funds)

**29. What is recurring billing?**
- Automatic charges at regular intervals
- Subscriptions
- Requires storing payment method

**30. How do you handle disputes/chargebacks?**
- Customer disputes charge with bank
- Provide evidence to Stripe
- May lose money + fee if lose dispute

---

### Video Streaming (10 questions)

**31. What is progressive download?**
- Video downloads while playing
- Can seek to downloaded parts
- Simple but less efficient than streaming

**32. What is adaptive bitrate streaming?**
- Multiple quality levels
- Switches based on network speed
- Technologies: HLS, DASH

**33. What is HLS (HTTP Live Streaming)?**
- Apple's streaming protocol
- Breaks video into small segments
- Widely supported

**34. How do range requests work?**
```
Client: Range: bytes=1024-2048
Server: Content-Range: bytes 1024-2048/5000
```
- Client requests specific byte range
- Enables seeking in video

**35. How do you protect video content?**
- Token authentication in URL
- Signed URLs with expiration
- DRM for high-value content

**36. What is video transcoding?**
- Converting video to different formats/sizes
- Create multiple quality levels
- Tools: FFmpeg, AWS MediaConvert

**37. How do you generate video thumbnails?**
```bash
ffmpeg -i video.mp4 -ss 00:00:05 -vframes 1 thumbnail.jpg
```
- Extract frame at specific time
- Use as preview image

**38. What is CDN and why use it for video?**
- Content Delivery Network
- Caches content near users
- Faster delivery, less bandwidth cost

**39. How do you track video analytics?**
```tsx
<video
  onPlay={() => trackEvent('video_play')}
  onPause={() => trackEvent('video_pause')}
  onEnded={() => trackEvent('video_complete')}
  onTimeUpdate={(e) => {
    const percent = (e.target.currentTime / e.target.duration) * 100
    if (percent >= 25 && !milestones.quarter) {
      trackEvent('video_25_percent')
      setMilestones({...milestones, quarter: true})
    }
  }}
/>
```

**40. What video formats are web-compatible?**
- MP4 (H.264): Most compatible
- WebM (VP8/VP9): Open source, good compression
- OGG: Less common

---

### Database & Performance (10 questions)

**41. What is database indexing?**
- Data structure to speed up queries
- Trade-off: Faster reads, slower writes
- Index columns used in WHERE, JOIN, ORDER BY

**42. When should you add an index?**
- Columns in WHERE clauses
- Foreign keys
- Columns used for sorting
- Don't over-index (slows writes)

**43. What is a composite index?**
```php
$table->index(['status', 'created_at']);
```
- Index on multiple columns
- Order matters
- Good for queries filtering on both

**44. What is query optimization?**
- Making queries faster
- Techniques: Indexes, select specific columns, eager loading

**45. What is the N+1 query problem?**
```php
// ❌ Bad - 1 + N queries
$courses = Course::all();
foreach ($courses as $course) {
    echo $course->teacher->name; // N queries
}

// ✅ Good - 2 queries
$courses = Course::with('teacher')->all();
foreach ($courses as $course) {
    echo $course->teacher->name;
}
```

**46. How do you optimize large tables?**
- Pagination (don't load all at once)
- Indexing
- Archiving old data
- Partitioning

**47. What is database caching?**
```php
$stats = Cache::remember('dashboard-stats', 600, function() {
    return [
        'totalUsers' => User::count(),
        'totalCourses' => Course::count(),
        // ...
    ];
});
```
- Store query results in memory
- Faster than hitting database
- Use for expensive, frequently accessed data

**48. What is lazy loading vs eager loading?**
- Lazy: Load relationships when accessed (N+1)
- Eager: Load relationships upfront (with())

**49. How do you handle database migrations in production?**
- Test in staging first
- Backup database
- Run during low traffic
- Have rollback plan

**50. What is database normalization?**
- Organizing data to reduce redundancy
- Separate tables for different entities
- Use foreign keys to relate

---

### API Design (10 questions)

**51. What is REST?**
- REpresentational State Transfer
- Architectural style for APIs
- Uses HTTP methods (GET, POST, PUT, DELETE)

**52. What are idempotent operations?**
- Same request multiple times = same result
- GET, PUT, DELETE are idempotent
- POST is not (creates new resource each time)

**53. How do you version APIs?**
```
/api/v1/users
/api/v2/users
```
- URL versioning
- Header versioning
- Allows breaking changes without breaking old clients

**54. What is pagination and why use it?**
- Return subset of results
- Reduces payload size
- Faster responses

**55. What is rate limiting?**
- Limit requests per time period
- Prevents abuse
- Example: 100 requests per minute

**56. How do you handle API errors?**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required",
    "fields": {
      "email": ["Email is required"]
    }
  }
}
```

**57. What is HATEOAS?**
- Hypermedia As The Engine Of Application State
- Include links to related resources in responses
- Self-documenting API

**58. What is GraphQL vs REST?**
- REST: Multiple endpoints, over/under fetching
- GraphQL: Single endpoint, request exact data needed

**59. How do you document APIs?**
- OpenAPI/Swagger
- Postman collections
- API documentation generators

**60. What are API best practices?**
- Use proper HTTP methods and status codes
- Consistent naming (plural nouns)
- Versioning
- Authentication & authorization
- Rate limiting
- Error handling
- Documentation

