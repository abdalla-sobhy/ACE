# سلسبيل - Static Pages Documentation

## Overview
You worked on all the **static/public pages** of the ACE platform. These are the pages that visitors see BEFORE logging in. Your work creates the first impression and provides essential information about the platform.

---

## Pages You Built

### 1. Home Page (`/`)
**File:** `/home/user/ACE/frontend/app/page.tsx`

**What it does:**
- The landing page - first thing users see when they visit ACE
- Shows platform overview and value proposition
- Encourages users to sign up or explore features

**Key Components:**
```tsx
export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="text-center py-20">
        <h1>Welcome to ACE - Academic Career Education</h1>
        <p>Platform for learning and career growth</p>
        <Link href="/signup">Get Started</Link>
      </section>

      {/* Features Preview */}
      {/* Call to Action */}
    </div>
  )
}
```

**Flow:**
1. User lands on homepage
2. Sees hero section with main message
3. Can navigate to:
   - `/signup` - Register
   - `/login` - Login
   - `/features` - Learn more
   - `/about` - About us

---

### 2. About Page (`/about`)
**File:** `/home/user/ACE/frontend/app/about/page.tsx`

**What it does:**
- Tells the story of ACE platform
- Explains mission and vision
- Builds trust with users

**Structure:**
```tsx
export default function About() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Platform Story */}
      <section>
        <h1>About ACE</h1>
        <p>Our platform connects students, teachers, and employers...</p>
      </section>

      {/* Mission & Vision */}
      <section>
        <h2>Our Mission</h2>
        <p>Democratize education and career opportunities...</p>
      </section>

      {/* Team or Values */}
    </div>
  )
}
```

**Purpose:**
- Build credibility
- Explain what makes ACE different
- Show commitment to users

---

### 3. Features Page (`/features`)
**File:** `/home/user/ACE/frontend/app/features/page.tsx`

**What it does:**
- Showcases all platform capabilities
- Highlights features for different user types
- Helps users understand what they can do on ACE

**Feature Categories:**

**For Students:**
- Browse and enroll in courses
- Attend live classes
- Track learning progress
- Get certificates

**For Teachers:**
- Create and sell courses
- Host live sessions
- Track student performance
- Earn revenue

**For Companies:**
- Post job openings
- Find qualified candidates
- Review applications
- Hire talent

**For University Students:**
- Build professional profile
- Apply for internships/jobs
- Upload CV and portfolio
- Connect with companies

**For Parents:**
- Monitor children's progress
- View course enrollments
- Track learning activity
- Stay informed

**Code Structure:**
```tsx
export default function Features() {
  const features = [
    {
      title: "Online Learning",
      description: "Access courses anytime, anywhere",
      icon: "📚",
      userTypes: ["student"]
    },
    {
      title: "Live Classes",
      description: "Interactive real-time sessions",
      icon: "🎥",
      userTypes: ["student", "teacher"]
    },
    // ... more features
  ]

  return (
    <div className="container mx-auto">
      <h1>Platform Features</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map(feature => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </div>
  )
}
```

---

### 4. FAQ Page (`/faq`)
**File:** `/home/user/ACE/frontend/app/faq/page.tsx`

**What it does:**
- Answers common questions
- Reduces support requests
- Helps users understand platform policies

**Common Questions Covered:**

**General:**
- What is ACE platform?
- How do I create an account?
- Is the platform free?
- What devices are supported?

**For Students:**
- How do I enroll in a course?
- Can I get a refund?
- How do live classes work?
- Do I get certificates?

**For Teachers:**
- How do I become a teacher?
- What's the revenue share?
- How do I get paid?
- Can I create live courses?

**For Companies:**
- How do I post jobs?
- Is there a fee for posting?
- How do I review applications?
- Can I message candidates?

**For University Students:**
- What email domains are accepted?
- How do I upload my CV?
- How do companies find me?
- What types of jobs are available?

**Implementation:**
```tsx
export default function FAQ() {
  const [openQuestion, setOpenQuestion] = useState(null)

  const faqs = [
    {
      category: "General",
      questions: [
        {
          q: "What is ACE?",
          a: "ACE is an integrated platform for learning and career development..."
        },
        // more questions
      ]
    },
    // more categories
  ]

  return (
    <div className="container mx-auto">
      <h1>Frequently Asked Questions</h1>

      {faqs.map(category => (
        <div key={category.category}>
          <h2>{category.category}</h2>

          {category.questions.map((faq, index) => (
            <div
              key={index}
              onClick={() => setOpenQuestion(
                openQuestion === index ? null : index
              )}
              className="border-b py-4 cursor-pointer"
            >
              <h3>{faq.q}</h3>
              {openQuestion === index && (
                <p className="mt-2">{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
```

**Features:**
- Accordion-style Q&A (click to expand)
- Categorized by topic
- Search functionality (optional)
- Mobile-responsive

---

### 5. Contact Page (`/contact`)
**File:** `/home/user/ACE/frontend/app/contact/page.tsx`

