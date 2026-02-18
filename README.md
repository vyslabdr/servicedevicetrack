# Service Device Tracker (Beta)

A modern, full-stack application for tracking device repairs, managing technicians, and keeping customers informed via SMS/WhatsApp.

## 🚀 Key Features

### 🛠 Technician Dashboard
- **Device Management**: Add, update, and search repair tickets.
- **Status Tracking**: Track devices from "Received" to "Delivered".
- **Dynamic Search**: Filter by customer name, phone, or ticket ID.
- **Printable Tickets**: Generate PDF tickets for customers.

### 📱 Customer Experience (New!)
- **Public Tracking Page**: Customers can track repairs at `/track` using their Ticket ID.
- **Automated Notifications**: Integration with **Infobip** for SMS updates.
- **Mobile Friendly**: Fully responsive design for technicians on the go.

### 🛡 Admin Capabilities (New!)
- **User Management**: Create, delete, and manage technician accounts.
- **System Settings**: Configure company info and API credentials directly from the dashboard.
- **Security**: Role-based access control (Admin vs Technician).

## 🛠 Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Database**: SQLite (via Prisma ORM)
- **UI**: Tailwind CSS, Lucide Icons
- **Auth**: NextAuth.js
- **Services**: Infobip (SMS)

## 📦 Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/device-tracker.git
    cd device-tracker
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Setup Environment**:
    Create a `.env` file:
    ```env
    DATABASE_URL="file:./dev.db"
    NEXTAUTH_SECRET="your-secret-key"
    NEXTAUTH_URL="http://localhost:3000"
    ```

4.  **Initialize Database**:
    ```bash
    npx prisma db push
    ```

5.  **Start Development Server**:
    ```bash
    npm run dev
    ```

## 🚀 Deployment

### Option A: Docker (Recommended for Self-Hosting)
This project includes a `Dockerfile` and `docker-compose.yml` for easy deployment.
```bash
docker-compose up -d --build
```

### Option B: Vercel / Railway
- Push to GitHub.
- Import project to Vercel/Railway.
- Set Environment Variables in the dashboard.
- **Note**: For Vercel, use a remote database like Postgres (Neon/Supabase) instead of SQLite.

## 📝 License
MIT
