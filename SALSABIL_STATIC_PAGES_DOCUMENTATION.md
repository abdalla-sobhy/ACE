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

## Technical Deep Dive

### 1. Next.js App Router Architecture

**File Structure Explanation:**
```
app/
├── page.tsx              # Maps to "/"
├── about/
│   └── page.tsx          # Maps to "/about"
├── features/
│   └── page.tsx          # Maps to "/features"
└── layout.tsx            # Root layout wrapping all pages
```

**How it works:**
- Next.js uses **file-system based routing**
- Each `page.tsx` becomes a route automatically
- The folder name = URL path
- `layout.tsx` wraps all child pages (for Nav, Footer, etc.)

**Server Components vs Client Components:**
- By default, all components in App Router are **Server Components**
- Server Components: Rendered on server, no JavaScript sent to client
- Client Components: Need `'use client'` directive at top
- FAQ page uses `'use client'` because it needs `useState` for accordion

**Why this matters:**
- Server Components = faster initial load, better SEO
- Client Components = needed for interactivity (onClick, state)
- Static pages like About/Features can be Server Components
- FAQ/Contact need Client Components for forms/state

---

### 2. React Hooks Deep Dive

**useState Hook (FAQ Page):**
```tsx
const [openQuestion, setOpenQuestion] = useState(null)
```

**How it works:**
- `openQuestion` = current state (which question is open)
- `setOpenQuestion` = function to update state
- `null` = initial value (no question open)
- When state changes, React re-renders component

**Why use it:**
- Need to track which FAQ is expanded
- Clicking a question updates state
- Re-render shows/hides answer

**Example flow:**
```
User clicks question #2
  ↓
onClick={() => setOpenQuestion(2)}
  ↓
openQuestion changes from null → 2
  ↓
React re-renders
  ↓
{openQuestion === 2 && <p>Answer</p>} now shows
```

**Contact Form State:**
```tsx
const [formData, setFormData] = useState({
  name: '',
  email: '',
  subject: '',
  message: ''
})

// Update single field
setFormData({...formData, name: e.target.value})
```

**Spread operator (`...`):**
- `...formData` = copy all existing fields
- Then override just the `name` field
- Keeps other fields unchanged

---

### 3. Form Handling

**Controlled Components:**
```tsx
<input
  value={formData.email}
  onChange={(e) => setFormData({...formData, email: e.target.value})}
/>
```

**What "controlled" means:**
- React state is the "single source of truth"
- Input value comes FROM state
- Input changes UPDATE state
- Two-way data binding

**Form Submission:**
```tsx
const handleSubmit = async (e) => {
  e.preventDefault()  // Stop default form behavior (page refresh)

  // Send data to API
  await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  })
}
```

**Why `e.preventDefault()`:**
- Default form submit = page refresh
- We want to stay on page and use JavaScript to submit
- SPA (Single Page Application) behavior

---

### 4. TailwindCSS Utility Classes

**Responsive Design:**
```tsx
className="grid grid-cols-1 md:grid-cols-3 gap-6"
```

**Breakdown:**
- `grid` = display: grid
- `grid-cols-1` = 1 column on mobile
- `md:grid-cols-3` = 3 columns on medium screens (768px+)
- `gap-6` = spacing between items

**Responsive prefixes:**
- (no prefix) = mobile (default)
- `sm:` = 640px and up
- `md:` = 768px and up
- `lg:` = 1024px and up
- `xl:` = 1280px and up

**Hover States:**
```tsx
className="bg-blue-600 hover:bg-blue-700"
```
- Normal state: blue-600
- On hover: blue-700 (darker)

**Utility-first approach:**
- No custom CSS files needed
- Styles applied directly in JSX
- Highly reusable
- Smaller bundle size (only used classes shipped)

---

### 5. SEO and Metadata

**Metadata Export:**
```tsx
export const metadata: Metadata = {
  title: 'About ACE - Academic Career Education',
  description: 'Learn about ACE platform...',
  keywords: 'education, learning, careers',
  openGraph: {
    title: 'About ACE',
    description: 'Learn about ACE platform',
    images: ['/og-image.png']
  }
}
```

