# Admin Dashboard Setup Guide

This guide will help you set up the backend admin dashboard for your Alienic Project website.

## Prerequisites

- Node.js installed
- A PostgreSQL database (local or cloud)

## Setup Steps

### 1. Database Setup

1. **Set up your PostgreSQL database**:
   - Local: Use `npx prisma dev` to run a local Postgres instance
   - Cloud: Create a database on Neon, Supabase, Railway, or any PostgreSQL provider
   - Update the `DATABASE_URL` in your `.env` file

2. **Run migrations**:
   ```bash
   npm run db:migrate
   ```

3. **Generate Prisma Client**:
   ```bash
   npm run db:generate
   ```

### 2. Seed the Database (Optional but Recommended)

Populate your database with sample data including collections, products, testimonials, and an admin user:

```bash
npm run db:seed
```

This will create:
- Admin user: `satanson78@gmail.com` / password: `admin`
- 4 Collections (Oxidized Relics, Void Geometry, Matte Shadows, Stellar Fragments)
- 8 Products across different categories
- 8 Testimonials (6 approved, 2 pending for moderation)
- 3 Sample contact messages

**Note:** The seed script will delete all existing data before seeding. If you want to keep existing data, modify the seed script.

### 2a. Create Additional Admin Users (Optional)

If you need to create additional admin users:

```bash
npm run create-admin <your-email> <your-password>
```

Example:
```bash
npm run create-admin admin@alienicbrand.com mySecurePassword123
```

### 3. Start the Development Server

```bash
npm run dev
```

### 4. Access the Admin Dashboard

Navigate to: `http://localhost:3000/admin-login`

Use the credentials you created in step 2 to log in.

## Admin Dashboard Features

### Collections Management (`/admin/collections`)
- Create, edit, and delete collections
- Collections are displayed on the public Projects page
- Fields: title, slug, subtitle, description, mood tags, hero image, order

### Products Management (`/admin/products`)
- Create, edit, and delete products
- Products are displayed in the Shop
- Fields: name, slug, category, price, material, collection, story, image
- Toggle featured status and availability

### Testimonials Management (`/admin/testimonials`)
- View all submitted reviews/testimonials
- Approve or reject testimonials
- Only approved testimonials appear on the public testimonials page

### Messages Inbox (`/admin/messages`)
- View all contact form submissions
- Mark messages as read or archived
- View full message details

## Database Schema

The following models are available:

- **Collection**: Collections/projects displayed on the Projects page
- **Product**: Products displayed in the Shop
- **Testimonial**: Reviews/testimonials submitted by visitors
- **ContactMessage**: Contact form submissions
- **AdminUser**: Admin authentication

## API Endpoints

### Public Endpoints
- `POST /api/testimonials` - Submit a testimonial/review
- `POST /api/contact` - Submit a contact message

### Admin Endpoints (Protected)
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `POST /api/admin/collections/[id]` - Delete collection
- `PATCH /api/admin/testimonials/[id]` - Update testimonial status
- `PATCH /api/admin/messages/[id]` - Update message status
- `POST /api/admin/products/[id]` - Delete product

## Frontend Integration

The following public pages now pull data from the database:

- `/projects` - Displays collections from the database
- `/shop` - Displays products from the database (only available products)
- `/testimonials` - Displays approved testimonials from the database

Forms are connected:
- Contact form (`/contact`) submits to the database
- Review form (`/testimonials`) submits to the database

## Security Notes

- Admin routes are protected and require authentication
- Passwords are hashed using bcrypt
- Sessions are stored in HTTP-only cookies
- Update `SESSION_SECRET` in your `.env` for production

## Troubleshooting

### Database Connection Issues
- Verify your `DATABASE_URL` in `.env` is correct
- Ensure your database server is running
- Check that migrations have been run

### Admin Login Not Working
- Ensure you've created an admin user using the script
- Check that the database connection is working
- Verify the admin user exists in the database

### Prisma Client Errors
- Run `npm run db:generate` after schema changes
- Restart your dev server after generating Prisma Client

## Next Steps

1. Set up your production database
2. Update environment variables for production
3. Create your first collections and products
4. Customize the admin dashboard styling if needed
