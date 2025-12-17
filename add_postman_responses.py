#!/usr/bin/env python3
import json
import sys

# Read the Postman collection
with open('ACE_API_Postman_Collection.json', 'r') as f:
    collection = json.load(f)

# Function to add response examples to a request
def add_response_to_request(item, parent_name=""):
    if 'request' in item:
        request = item['request']
        method = request.get('method', 'GET')
        name = item.get('name', 'Request')

        # Skip if response already exists
        if 'response' in item and len(item['response']) > 0:
            return

        # Create response based on endpoint
        response_body = create_response_for_endpoint(name, method, parent_name)

        if response_body:
            item['response'] = [{
                "name": f"Example Response - {name}",
                "originalRequest": request.copy(),
                "status": "OK",
                "code": 200 if method != 'POST' or 'register' in name.lower() or 'create' in name.lower() else 200,
                "_postman_previewlanguage": "json",
                "header": [{
                    "key": "Content-Type",
                    "value": "application/json"
                }],
                "cookie": [],
                "body": json.dumps(response_body, indent=2)
            }]

            # Adjust status code for specific endpoints
            if method == 'POST' and ('register' in name.lower() or 'create' in name.lower()):
                item['response'][0]['code'] = 201
                item['response'][0]['status'] = "Created"
            elif method == 'DELETE':
                item['response'][0]['code'] = 200
                item['response'][0]['status'] = "OK"