**What it does:**
- Provides contact information
- Contact form for inquiries
- Links to social media
- Support email/phone

**Structure:**
```tsx
export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Could send to backend API
    // For now, might just show success message
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        alert('Message sent successfully!')
        setFormData({ name: '', email: '', subject: '', message: '' })
      }
    } catch (error) {
      alert('Failed to send message')
    }
  }

  return (
    <div className="container mx-auto grid md:grid-cols-2 gap-8">
      {/* Contact Form */}
      <div>
        <h1>Contact Us</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />

          <input
            type="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />

          <input
            type="text"
            placeholder="Subject"
            value={formData.subject}
            onChange={(e) => setFormData({...formData, subject: e.target.value})}
          />

          <textarea
            placeholder="Your Message"
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            rows={5}
            required
          />

          <button type="submit">Send Message</button>
        </form>
      </div>

      {/* Contact Information */}
      <div>
        <h2>Get in Touch</h2>

        <div className="space-y-4">
          <div>
            <h3>Email</h3>
            <p>support@ace-platform.com</p>
          </div>

          <div>
            <h3>Phone</h3>
            <p>+20 XXX XXX XXXX</p>
          </div>

          <div>
            <h3>Address</h3>
            <p>Cairo, Egypt</p>
          </div>

          <div>
            <h3>Social Media</h3>
            <div className="flex gap-4">
              <a href="#">Facebook</a>
              <a href="#">Twitter</a>
              <a href="#">LinkedIn</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

## Technical Implementation

### Styling Approach
All static pages use:
- **TailwindCSS** for styling
- Responsive design (mobile-first)
- Consistent color scheme
- Accessible components

**Common Classes:**
```css
/* Containers */
.container mx-auto px-4

/* Headings */
text-3xl md:text-5xl font-bold

/* Buttons */
bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700

/* Cards */
bg-white shadow-lg rounded-lg p-6
```

### Layout Structure
All pages share:
```tsx
<main>
  <Nav /> {/* Navigation bar at top */}

  <YourPageContent />

  <Footer /> {/* Footer at bottom */}
</main>
```

### Navigation Component
**File:** `/home/user/ACE/frontend/components/Nav/Nav.tsx`

Links shown to non-authenticated users:
- Home (`/`)
- About (`/about`)
- Features (`/features`)
- FAQ (`/faq`)
- Contact (`/contact`)
- Login (`/login`)
- Sign Up (`/signup`)

### SEO Optimization
Each page has proper metadata:
```tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About ACE - Academic Career Education',
  description: 'Learn about ACE platform...',
  keywords: 'education, learning, careers, jobs, courses'
}
```

---

## Testing Your Knowledge

### Questions You Should Be Able to Answer:

**1. What pages did you work on?**
- Home, About, Features, FAQ, Contact

**2. What is the purpose of the home page?**
- Landing page, first impression, encourage signup

**3. How does the FAQ page work?**
- Accordion-style expandable questions
- Categorized by topic
- Click to show/hide answers

**4. What information is on the features page?**
- Platform capabilities
- Features for each user type
- How different roles use ACE

**5. What can users do on the contact page?**
- Send messages via form
- Find contact information
- Access social media links

**6. What styling framework did you use?**
- TailwindCSS 4.0

**7. Is the contact form connected to backend?**
- Could be connected to `/api/contact` endpoint
- Sends user inquiries

**8. Who can access these pages?**
- Everyone (public pages, no authentication required)

**9. How do these pages help the platform?**
- Inform potential users
- Build trust and credibility
- Answer questions
- Convert visitors to users

**10. What happens when someone clicks "Get Started" on home page?**
- Redirects to `/signup` page

---

## Key Takeaways

✅ **Your Contribution:**
- Created the public face of ACE platform
- Built all marketing/informational pages
- Helped users understand platform value

✅ **Technologies Used:**
- Next.js 15.5 (React 19)
- TailwindCSS 4.0
- TypeScript
- Responsive design

✅ **Impact:**
- First impression for new users
- Reduces support questions (FAQ)
- Encourages signups (features showcase)
- Builds trust (about, contact)

---

## Files You're Responsible For

```
frontend/
├── app/
│   ├── page.tsx                  # Home page
│   ├── about/
│   │   └── page.tsx              # About page
│   ├── features/
│   │   └── page.tsx              # Features page
│   ├── faq/
│   │   └── page.tsx              # FAQ page
│   └── contact/
│       └── page.tsx              # Contact page
```

**Total:** 5 public-facing pages that introduce users to ACE platform.

---

## Flow Diagram

```
User visits ACE
    ↓
Lands on Home Page (/)
    ↓
Can navigate to:
    ├── About (/about) - Learn about platform
    ├── Features (/features) - See what's possible
    ├── FAQ (/faq) - Get questions answered
    ├── Contact (/contact) - Reach out
    ├── Login (/login) - Existing users
    └── Sign Up (/signup) - New users
```

Good luck with your presentation! 🚀
