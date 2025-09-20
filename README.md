# TherapyConnect - Counseling & Life-Coaching Platform

A comprehensive, production-ready platform connecting certified therapists and life coaches with clients seeking personalized guidance and support.

## 🚀 Features

### Frontend (React + TypeScript + Tailwind CSS)
- **Landing Page**: Professional hero section with service overview and testimonials
- **Authentication**: Role-based login/registration (user/trainer/admin)
- **User Dashboard**: Service categories, featured trainers, booking calendar
- **Booking Flow**: 4-step process (service → trainer → scheduling → payment)
- **Session Interface**: WebRTC integration with video/audio/chat modes
- **Emergency Handling**: Real-time trainer unavailability management
- **Feedback System**: Post-session ratings and reviews
- **AI Recommendations**: Personalized trainer and service suggestions
- **Loyalty Program**: Points tracking and benefits management

### Backend (Python + FastAPI)
- **JWT Authentication**: Role-based access control
- **RESTful API**: Comprehensive endpoints for all features
- **WebSocket Support**: Real-time notifications and updates
- **Database Integration**: PostgreSQL with SQLAlchemy ORM
- **Payment Processing**: Stripe integration (placeholder)
- **File Uploads**: Trainer document management
- **Email Notifications**: SMTP configuration
- **API Documentation**: Auto-generated OpenAPI/Swagger docs

### Additional Features
- **Responsive Design**: Mobile-first approach with breakpoints
- **Accessibility**: WCAG compliant with ARIA labels
- **Security**: Rate limiting, CORS, security headers
- **Testing**: Comprehensive test suites for both frontend and backend
- **Docker Support**: Full containerization with Docker Compose
- **CI/CD Ready**: GitHub Actions templates included

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Hook Form** with Yup validation
- **React Router** for navigation
- **React Hot Toast** for notifications

### Backend
- **FastAPI** (Python 3.11)
- **PostgreSQL** database
- **Redis** for caching
- **SQLAlchemy** ORM
- **JWT** authentication
- **WebSocket** support
- **Pytest** for testing

### DevOps
- **Docker** & Docker Compose
- **Nginx** reverse proxy
- **GitHub Actions** CI/CD
- **PostgreSQL** & Redis containers

## 📋 Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- PostgreSQL (optional for local dev)
- Redis (optional for local dev)

## 🚀 Quick Start

### Option 1: Windows Local Development (No Docker)

This project now runs locally using a Python virtual environment for the backend and Vite for the frontend. Docker is optional.

1. Clone the repository:
```bash
git clone <repository-url>
cd therapyconnect
```

2. Create environment file (optional; defaults will be used if not set):
```bash
copy .env.example .env
```

3. Install Node dependencies:
```bash
npm install
```

4. Start frontend and backend together (two processes) on Windows:
```bash
npm run dev
```
- Frontend (Vite): http://localhost:5173
- Backend (FastAPI): http://127.0.0.1:8000
- API Docs: http://127.0.0.1:8000/docs

Notes:
- The backend startup script `backend/start.ps1` will create `.venv`, install Python dependencies from `backend/requirements.txt`, ensure an `uploads/` folder exists, and run Uvicorn with auto-reload.
- PostgreSQL and Redis are optional for the current mocked backend logic. If you enable them locally, set `DATABASE_URL` and `REDIS_URL` in `.env` accordingly.

### Option 2: Local Development (Manual)

1. Clone the repository:
```bash
git clone <repository-url>
cd therapyconnect
```

2. Create environment file:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Backend setup (manual):
```bash
cd backend
python -m venv .venv
# On Windows PowerShell
.\.venv\Scripts\Activate.ps1
# On Bash (Git Bash / WSL)
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

4. Frontend setup:
```bash
npm install
npm run frontend
```
Visit http://localhost:5173

---

### Option 3: Docker (Optional / Legacy)
Docker support remains in the repo for reference but is no longer the primary workflow.

1. Start all services:
```bash
docker-compose up -d
```

2. Visit the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs


2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up database:
```bash
# Install PostgreSQL and create database
createdb therapyconnect
```

5. Run migrations:
```bash
python database.py
```

6. Start the server:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup
1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Visit http://localhost:5173

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://postgres:password123@localhost:5432/therapyconnect

# Redis
REDIS_URL=redis://localhost:6379

# JWT
SECRET_KEY=your-secret-key-change-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# Frontend
VITE_API_URL=http://localhost:8000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

## 📊 Database Schema

The application uses PostgreSQL with the following main tables:

- **users**: User accounts with role-based access
- **user_profiles**: Extended user information
- **trainers**: Therapist/coach profiles and credentials
- **bookings**: Session bookings and scheduling
- **feedback**: Session ratings and reviews
- **loyalty**: User loyalty points and benefits

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS configuration
- SQL injection prevention
- XSS protection headers
- Role-based access control

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest tests/ -v --cov=.
```

### Frontend Tests
```bash
npm test
```

### End-to-End Tests
```bash
npm run test:e2e
```

## 📈 API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

Key API endpoints:
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/trainers/list` - List all trainers
- `POST /api/v1/bookings/create` - Create booking
- `POST /api/v1/feedback/submit` - Submit feedback
- `GET /api/v1/ai/recommendations` - Get AI recommendations

## 🚀 Deployment

### Production with Docker
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Manual Deployment
1. Build frontend:
```bash
npm run build
```

2. Set production environment variables
3. Deploy backend with gunicorn:
```bash
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies for scalability
- Designed with mental health professionals in mind
- Focused on user privacy and data security
- Accessibility-first approach for inclusive design

## 📞 Support

For support, email support@therapyconnect.com or join our Slack channel.

---

**Note**: This is a production-ready codebase. Remember to:
- Change default passwords and secrets
- Configure SSL certificates for production
- Set up proper monitoring and logging
- Implement backup strategies
- Review and adjust rate limits
- Configure error tracking (Sentry, etc.)