def create_response_for_endpoint(name, method, parent_name):
    """Create appropriate response body based on endpoint name and method"""

    name_lower = name.lower()
    parent_lower = parent_name.lower()

    # Authentication endpoints
    if 'reset password' in name_lower:
        return {"message": "Password has been reset successfully"}
    elif 'send otp' in name_lower or 'verify otp' in name_lower:
        if 'send' in name_lower:
            return {"message": "OTP sent successfully to your email"}
        else:
            return {"message": "OTP verified successfully", "verified": True}

    # Notification endpoints
    if 'notification' in parent_lower:
        if 'get all' in name_lower or 'notification' == name_lower:
            return {
                "data": [
                    {
                        "id": "1",
                        "type": "info",
                        "data": {"message": "New course available", "course_id": 5},
                        "read_at": None,
                        "created_at": "2025-12-17T10:00:00.000000Z"
                    }
                ],
                "total": 1,
                "unread_count": 1
            }
        elif 'unread count' in name_lower:
            return {"unread_count": 5}
        elif 'mark' in name_lower:
            return {"message": "Notification(s) marked as read"}
        elif method == 'DELETE':
            return {"message": "Notification(s) deleted successfully"}

    # Dashboard/Stats endpoints
    if 'dashboard' in name_lower or 'stats' in name_lower or 'analytics' in name_lower:
        return {
            "total_users": 1250,
            "total_courses": 85,
            "total_enrollments": 3420,
            "total_revenue": 125000,
            "recent_registrations": 45,
            "active_teachers": 28,
            "pending_approvals": 7
        }

    # User endpoints
    if 'user' in name_lower and 'admin' in parent_lower:
        if 'get all' in name_lower:
            return {
                "data": [{
                    "id": 1,
                    "name": "John Doe",
                    "email": "john@example.com",
                    "user_type": "university_student",
                    "status": "active",
                    "created_at": "2025-12-17T10:00:00.000000Z"
                }],
                "current_page": 1,
                "total": 100
            }
        elif method == 'DELETE':
            return {"message": "User deleted successfully"}
        elif 'status' in name_lower or 'suspend' in name_lower or 'activate' in name_lower:
            return {"message": "User status updated successfully"}
        elif 'create admin' in name_lower:
            return {
                "message": "Admin created successfully",
                "user": {
                    "id": 10,
                    "name": "Admin User",
                    "email": "admin@example.com",
                    "user_type": "admin"
                }
            }
        else:
            return {
                "id": 1,
                "name": "John Doe",
                "email": "john@example.com",
                "user_type": "university_student",
                "phone": "+201234567890",
                "status": "active",
                "created_at": "2025-12-17T10:00:00.000000Z"
            }

    # Teacher endpoints
    if 'teacher' in parent_lower:
        if 'pending' in name_lower:
            return {
                "data": [{
                    "id": 1,
                    "name": "Dr. Jane Smith",
                    "email": "jane@example.com",
                    "specialization": "Computer Science",
                    "status": "pending",
                    "cv_path": "cvs/teacher_1.pdf",
                    "created_at": "2025-12-17T10:00:00.000000Z"
                }]
            }
        elif 'approve' in name_lower:
            return {"message": "Teacher approved successfully"}
        elif 'reject' in name_lower:
            return {"message": "Teacher rejected successfully"}
        elif 'cv' in name_lower and method == 'GET':
            return {"download_url": "http://localhost:8000/storage/cvs/teacher_1.pdf"}
        elif 'profile' in name_lower and method == 'GET':
            return {
                "id": 1,
                "name": "Dr. Jane Smith",
                "email": "jane@example.com",
                "phone": "+201234567890",
                "bio": "Experienced educator",
                "specialization": "Computer Science",
                "profile_picture": "profile_pictures/teacher_1.jpg"
            }
        elif 'profile' in name_lower and method == 'PUT':
            return {"message": "Profile updated successfully"}
        elif 'upload' in name_lower:
            return {"message": "File uploaded successfully", "file_path": "uploads/file_123.jpg"}
        elif 'stats' in name_lower:
            return {
                "total_courses": 12,
                "total_students": 340,
                "total_earnings": 45000,
                "average_rating": 4.7
            }

    # Course endpoints
    if 'course' in name_lower:
        if 'get all' in name_lower or method == 'GET' and 'course' == name_lower.strip():
            return {
                "data": [{
                    "id": 1,
                    "title": "Introduction to Programming",
                    "description": "Learn programming basics",
                    "category": "Programming",
                    "price": 500,
                    "difficulty_level": "beginner",
                    "instructor": "Dr. Jane Smith",
                    "enrolled_count": 120,
                    "rating": 4.8,
                    "thumbnail": "thumbnails/course_1.jpg"
                }],
                "current_page": 1,
                "total": 50
            }
        elif method == 'POST':
            return {
                "message": "Course created successfully",
                "course": {
                    "id": 1,
                    "title": "Introduction to Programming",
                    "description": "Learn programming basics",
                    "price": 500,
                    "created_at": "2025-12-17T10:00:00.000000Z"
                }
            }
        elif method == 'PUT':
            return {"message": "Course updated successfully"}
        elif method == 'DELETE':
            return {"message": "Course deleted successfully"}
        elif 'view' in name_lower:
            return {
                "id": 1,
                "title": "Introduction to Programming",
                "description": "Learn programming basics",
                "category": "Programming",
                "price": 500,
                "difficulty_level": "beginner",
                "lessons": [
                    {
                        "id": 1,
                        "title": "Lesson 1: Introduction",
                        "duration": 1800,
                        "order": 1
                    }
                ]
            }
        elif 'enroll' in name_lower:
            return {"message": "Enrolled in course successfully"}
        elif 'my courses' in name_lower:
            return {
                "data": [{
                    "id": 1,
                    "title": "Introduction to Programming",
                    "progress": 45,
                    "enrolled_at": "2025-12-15T10:00:00.000000Z"
                }]
            }

    # Lesson endpoints
    if 'lesson' in name_lower:
        if method == 'POST' and 'progress' not in name_lower:
            return {
                "message": "Lesson created successfully",
                "lesson": {
                    "id": 1,
                    "title": "Lesson 1: Introduction",
                    "duration": 1800,
                    "order": 1
                }
            }
        elif method == 'PUT':
            return {"message": "Lesson updated successfully"}
        elif method == 'DELETE':
            return {"message": "Lesson deleted successfully"}
        elif 'progress' in name_lower:
            return {"message": "Progress updated successfully", "completed": True}
        elif 'reorder' in name_lower:
            return {"message": "Lessons reordered successfully"}

    # Job endpoints
    if 'job' in name_lower:
        if 'get all' in name_lower or ('job' in name_lower and method == 'GET'):
            return {
                "data": [{
                    "id": 1,
                    "title": "Software Engineer",
                    "description": "We are looking for a talented software engineer",
                    "location": "Cairo, Egypt",
                    "job_type": "full-time",
                    "salary_range": "50000-80000 EGP",
                    "company_name": "Tech Corp",
                    "deadline": "2025-12-31",
                    "created_at": "2025-12-17T10:00:00.000000Z"
                }],
                "current_page": 1,
                "total": 25
            }
        elif method == 'POST' and 'apply' not in name_lower:
            return {
                "message": "Job created successfully",
                "job": {
                    "id": 1,
                    "title": "Software Engineer",
                    "created_at": "2025-12-17T10:00:00.000000Z"
                }
            }
        elif method == 'PUT':
            return {"message": "Job updated successfully"}
        elif method == 'DELETE':
            return {"message": "Job deleted successfully"}
        elif 'apply' in name_lower:
            return {"message": "Application submitted successfully", "application_id": 1}
        elif 'test-jsearch' in name_lower:
            return {
                "message": "JSearch API connection successful",
                "jobs_found": 150
            }

    # Application endpoints
    if 'application' in name_lower:
        if 'get all' in name_lower or method == 'GET':
            return {
                "data": [{
                    "id": 1,
                    "job_title": "Software Engineer",
                    "applicant_name": "John Doe",
                    "applicant_email": "john@example.com",
                    "status": "pending",
                    "cover_letter": "I am very interested...",
                    "applied_at": "2025-12-17T10:00:00.000000Z"
                }],
                "current_page": 1,
                "total": 45
            }
        elif 'status' in name_lower:
            return {"message": "Application status updated successfully"}
        elif 'favorite' in name_lower:
            return {"message": "Favorite status toggled successfully", "is_favorite": True}
        elif method == 'DELETE' or 'withdraw' in name_lower:
            return {"message": "Application withdrawn successfully"}

    # Company endpoints
    if 'company' in parent_lower or 'companies' in name_lower:
        if 'profile' in name_lower and method == 'GET':
            return {
                "id": 1,
                "company_name": "Tech Corp",
                "email": "contact@techcorp.com",
                "industry": "Technology",
                "website": "https://techcorp.com",
                "description": "Leading tech company",
                "location": "Cairo, Egypt",
                "logo": "logos/company_1.jpg",
                "is_verified": True
            }
        elif 'profile' in name_lower and method == 'PUT':
            return {"message": "Profile updated successfully"}
        elif 'upload' in name_lower:
            return {"message": "File uploaded successfully", "file_path": "uploads/file_123.jpg"}
        elif 'verify' in name_lower:
            return {"message": "Company verification status updated"}
        elif 'get all' in name_lower:
            return {
                "data": [{
                    "id": 1,
                    "company_name": "Tech Corp",
                    "email": "contact@techcorp.com",
                    "industry": "Technology",
                    "is_verified": True
                }],
                "current_page": 1,
                "total": 30
            }

    # Profile/Upload endpoints
    if 'profile' in name_lower:
        if method == 'GET':
            return {
                "id": 1,
                "name": "John Doe",
                "email": "john@example.com",
                "phone": "+201234567890",
                "profile_picture": "profile_pictures/user_1.jpg",
                "created_at": "2025-12-17T10:00:00.000000Z"
            }
        elif method == 'PUT':
            return {"message": "Profile updated successfully"}

    if 'upload' in name_lower or 'download' in name_lower:
        if 'download' in name_lower:
            return {"download_url": "http://localhost:8000/storage/files/document.pdf"}
        else:
            return {"message": "File uploaded successfully", "file_path": "uploads/file_123.jpg"}

    # Parent/Student specific
    if 'parent' in parent_lower:
        if 'search student' in name_lower:
            return {
                "found": True,
                "student": {
                    "id": 5,
                    "name": "Student Name",
                    "email": "student@example.com"
                }
            }
        elif 'follow' in name_lower:
            if 'get' in name_lower or method == 'GET':
                return {
                    "data": [{
                        "id": 5,
                        "name": "Student Name",
                        "email": "student@example.com",
                        "grade": "10",
                        "school": "Cairo High School"
                    }]
                }
            elif method == 'DELETE':
                return {"message": "Student unfollowed successfully"}
            else:
                return {"message": "Follow request sent successfully"}
        elif 'student' in name_lower and method == 'GET':
            return {
                "id": 5,
                "name": "Student Name",
                "email": "student@example.com",
                "grade": "10",
                "school": "Cairo High School",
                "courses": []
            }

    # Student specific
    if 'follow request' in name_lower:
        if method == 'GET':
            return {
                "data": [{
                    "id": 1,
                    "parent_name": "Parent Name",
                    "parent_email": "parent@example.com",
                    "status": "pending",
                    "created_at": "2025-12-17T10:00:00.000000Z"
                }]
            }
        else:
            return {"message": "Follow request processed successfully"}

    # Public profiles
    if 'public profile' in name_lower:
        return {
            "data": [{
                "id": 1,
                "name": "John Doe",
                "university": "Cairo University",
                "major": "Computer Science",
                "bio": "Passionate student"
            }]
        }

    # Payment endpoints
    if 'payment' in name_lower or 'stripe' in name_lower or 'paypal' in name_lower:
        if 'create' in name_lower and 'intent' in name_lower:
            return {
                "client_secret": "pi_xxxxx_secret_yyyyy",
                "payment_intent_id": "pi_1234567890"
            }
        elif 'create' in name_lower and 'order' in name_lower:
            return {
                "order_id": "ORDER123456",
                "approval_url": "https://www.paypal.com/checkoutnow?token=xxxxx"
            }
        elif 'confirm' in name_lower:
            return {
                "message": "Payment confirmed successfully",
                "enrollment_id": 123
            }
        elif 'history' in name_lower:
            return {
                "data": [{
                    "id": 1,
                    "course_title": "Introduction to Programming",
                    "amount": 500,
                    "payment_method": "stripe",
                    "status": "completed",
                    "created_at": "2025-12-15T10:00:00.000000Z"
                }]
            }
        elif 'webhook' in name_lower:
            return {"received": True}

    # Live streaming endpoints
    if 'live' in name_lower or 'session' in name_lower:
        if 'upcoming' in name_lower:
            return {
                "data": [{
                    "id": 1,
                    "course_title": "Introduction to Programming",
                    "title": "Live Session 1",
                    "scheduled_at": "2025-12-18T14:00:00.000000Z",
                    "duration": 3600,
                    "teacher_name": "Dr. Jane Smith"
                }]
            }
        elif 'join' in name_lower or 'start' in name_lower:
            return {
                "message": "Joined session successfully",
                "stream_url": "rtmp://stream.example.com/live/session_1",
                "session_token": "eyJ0eXAi..."
            }
        elif 'end' in name_lower:
            return {"message": "Session ended successfully"}
        elif 'next-session' in name_lower:
            return {
                "id": 1,
                "title": "Live Session 1",
                "scheduled_at": "2025-12-18T14:00:00.000000Z"
            }
        elif 'message' in name_lower:
            if method == 'GET':
                return {
                    "data": [{
                        "id": 1,
                        "user_name": "John Doe",
                        "message": "Hello everyone!",
                        "created_at": "2025-12-17T10:00:00.000000Z"
                    }]
                }
            else:
                return {"message": "Message sent successfully", "message_id": 1}

    # AI Career Mentor endpoints
    if 'ai-career' in name_lower or 'ai career' in parent_lower:
        if 'chat' in name_lower and method == 'POST':
            return {
                "response": "Based on your profile, I recommend focusing on...",
                "conversation_id": "conv_123"
            }
        elif 'history' in name_lower:
            if method == 'GET':
                return {
                    "data": [{
                        "id": 1,
                        "message": "What career path should I follow?",
                        "response": "Based on your profile...",
                        "created_at": "2025-12-17T10:00:00.000000Z"
                    }]
                }
            else:
                return {"message": "Chat history cleared successfully"}
        elif 'analyze-cv' in name_lower:
            return {
                "analysis": {
                    "strengths": ["Strong technical skills", "Good education background"],
                    "improvements": ["Add more project details", "Include certifications"],
                    "overall_score": 78
                }
            }
        elif 'learning-path' in name_lower:
            return {
                "path": [{
                    "phase": 1,
                    "title": "Fundamentals",
                    "topics": ["HTML/CSS", "JavaScript Basics"],
                    "duration": "3 months"
                }]
            }
        elif 'job-recommendations' in name_lower:
            return {
                "recommendations": [{
                    "title": "Junior Frontend Developer",
                    "company": "Tech Corp",
                    "match_score": 85,
                    "location": "Cairo"
                }]
            }
        elif 'skills-gap' in name_lower:
            return {
                "missing_skills": ["React", "TypeScript", "Node.js"],
                "recommendations": ["Take React course", "Learn TypeScript fundamentals"]
            }

    # Didit (Identity Verification)
    if 'didit' in name_lower:
        if 'create-session' in name_lower:
            return {
                "session_id": "session_abc123",
                "verification_url": "https://verify.didit.me/session_abc123"
            }
        elif 'status' in name_lower:
            return {
                "session_id": "session_abc123",
                "status": "verified",
                "verified_at": "2025-12-17T10:00:00.000000Z"
            }
        elif 'webhook' in name_lower:
            return {"received": True}

    # Video streaming
    if 'stream' in name_lower and 'lesson' in name_lower:
        return {"stream_url": "http://localhost:8000/storage/videos/lesson_1.mp4"}

    # Storage
    if 'storage' in name_lower:
        return {"file_url": "http://localhost:8000/storage/files/document.pdf"}

    # Default response
    return {"message": "Operation completed successfully"}

# Recursively process all items
def process_items(items, parent_name=""):
    for item in items:
        if 'item' in item:
            # This is a folder, process its children
            process_items(item['item'], item.get('name', ''))
        elif 'request' in item:
            # This is a request item
            add_response_to_request(item, parent_name)

# Process all items in the collection
for item in collection['item']:
    if 'item' in item:
        process_items(item['item'], item.get('name', ''))
    elif 'request' in item:
        add_response_to_request(item)

# Write the updated collection back to file
with open('ACE_API_Postman_Collection.json', 'w') as f:
    json.dump(collection, f, indent='\t')

print("Successfully added example responses to all endpoints!")