**Why it matters:**
- `title` = shows in browser tab, Google search results
- `description` = shows in search results preview
- `keywords` = helps search engines categorize page
- `openGraph` = social media previews (Facebook, Twitter)

**Server-side rendering benefits:**
- Content rendered on server = search engines can read it
- Client-side JS not needed for SEO
- Faster First Contentful Paint (FCP)

---

### 6. Component Reusability

**DRY Principle (Don't Repeat Yourself):**

Instead of repeating card HTML:
```tsx
// ❌ Bad - repetitive
<div className="card">
  <h3>Feature 1</h3>
  <p>Description</p>
</div>
<div className="card">
  <h3>Feature 2</h3>
  <p>Description</p>
</div>
```

Create reusable component:
```tsx
// ✅ Good - reusable
function FeatureCard({ title, description, icon }) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

// Use it
{features.map(feature => (
  <FeatureCard key={feature.title} {...feature} />
))}
```

**Props spreading (`{...feature}`):**
- Passes all object properties as props
- `{...feature}` = same as `title={feature.title} description={feature.description} icon={feature.icon}`

---

### 7. Performance Optimization

**Image Optimization:**
```tsx
import Image from 'next/image'

<Image
  src="/hero-image.jpg"
  width={800}
  height={600}
  alt="ACE Platform"
  priority  // Load this image first
/>
```

**Next.js Image benefits:**
- Automatic lazy loading (images load as user scrolls)
- Automatic format conversion (WebP, AVIF)
- Automatic sizing (responsive images)
- Prevents Cumulative Layout Shift (CLS)

**Code Splitting:**
- Next.js automatically splits code per route
- `/about` page only loads About page code
- `/features` page only loads Features code
- Smaller initial bundle = faster page load

**Static Site Generation (SSG):**
```tsx
// At build time, Next.js generates static HTML
export default function About() {
  return <div>Static content</div>
}
```

- Pages built once at deploy time
- Served as static HTML (super fast)
- No server rendering on each request
- Perfect for static pages like About, Features

---

### 8. Accessibility (a11y)

**Semantic HTML:**
```tsx
// ✅ Good - semantic
<nav>
  <ul>
    <li><a href="/">Home</a></li>
  </ul>
</nav>

// ❌ Bad - divs everywhere
<div className="nav">
  <div><div onClick={...}>Home</div></div>
</div>
```

**Why semantic matters:**
- Screen readers understand structure
- Better SEO
- Keyboard navigation works properly

**ARIA Labels:**
```tsx
<button aria-label="Close menu" onClick={closeMenu}>
  ✕
</button>
```
- Screen readers announce "Close menu button"
- Important when button has only icon, no text

**Form Accessibility:**
```tsx
<label htmlFor="email">Email Address</label>
<input id="email" type="email" name="email" />
```
- `htmlFor` connects label to input
- Clicking label focuses input
- Screen readers read label when input is focused

**Keyboard Navigation:**
- All interactive elements should be reachable via Tab
- Enter/Space should activate buttons/links
- Escape should close modals/dropdowns

---

### 9. TypeScript Types

**Props Interface:**
```tsx
interface FeatureCardProps {
  title: string
  description: string
  icon: string
  userTypes?: string[]  // Optional
}

function FeatureCard({ title, description, icon, userTypes }: FeatureCardProps) {
  // TypeScript ensures correct types
}
```

**Benefits:**
- Catch errors at compile time
- Autocomplete in IDE
- Self-documenting code
- Refactoring confidence

**State Typing:**
```tsx
interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

const [formData, setFormData] = useState<FormData>({
  name: '',
  email: '',
  subject: '',
  message: ''
})
```

---

### 10. Error Handling

**Form Validation:**
```tsx
const [errors, setErrors] = useState<{[key: string]: string}>({})

const validateForm = () => {
  const newErrors: {[key: string]: string} = {}

  if (!formData.name) {
    newErrors.name = 'Name is required'
  }

  if (!formData.email.includes('@')) {
    newErrors.email = 'Invalid email format'
  }

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

const handleSubmit = async (e) => {
  e.preventDefault()

  if (!validateForm()) {
    return  // Don't submit if validation fails
  }

  try {
    await fetch('/api/contact', {...})
  } catch (error) {
    setErrors({ general: 'Failed to send message' })
  }
}
```

**Try-Catch Pattern:**
- Wrap risky code in `try`
- If error occurs, `catch` runs
- Prevents app from crashing
- Show user-friendly error messages

---

## Technical Interview Questions (50+ Questions)

### Next.js Fundamentals (15 questions)

**1. What is Next.js and why use it over plain React?**
- Next.js is a React framework with built-in routing, SSR, SSG
- Benefits: File-based routing, automatic code splitting, image optimization, SEO

**2. Explain the App Router vs Pages Router in Next.js.**
- App Router: New (Next.js 13+), uses `app/` directory, Server Components by default
- Pages Router: Old, uses `pages/` directory, all components are client components

**3. What is the difference between a Server Component and Client Component?**
- Server: Rendered on server, no JS sent to client, can't use hooks/state
- Client: Rendered on client, needs `'use client'`, can use hooks/state

**4. When would you use `'use client'` directive?**
- When you need interactivity (onClick, onChange)
- When you need React hooks (useState, useEffect)
- When you need browser APIs (window, localStorage)

**5. How does file-based routing work in Next.js App Router?**
- Folder names = URL paths
- `page.tsx` inside folder = route component
- Example: `app/about/page.tsx` = `/about` route

**6. What is the purpose of `layout.tsx`?**
- Wraps all child pages
- Shared UI (Nav, Footer)
- Persists between route changes
- Can have nested layouts

**7. What is Static Site Generation (SSG)?**
- Pages generated at build time
- Served as static HTML
- Super fast, great for SEO
- Perfect for content that doesn't change often

**8. What is Server-Side Rendering (SSR)?**
- Pages generated on each request
- Fresh data on every load
- Slower than SSG but more dynamic

**9. What is the benefit of automatic code splitting?**
- Each route only loads its own code
- Smaller initial bundle
- Faster page loads
- Better performance

**10. How do you add metadata for SEO in Next.js?**
- Export `metadata` object from page component
- Include title, description, keywords
- Can be static or dynamic

**11. What is the Next.js Image component and its benefits?**
- Optimizes images automatically
- Lazy loading by default
- Format conversion (WebP, AVIF)
- Prevents layout shift

**12. How does Next.js handle routing between pages?**
- Use `<Link>` component from `next/link`
- Client-side navigation (no full page reload)
- Prefetches linked pages on hover

**13. What is the difference between `Link` and `<a>` tag?**
- `Link`: Client-side navigation, faster, prefetching
- `<a>`: Full page reload, slower

**14. How do you navigate programmatically in Next.js?**
- Use `useRouter` hook: `const router = useRouter(); router.push('/path')`
- Or use `<Link>` component

**15. What is Turbopack and how does it help?**
- Next.js's new bundler (faster than Webpack)
- Faster dev server startup
- Faster hot reloads
- Better performance in development

---

### React Fundamentals (15 questions)

**16. What is JSX?**
- JavaScript XML syntax
- Allows writing HTML-like code in JavaScript
- Gets compiled to `React.createElement()` calls

**17. Explain the useState hook with an example.**
```tsx
const [count, setCount] = useState(0)
// count = current value
// setCount = function to update
// 0 = initial value
```

**18. What happens when you call a setState function?**
- State updates (asynchronously)
- Component re-renders
- UI updates to reflect new state

**19. Why do we need keys in list rendering?**
```tsx
{items.map(item => <div key={item.id}>{item.name}</div>)}
```
- Helps React identify which items changed
- Improves performance
- Prevents bugs with component state

**20. What is the virtual DOM?**
- In-memory representation of real DOM
- React compares old vs new virtual DOM
- Only updates changed parts in real DOM
- Faster than manipulating real DOM directly

**21. Explain controlled vs uncontrolled components.**
- Controlled: React state controls input value
- Uncontrolled: DOM controls input value (use refs)
- Controlled is preferred (single source of truth)

**22. What is the spread operator and how is it used?**
```tsx
setFormData({...formData, name: 'New'})
// Copies all properties, then overrides 'name'
```

**23. What is props drilling and how to avoid it?**
- Passing props through many levels
- Avoid with: Context API, state management libraries
- Not an issue in these simple static pages

**24. What is the children prop?**
```tsx
function Card({ children }) {
  return <div className="card">{children}</div>
}

<Card>Any content here</Card>
```

**25. Explain the map() function in React.**
```tsx
{features.map(f => <FeatureCard {...f} />)}
```
- Transforms array into JSX elements
- Returns new array
- Each element should have unique key

**26. What is the difference between onClick and onClick()?**
- `onClick={handleClick}` → passes function reference (correct)
- `onClick={handleClick()}` → calls function immediately (wrong)

**27. What does e.preventDefault() do?**
- Stops default browser behavior
- Example: form submit doesn't refresh page
- Link click doesn't navigate

**28. What is React.Fragment and when to use it?**
```tsx
<>
  <div>Item 1</div>
  <div>Item 2</div>
</>
```
- Groups elements without adding extra DOM node
- Use `<>` shorthand

**29. What are pure components?**
- Same props = same output
- No side effects
- Easier to test and optimize

**30. What is component composition?**
- Building complex UI from smaller components
- Example: Page → Section → Card → Button
- Reusability and maintainability

---

### TailwindCSS (10 questions)

**31. What is TailwindCSS?**
- Utility-first CSS framework
- Pre-defined classes for common styles
- No custom CSS needed
- Highly customizable

**32. What does "utility-first" mean?**
- Small, single-purpose classes
- Compose classes to build designs
- Example: `flex items-center justify-between`

**33. Explain the responsive design approach in Tailwind.**
```tsx
className="text-sm md:text-lg lg:text-xl"
```
- Mobile-first by default
- Add prefixes for larger screens
- sm: (640px), md: (768px), lg: (1024px), xl: (1280px)

**34. How do hover states work?**
```tsx
className="bg-blue-600 hover:bg-blue-700"
```
- `hover:` prefix applies on mouse hover
- Also: `focus:`, `active:`, `disabled:`

**35. What is the purpose of the container class?**
```tsx
<div className="container mx-auto">
```
- Max-width responsive container
- `mx-auto` centers it horizontally
- Common pattern for page layouts

**36. Explain the spacing scale (p-4, m-6, etc.).**
- Numbers = multiples of 0.25rem (4px)
- `p-4` = padding: 1rem (16px)
- `m-6` = margin: 1.5rem (24px)
- Consistent spacing across app

**37. What is the difference between px-4 and p-4?**
- `p-4` = padding on all sides
- `px-4` = padding left and right (x-axis)
- `py-4` = padding top and bottom (y-axis)
- `pt-4` = padding top only

**38. How do you create a flexbox layout?**
```tsx
<div className="flex items-center justify-between gap-4">
```
- `flex` = display: flex
- `items-center` = align items vertically center
- `justify-between` = space items evenly
- `gap-4` = spacing between items

**39. What is the grid system in Tailwind?**
```tsx
<div className="grid grid-cols-3 gap-6">
```
- `grid` = display: grid
- `grid-cols-3` = 3 equal columns
- `gap-6` = spacing between grid items

**40. How does dark mode work in Tailwind?**
```tsx
<div className="bg-white dark:bg-gray-900">
```
- `dark:` prefix for dark mode styles
- Configured in tailwind.config.js
- Can use class or media query strategy

---

### Forms & Validation (10 questions)

**41. What is a controlled input in React?**
```tsx
<input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
```
- Value comes from state
- onChange updates state
- React controls the input

**42. How do you handle form submission?**
```tsx
<form onSubmit={handleSubmit}>
const handleSubmit = (e) => {
  e.preventDefault()
  // Handle submission
}
```

**43. Why use e.preventDefault() on form submit?**
- Prevents default form behavior (page refresh)
- Allows JavaScript to handle submission
- Stays on same page (SPA behavior)

**44. How do you validate form data?**
```tsx
if (!email.includes('@')) {
  setErrors({email: 'Invalid email'})
}
```
- Check field values before submission
- Set error state for invalid fields
- Display error messages to user

**45. What is the difference between controlled and uncontrolled forms?**
- Controlled: State manages values, more control, recommended
- Uncontrolled: Use refs to get values, less React-ish

**46. How do you clear a form after submission?**
```tsx
setFormData({ name: '', email: '', message: '' })
```
- Reset state to initial values
- Inputs update because they're controlled

**47. How do you handle multiple input fields efficiently?**
```tsx
const handleChange = (e) => {
  const { name, value } = e.target
  setFormData({...formData, [name]: value})
}

<input name="email" onChange={handleChange} />
```
- Use input `name` attribute
- Generic handler for all fields
- Computed property names: `[name]`

**48. What HTML5 validations can you use?**
- `required` attribute
- `type="email"` (email format)
- `minLength`, `maxLength`
- `pattern` (regex validation)

**49. How do you show validation errors?**
```tsx
{errors.email && <p className="text-red-600">{errors.email}</p>}
```
- Conditional rendering
- Show error only if it exists

**50. What is the async/await pattern for form submission?**
```tsx
const handleSubmit = async (e) => {
  e.preventDefault()
  try {
    const response = await fetch('/api/contact', {...})
    if (response.ok) {
      // Success
    }
  } catch (error) {
    // Error handling
  }
}
```
- `async` makes function return Promise
- `await` waits for Promise to resolve
- try/catch for error handling

---

### Performance & Best Practices (10 questions)

**51. Why should you avoid inline functions in JSX?**
```tsx
// ❌ Bad - creates new function on every render
<button onClick={() => handleClick()}>

// ✅ Good - reuses same function
<button onClick={handleClick}>
```

**52. What is the key prop and why is it important?**
- Unique identifier for list items
- Helps React track changes efficiently
- Should be stable (not array index if list changes)

**53. How does lazy loading improve performance?**
- Components/images load only when needed
- Smaller initial bundle
- Faster initial page load
- Next.js Image does this automatically

**54. What is memoization and when to use it?**
```tsx
const memoizedValue = useMemo(() => expensiveCalc(), [deps])
```
- Caches expensive computations
- Only recalculates when dependencies change
- Use sparingly (premature optimization)

**55. What is code splitting?**
- Breaking app into smaller chunks
- Load code on demand
- Next.js does this automatically per route

**56. How do you optimize images for web?**
- Use Next.js Image component
- Compress images before upload
- Use modern formats (WebP, AVIF)
- Lazy load images

**57. What is the purpose of semantic HTML?**
- Better accessibility (screen readers)
- Better SEO (search engines)
- More maintainable code
- Examples: `<nav>`, `<main>`, `<article>`

**58. How do you make a site accessible?**
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Sufficient color contrast
- Alt text on images

**59. What are environment variables and how to use them?**
```tsx
const apiUrl = process.env.NEXT_PUBLIC_API_URL
```
- Store configuration (API URLs, keys)
- Different values per environment (dev, prod)
- `NEXT_PUBLIC_` prefix for client-side access

**60. What is the difference between development and production builds?**
- Development: Fast rebuilds, helpful errors, larger bundle
- Production: Optimized, minified, smaller bundle, no source maps

---

## Quick Reference

### Common Patterns You Should Know

**1. Mapping over array:**
```tsx
{items.map(item => <Component key={item.id} {...item} />)}
```

**2. Conditional rendering:**
```tsx
{isOpen && <Modal />}
{status === 'success' ? <Success /> : <Error />}
```

**3. Form handling:**
```tsx
const [data, setData] = useState({})
<input value={data.field} onChange={e => setData({...data, field: e.target.value})} />
```

**4. Async API call:**
```tsx
const response = await fetch('/api/endpoint', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
})
```

**5. Error handling:**
```tsx
try {
  await someAsyncOperation()
} catch (error) {
  setError(error.message)
}
```

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
