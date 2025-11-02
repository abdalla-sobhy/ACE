# ACE Platform Setup Guide

## Prerequisites

- PHP 8.1 or higher
- Composer
- Node.js 18+ and npm
- MySQL/MariaDB
- Git

## Backend Setup (Laravel)

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install PHP dependencies:**
   ```bash
   composer install
   ```

3. **Copy environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Generate application key:**
   ```bash
   php artisan key:generate
   ```

5. **Configure database in `.env`:**
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=ace_db
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```

6. **Run database migrations:**
   ```bash
   php artisan migrate
   ```

7. **Seed database (optional):**
   ```bash
   php artisan db:seed
   ```

8. **Create storage symlink (IMPORTANT for file uploads):**
   ```bash
   php artisan storage:link
   ```
   This creates a symbolic link from `public/storage` to `storage/app/public` to make uploaded files accessible via web.

9. **Start the development server:**
   ```bash
   php artisan serve
   ```
   Backend will run at: `http://localhost:8000`

## Frontend Setup (Next.js)

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install Node dependencies:**
   ```bash
   npm install
   ```

3. **Copy environment file:**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure environment variables in `.env.local`:**
   ```env
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```
   Frontend will run at: `http://localhost:3000`

## Common Issues

### Images Not Displaying

If uploaded images (company logos, course thumbnails, etc.) are not displaying:

1. **Verify storage symlink exists:**
   ```bash
   ls -la backend/public/storage
   ```
   Should show a symlink pointing to `../storage/app/public`

2. **If symlink is missing, recreate it:**
   ```bash
   cd backend
   php artisan storage:link
   ```

3. **Verify directory permissions:**
   ```bash
   chmod -R 775 backend/storage
   chmod -R 775 backend/bootstrap/cache
   ```

### CORS Issues

If you encounter CORS errors:

1. Check `backend/config/cors.php` configuration
2. Ensure `FRONTEND_URL` is set correctly in backend `.env`
3. Clear config cache: `php artisan config:clear`

### Database Connection Issues

1. Verify MySQL/MariaDB is running
2. Check database credentials in `.env`
3. Ensure database exists: `CREATE DATABASE ace_db;`
4. Test connection: `php artisan migrate:status`

## Production Deployment

### Backend

1. Set `APP_ENV=production` in `.env`
2. Set `APP_DEBUG=false` in `.env`
3. Run: `php artisan config:cache`
4. Run: `php artisan route:cache`
5. Run: `php artisan storage:link`
6. Configure web server (Apache/Nginx) to point to `public/` directory

### Frontend

1. Build the production bundle:
   ```bash
   npm run build
   ```

2. Start production server:
   ```bash
   npm start
   ```

## Support

For issues or questions, please check the documentation or create an issue in the repository.
