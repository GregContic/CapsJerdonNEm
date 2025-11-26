# Hrvst - Farmer Management System

A Laravel + React application for managing farmer information, crop data, and location tracking in the Benguet region.

## Requirements

- PHP 8.2 or higher
- Composer
- Node.js 16+ and npm
- SQLite (or MySQL/PostgreSQL)

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/GregContic/CapsJerdonNEm.git
cd CapsJerdonNEm
```

### 2. Install PHP Dependencies

```bash
composer install
```

**Note:** If you encounter PHP version issues with testing packages, run:
```bash
composer update
```

### 3. Set Up Environment File

```bash
copy .env.example .env
```

### 4. Generate Application Key

```bash
php artisan key:generate
```

### 5. Create Database

For SQLite (default):
```bash
New-Item -ItemType File -Path "database\database.sqlite" -Force
```

Or update `.env` for MySQL/PostgreSQL:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### 6. Run Database Migrations

```bash
php artisan migrate
```

### 7. (Optional) Seed the Database

```bash
php artisan db:seed
```

This will populate:
- Municipalities
- Barangays
- Sitios
- Crop categories and crops

### 8. Install Frontend Dependencies

```bash
npm install
```

### 9. Build Frontend Assets

For production:
```bash
npm run build
```

For development with hot reload:
```bash
npm run dev
```

### 10. Start the Application

#### Option A: Using Composer Script (Recommended)

```bash
composer dev
```

This will start:
- Laravel development server (http://127.0.0.1:8000)
- Queue worker
- Vite development server with hot module replacement

#### Option B: Manual Start

Open three separate terminals:

**Terminal 1 - Laravel Server:**
```bash
php artisan serve
```

**Terminal 2 - Queue Worker:**
```bash
php artisan queue:listen --tries=1
```

**Terminal 3 - Vite Dev Server:**
```bash
npm run dev
```

## Access the Application

- **Web Application:** http://127.0.0.1:8000
- **Vite Dev Server:** http://localhost:5173

## Default User Roles

The application has two user types:

1. **Admin Users**
   - Can approve farmer registrations
   - Manage crops and categories
   - View all farmers

2. **Farmer Users**
   - Must register and await admin approval
   - Can view crop prices
   - Can manage their profile

## Features

- **User Authentication** with Laravel Fortify
- **Farmer Registration** with location verification (GPS coordinates)
- **Municipality/Barangay/Sitio** hierarchical location selection
- **Crop Management** (Admin only)
- **Farmer Approval System** (Admin only)
- **Responsive UI** with React and Tailwind CSS

## Project Structure

```
├── app/
│   ├── Http/Controllers/      # Application controllers
│   ├── Models/                # Eloquent models
│   └── Providers/             # Service providers
├── database/
│   ├── migrations/            # Database migrations
│   ├── seeders/              # Database seeders
│   └── factories/            # Model factories
├── resources/
│   ├── js/
│   │   ├── Pages/            # React page components
│   │   ├── Components/       # Reusable React components
│   │   └── Layouts/          # Layout components
│   └── css/                  # Stylesheets
├── routes/
│   ├── web.php              # Web routes
│   ├── api.php              # API routes
│   └── auth.php             # Authentication routes
└── public/                   # Public assets
```

## Development Commands

### Run Tests
```bash
composer test
# or
php artisan test
```

### Code Formatting
```bash
composer format          # Format code with Pint
npm run format          # Format frontend with Prettier
```

### Linting
```bash
npm run lint            # Lint JavaScript/React code
```

### Clear Caches
```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

## Troubleshooting

### Port Already in Use
If port 8000 is already in use:
```bash
php artisan serve --port=8001
```

### Permission Issues (Linux/Mac)
```bash
chmod -R 775 storage bootstrap/cache
```

### Frontend Not Hot Reloading
- Ensure Vite dev server is running (`npm run dev`)
- Check that `APP_URL` in `.env` matches your local URL

### Database Connection Issues
- Verify database file exists: `database/database.sqlite`
- Check `.env` database configuration
- Ensure database path is absolute

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues or questions, please open an issue on GitHub or contact the development team.
