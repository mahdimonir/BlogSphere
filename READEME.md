# BlogSphere

BlogSphere is a full-stack blog application built with Next.js (React) for the frontend, Express.js for the backend, MongoDB for the database, and JWT for authentication. It allows users to register, log in, create/edit/delete blog posts, comment on posts, like/dislike posts, and includes an admin dashboard for managing users and content.

## Features

- User authentication (register, login, logout) with JWT
- Blog post creation, editing, and deletion
- Commenting system
- Like/dislike functionality for posts
- Admin dashboard for user and content management
- Search functionality for post titles
- Responsive design with Tailwind CSS
- Basic SEO with Next.js metadata
- Error handling for robust operation

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Express.js, MongoDB, Mongoose
- **Authentication**: JWT
- **Deployment**: Vercel (frontend), Heroku/Render (backend)

## Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js** (v16 or higher): [Download](https://nodejs.org/)
- **MongoDB**: Either a local MongoDB instance or a cloud service like MongoDB Atlas ([Setup Guide](https://www.mongodb.com/docs/atlas/getting-started/))
- **Git**: For cloning the repository ([Download](https://git-scm.com/))
- **Code Editor**: VS Code or similar
- A package manager: **npm** (comes with Node.js) or **yarn**

## Project Structure

```
blogsphere/
├── backend/
│   ├── controllers/
│   │   ├── userController.js
│   │   ├── postController.js
│   │   ├── commentController.js
│   ├── middleware/
│   │   ├── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Post.js
│   │   ├── Comment.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── postRoutes.js
│   │   ├── commentRoutes.js
│   ├── .env
│   ├── server.js
│   ├── package.json
├── frontend/
│   ├── app/
│   │   ├── create/
│   │   │   ├── page.js
│   │   ├── login/
│   │   │   ├── page.js
│   │   ├── posts/
│   │   │   ├── [id]/
│   │   │   │   ├── page.js
│   │   ├── register/
│   │   │   ├── page.js
│   │   ├── dashboard/
│   │   │   ├── page.js
│   │   ├── globals.css
│   │   ├── layout.js
│   │   ├── page.js
│   ├── context/
│   │   ├── AuthContext.js
│   ├── public/
│   ├── next.config.js
│   ├── package.json
├── README.md
```

## Setup Instructions

### 1. Clone the Repository

Clone the project to your local machine:

```bash
git clone https://github.com/your-username/blogsphere.git
cd blogsphere
```

_Note_: Replace `https://github.com/your-username/blogsphere.git` with the actual repository URL if you host the code on GitHub.

### 2. Backend Setup

1. **Navigate to the Backend Directory**:

   ```bash
   cd backend
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

   This installs required packages: `express`, `mongoose`, `cors`, `jsonwebtoken`, `bcryptjs`, and `dotenv`.

3. **Create `.env` File**:
   In the `backend/` directory, create a `.env` file with the following content:

   ```
   MONGO_URI=mongodb://localhost:27017/blogsphere
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

   - **MONGO_URI**: Replace with your MongoDB connection string. For MongoDB Atlas, it will look like `mongodb+srv://<username>:<password>@cluster0.mongodb.net/blogsphere?retryWrites=true&w=majority`.
   - **JWT_SECRET**: A random string for JWT signing (e.g., generate one using `openssl rand -base64 32`).
   - **PORT**: Default is 5000; change if needed.

4. **Run MongoDB**:

   - If using a local MongoDB instance, ensure it's running:
     ```bash
     mongod
     ```
   - If using MongoDB Atlas, ensure your IP is whitelisted in the Atlas dashboard.

5. **Start the Backend Server**:
   ```bash
   npm start
   ```
   The server should start at `http://localhost:5000`. You should see "MongoDB connected" and "Server running on port 5000" in the console.

### 3. Frontend Setup

1. **Navigate to the Frontend Directory**:

   ```bash
   cd ../frontend
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

   This installs required packages: `next`, `react`, `react-dom`, `tailwindcss`, `postcss`, `autoprefixer`.

3. **Configure Tailwind CSS**:
   Ensure `tailwind.config.js` and `postcss.config.js` are present. They should already be set up as follows:

   **tailwind.config.js**:

   ```javascript
   module.exports = {
     content: [
       "./app/**/*.{js,ts,jsx,tsx}",
       "./pages/**/*.{js,ts,jsx,tsx}",
       "./components/**/*.{js,ts,jsx,tsx}",
     ],
     theme: {
       extend: {},
     },
     plugins: [],
   };
   ```

   **postcss.config.js**:

   ```javascript
   module.exports = {
     plugins: {
       tailwindcss: {},
       autoprefixer: {},
     },
   };
   ```

4. **Start the Frontend Development Server**:

   ```bash
   npm run dev
   ```

   The frontend should start at `http://localhost:3000`.

5. **Configure Backend API URL**:
   The frontend assumes the backend is running at `http://localhost:5000`. If your backend is hosted elsewhere, update the API fetch URLs in the frontend code (e.g., in `app/page.js`, `app/login/page.js`, etc.) to point to your backend URL.

### 4. Testing the Application

1. **Open the Frontend**:
   Navigate to `http://localhost:3000` in your browser.

   - You should see the BlogSphere homepage with a search bar and a list of posts (initially empty).
   - Click "Register" to create a new user account.
   - Log in to create posts, comment, like/dislike posts, or access the dashboard.

2. **Test Admin Features**:

   - To test admin features, manually set a user's `role` to `admin` in MongoDB:
     ```bash
     mongo
     use blogsphere
     db.users.updateOne({ email: "your-email@example.com" }, { $set: { role: "admin" } });
     ```
   - Log in as the admin user to access user management and content moderation features in the dashboard.

3. **Verify Error Handling**:
   - The application includes global error handling to prevent issues like "script error." Test by:
     - Entering invalid credentials during login/register.
     - Trying to access protected routes (e.g., `/create`) without logging in.
     - Submitting invalid data (e.g., empty post title).

### 5. Deployment

#### Backend Deployment (Heroku/Render)

1. **Push Backend to Git**:
   Ensure the `backend/` directory is a Git repository:

   ```bash
   cd backend
   git init
   git add .
   git commit -m "Initial backend commit"
   ```

2. **Deploy to Heroku**:

   - Install the Heroku CLI: [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli).
   - Log in to Heroku:
     ```bash
     heroku login
     ```
   - Create a new Heroku app:
     ```bash
     heroku create blogsphere-backend
     ```
   - Add MongoDB Atlas add-on or configure `MONGO_URI`:
     ```bash
     heroku config:set MONGO_URI="your-mongodb-atlas-uri"
     heroku config:set JWT_SECRET="your_jwt_secret_key"
     ```
   - Deploy the backend:
     ```bash
     git push heroku main
     ```
   - Open the deployed backend:
     ```bash
     heroku open
     ```

3. **Alternative: Render**:
   - Create a new web service on Render ([render.com](https://render.com)).
   - Connect your GitHub repository for the backend.
   - Set environment variables (`MONGO_URI`, `JWT_SECRET`, `PORT`) in the Render dashboard.
   - Deploy the service.

#### Frontend Deployment (Vercel)

1. **Push Frontend to Git**:
   Ensure the `frontend/` directory is a Git repository:

   ```bash
   cd frontend
   git init
   git add .
   git commit -m "Initial frontend commit"
   ```

2. **Deploy to Vercel**:

   - Install the Vercel CLI:
     ```bash
     npm install -g vercel
     ```
   - Log in to Vercel:
     ```bash
     vercel login
     ```
   - Deploy the frontend:
     ```bash
     vercel
     ```
   - Follow the prompts to configure the project. Ensure the build command is `npm run build` and the output directory is `.next`.
   - Set the backend API URL as an environment variable in Vercel:
     ```bash
     vercel env add NEXT_PUBLIC_API_URL
     ```
     Enter the URL of your deployed backend (e.g., `https://blogsphere-backend.herokuapp.com`).

3. **Update Frontend API Calls**:
   If the backend is not at `http://localhost:5000`, update the API URLs in the frontend code to use the environment variable `process.env.NEXT_PUBLIC_API_URL`. For example, in `app/page.js`:
   ```javascript
   const res = await fetch(
     `${process.env.NEXT_PUBLIC_API_URL}/api/posts?search=${search}`
   );
   ```

### 6. Troubleshooting

- **MongoDB Connection Issues**:
  - Ensure MongoDB is running or your Atlas URI is correct.
  - Check your IP is whitelisted in MongoDB Atlas.
- **CORS Errors**:
  - Verify the backend allows CORS for the frontend URL (handled by `cors` middleware).
- **Script Errors**:
  - Ensure all scripts load correctly (check browser console).
  - Verify `next.config.js` and Tailwind configurations are correct.
- **JWT Errors**:
  - Ensure `JWT_SECRET` is consistent across backend and frontend sessions.
- **Deployment Issues**:
  - Check build logs in Vercel/Heroku for errors.
  - Verify environment variables are set correctly.

### 7. Optional Enhancements

- Add a rich text editor (e.g., Quill or TinyMCE) for post creation.
- Implement social login (e.g., Google OAuth).
- Add password reset via email using a service like Nodemailer.
- Enhance SEO with dynamic meta tags per post.
- Implement lazy loading for images using Next.js `Image` component.

## Contributing

Feel free to fork the repository, make changes, and submit pull requests. For major changes, please open an issue first to discuss.

## License

This project is licensed under the MIT License.
