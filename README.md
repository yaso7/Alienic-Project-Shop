# Alienic

<div align="center">

![Alienic Logo](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PFP-White-Yab1gmXrg4upN6ybuve3oAVG39odZF.png)

**A modern e-commerce platform for alternative art and fashion**

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.4.1-black?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.9-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

</div>

## 🌟 Overview

Alienic is a sophisticated e-commerce and portfolio platform built for showcasing and selling alternative art collections and products. The project features a modern, dark-themed interface with comprehensive admin management capabilities, customer testimonials, and seamless user experience.

## ✨ Features

### 🛍️ **E-Commerce**
- **Product Catalog**: Browse and filter products by category and collection
- **Collection Management**: Themed product collections with rich descriptions
- **Shopping Experience**: Modern, responsive design with smooth animations
- **Product Details**: Detailed product pages with stories and specifications

### 🎨 **Portfolio & Branding**
- **Hero Section**: Striking landing experience with animated backgrounds
- **Featured Collections**: Showcase highlighted collections on the homepage
- **Brand Philosophy**: Dedicated section for brand story and values
- **Instagram Integration**: Social media integration for community engagement

### 💬 **Community & Trust**
- **Testimonial System**: Customer reviews with admin moderation
- **Contact Forms**: Easy communication channels
- **Social Proof**: Approved customer testimonials displayed publicly

### 🛠️ **Admin Dashboard**
- **Secure Authentication**: Session-based admin login system
- **Collection Management**: Create, edit, and organize collections
- **Product Management**: Full CRUD operations for products
- **Testimonial Moderation**: Approve or manage customer reviews
- **Message Inbox**: Handle customer inquiries
- **Real-time Updates**: Live data synchronization

## 🚀 Tech Stack

### **Frontend**
- **Next.js 16.1.6** - React framework with App Router
- **React 19.2.4** - UI library
- **TypeScript 5.7.3** - Type-safe development
- **Tailwind CSS 4.1.9** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Framer Motion** - Animations and transitions

### **Backend & Database**
- **Prisma 7.4.1** - Database ORM
- **PostgreSQL** - Primary database
- **bcryptjs** - Password hashing
- **NextAuth.js** - Authentication (session-based)

### **Development Tools**
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **tsx** - TypeScript execution

## 📁 Project Structure

```
alienic/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard routes
│   ├── api/               # API endpoints
│   └── (pages)/           # Public pages
├── components/            # Reusable React components
│   ├── admin/            # Admin-specific components
│   ├── home/             # Homepage sections
│   ├── shop/             # E-commerce components
│   └── ui/               # Base UI components
├── lib/                  # Utility libraries
├── prisma/               # Database schema and migrations
├── public/               # Static assets
├── scripts/              # Database and utility scripts
└── styles/               # Global styles and fonts
```

## 🛠️ Installation & Setup

### **Prerequisites**
- Node.js 18+ 
- PostgreSQL database (local or cloud)
- Git

### **1. Clone & Install**
```bash
git clone https://github.com/yourusername/alienic.git
cd alienic
npm install
```

### **2. Environment Setup**
Create a `.env` file in the root directory:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/alienic"

# Session Security
SESSION_SECRET="your-super-secret-session-key"

# Optional: Analytics
VERCEL_ANALYTICS_ID="your-vercel-analytics-id"
```

### **3. Database Setup**
```bash
# Run database migrations
npm run db:migrate

# Generate Prisma Client
npm run db:generate

# Seed with sample data (optional)
npm run db:seed
```

### **4. Create Admin User**
```bash
# Create an admin account
npm run create-admin your-email@domain.com your-password
```

### **5. Start Development**
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🗄️ Database Schema

The application uses the following main models:

- **Collection** - Product collections with themes and descriptions
- **Product** - Individual products with categories and pricing
- **Testimonial** - Customer reviews with moderation status
- **ContactMessage** - Customer inquiries and messages
- **AdminUser** - Admin authentication and sessions

## 📚 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:migrate   # Run database migrations
npm run db:generate  # Generate Prisma Client
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database with sample data

# Admin
npm run create-admin # Create admin user
```

## 🔐 Security Features

- **Session-based Authentication** - Secure admin login with HTTP-only cookies
- **Password Hashing** - bcryptjs for secure password storage
- **Protected Routes** - Admin-only routes with middleware protection
- **Input Validation** - Zod schema validation for API endpoints
- **CSRF Protection** - Built-in Next.js security features

## 🌐 Deployment

### **Vercel (Recommended)**
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

### **Docker**
```dockerfile
# Add your Docker configuration here
```

### **Manual Deployment**
```bash
npm run build
npm run start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Radix UI** - For accessible component primitives
- **Tailwind CSS** - For the utility-first CSS framework
- **Prisma** - For the excellent database toolkit
- **Vercel** - For the hosting platform

## 📞 Support

For support, please contact:
- Email: support@alienic.com
- GitHub Issues: [Create an issue](https://github.com/yourusername/alienic/issues)

---

<div align="center">

**Built with ❤️ for the alternative art community**

[![Website](https://img.shields.io/badge/website-live-brightgreen?style=flat-square)](https://alienic.com)
[![Documentation](https://img.shields.io/badge/docs-latest-blue?style=flat-square)](./docs)

</div>
