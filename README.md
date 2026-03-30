# InGraviton - Drone E-commerce Platform

A full-stack drone components e-commerce website built with vanilla JavaScript, Express.js, and MongoDB.

## Features

- User authentication (login/register)
- Admin dashboard with full CRUD operations
- Product catalog with categories (Frames, Components, Tools)
- Shopping cart functionality
- Custom drone build requests
- Newsletter subscription
- Order management
- Responsive design

## Tech Stack

- **Frontend**: HTML, CSS (Tailwind), JavaScript, Vite
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Deployment**: Vercel (Frontend) + Railway/Render (Backend)

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/tashiriskhan/drone.git
cd drone
```

2. Install frontend dependencies
```bash
npm install
```

3. Install backend dependencies
```bash
cd backend
npm install
```

4. Create backend .env file
```bash
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

5. Seed the database
```bash
node seed.js
```

6. Run development servers
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
cd backend
npm start
```

## Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Deploy

### Backend (Railway/Render)

1. Deploy backend separately
2. Update frontend API URL to your backend URL
3. Update MongoDB URI for production database

## Demo Credentials

- **Admin**: admin@ingraviton.com / admin123
- **User**: test@user.com / user123

## License

MIT
