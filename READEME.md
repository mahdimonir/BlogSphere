# BlogSphere

BlogSphere is a full-stack blog application built with Next.js (React) for the frontend, Express.js for the backend, MongoDB for the database, and JWT for authentication. It allows users to register, log in, create/edit/delete blog posts, comment on posts, like/dislike posts or comments, and includes an admin dashboard for managing users and content.

## Features

- User authentication (register, login, logout, email verification) with JWT
- Blog post creation, editing, and deletion with image upload
- Nested commenting system (up to 5 levels deep)
- Like/dislike functionality for posts and comments
- Admin dashboard for user, post, and comment management (suspension toggling)
- Search functionality for post titles, users, and comments
- Responsive design with Tailwind CSS
- Basic SEO with Next.js metadata
- API documentation with Swagger UI at `/api-docs`
- Error handling for robust operation

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, Axios, React Hook Form, Lucide React, Swiper, React Hot Toast
- **Backend**: Express.js, MongoDB, Mongoose, JWT, Swagger Autogen
- **Authentication**: JWT with refresh tokens
- **Deployment**: Vercel (frontend and backend)

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
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── adminController.js
│   │   │   ├── authController.js
│   │   │   ├── commentController.js
│   │   │   ├── likeController.js
│   │   │   ├── postController.js
│   │   │   ├── userController.js
│   │   ├── db/
│   │   │   ├── index.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   ├── errorHandler.js
│   │   │   ├── multerMiddleware.js
│   │   ├── models/
│   │   │   ├── commentModel.js
│   │   │   ├── likeModel.js
│   │   │   ├── postModel.js
│   │   │   ├── userModel.js
│   │   ├── routes/
│   │   │   ├── adminRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   ├── commentRoutes.js
│   │   │   ├── likeRoutes.js
│   │   │   ├── postRoutes.js
│   │   │   ├── userRoutes.js
│   │   ├── utils/
│   │   │   ├── email-templates/
│   |   │   │   ├── mail-template.ejs
│   │   │   ├── sendMail/
│   |   │   │   ├── index.js
│   │   │   ├── ApiError.js
│   │   │   ├── ApiResponse.js
│   │   │   ├── asyncHandler.js
│   │   │   ├── cloudinary.js
│   │   ├── app.js
│   │   ├── index.js
│   │   ├── swagger-output.json
│   │   ├── swagger.mjs
│   ├── .env
│   ├── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   |   ├── (routes)/
│   │   |   ├── assets/
│   │   |   ├── components/
│   │   |   ├── hooks/
│   │   |   ├── globals.css
│   │   |   ├── layout.js
│   |   │   ├── page.js
|   |   ├── context/
│   │   |   ├── AuthContext.js
│   │   ├── middleware.js
│   │   ├── server.js
│   ├── public/
│   ├── .env
│   ├── next.config.js
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
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

   This installs required packages: `express`, `mongoose`, `cors`, `jsonwebtoken`, `bcryptjs`, `dotenv`, `swagger-autogen`, `swagger-ui-express`.

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

5. **Generate Swagger Documentation**:
   Run the Swagger autogen script to generate `swagger-output.json`:

   ```bash
   node swagger.mjs
   ```

6. **Start the Backend Server**:

   ```bash
   npm start
   ```

   The server should start at `http://localhost:5000`. You should see "MongoDB connected" and "Server running on port 5000" in the console. Visit `http://localhost:5000/api-docs` to view the Swagger UI.

### 3. Frontend Setup

1. **Navigate to the Frontend Directory**:

   ```bash
   cd ../frontend
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

   This installs required packages: `next`, `react`, `react-dom`, `axios`, `lucide-react`, `react-hook-form`, `react-hot-toast`, `swiper`, and dev dependencies `tailwindcss`, `@tailwindcss/typography`, `@tailwindcss/postcss`.

3. **Configure Tailwind CSS**:
   Ensure `tailwind.config.js` and `postcss.config.js` are correctly set up:

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
     plugins: [require("@tailwindcss/typography")],
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

4. **Configure Backend API URL**:
   Create a `.env.local` file in the `frontend/` directory to set the backend API URL:

   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
   ```

   If the backend is deployed (e.g., at `https://blog-sphere-backend-ruby.vercel.app/api/v1`), update `NEXT_PUBLIC_API_URL` accordingly.

5. **Start the Frontend Development Server**:

   ```bash
   npm run dev
   ```

   The frontend should start at `http://localhost:3000`.

### 4. Testing the Application

1. **Open the Frontend**:
   Navigate to `http://localhost:3000` in your browser.

   - You should see the BlogSphere homepage with a search bar and a list of posts (initially empty).
   - Click "Register" to create a new user account and verify your email with an OTP.
   - Log in to create posts, comment, like/dislike posts or comments, or access the dashboard.

2. **Test Admin Features**:

   - To test admin features, manually set a user's `role` to `admin` in MongoDB:
     ```bash
     mongo
     use blogsphere
     db.users.updateOne({ email: "your-email@example.com" }, { $set: { role: "admin" } });
     ```
   - Log in as the admin user to access user, post, and comment suspension features in the dashboard.

3. **Verify Error Handling**:

   - Test invalid inputs:
     - Enter incorrect credentials during login/register.
     - Submit empty or invalid post titles.
     - Try accessing protected routes (e.g., `/create`) without logging in.
   - Check the browser console and network tab for errors.

4. **Test Swagger UI**:
   - Visit `http://localhost:5000/api-docs` to ensure API endpoints are documented correctly.
   - Test endpoints like `/auth/signup`, `/posts`, or `/comments` using the Swagger interface.

### 5. Deployment

#### Backend Deployment (Vercel)

1. **Push Backend to Git**:
   Ensure the `backend/` directory is a Git repository:

   ```bash
   cd backend
   git init
   git add .
   git commit -m "Initial backend commit"
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
   - Deploy the backend:
     ```bash
     vercel
     ```
   - Configure the project:
     - Set the build command to `npm run build` (if applicable) or skip if no build step.
     - Set environment variables in Vercel:
       ```bash
       vercel env add MONGO_URI
       vercel env add JWT_SECRET
       vercel env add PORT
       ```
       Enter the values from your `.env` file.
   - The deployed URL will be something like `https://blog-sphere-backend-ruby.vercel.app`. Update the frontend’s `NEXT_PUBLIC_API_URL` to this URL.

3. **Configure Vercel for Backend**:
   - In `vercel.json` (create if not present), add:
     ```json
     {
       "version": 2,
       "builds": [
         {
           "src": "server.js",
           "use": "@vercel/node"
         }
       ],
       "routes": [
         {
           "src": "/(.*)",
           "dest": "server.js"
         }
       ]
     }
     ```
   - Ensure `server.js` is set up to handle Vercel’s serverless environment (e.g., use `module.exports = app`).

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

   - Deploy the frontend:
     ```bash
     vercel
     ```
   - Configure the project:
     - Set the build command to `npm run build`.
     - Set the output directory to `.next`.
     - Add the environment variable:
       ```bash
       vercel env add NEXT_PUBLIC_API_URL
       ```
       Enter the backend URL (e.g., `https://blog-sphere-backend-ruby.vercel.app/api/v1`).

3. **Update Frontend API Calls**:
   Ensure API calls use the environment variable:
   ```javascript
   const res = await fetch(
     `${process.env.NEXT_PUBLIC_API_URL}/posts?search=${search}`,
     { headers: { Authorization: `Bearer ${token}` } }
   );
   ```

### 6. Troubleshooting

- **MongoDB Connection Issues**:
  - Verify `MONGO_URI` is correct and your IP is whitelisted in MongoDB Atlas.
  - Check MongoDB logs for connection errors.
- **CORS Errors**:
  - Ensure the backend’s `cors` middleware allows the frontend URL (local or deployed).
  - Example in `server.js`:
    ```javascript
    app.use(
      cors({
        origin: ["http://localhost:3000", "https://your-frontend.vercel.app"],
      })
    );
    ```
- **Script Errors**:
  - Check the browser console for errors like "script error."
  - Verify `next.config.js`, `tailwind.config.js`, and `postcss.config.js` are correct.
- **JWT Errors**:
  - Ensure `JWT_SECRET` is consistent and tokens are sent in the `Authorization` header (`Bearer <token>`).
- **Swagger UI Issues**:
  - If `/api-docs` fails, ensure `swagger-output.json` exists and `swagger-ui-express` is set up in `server.js`:
    ```javascript
    import swaggerUi from "swagger-ui-express";
    import swaggerDocument from "./src/swagger-output.json" assert { type: "json" };
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    ```
- **Deployment Issues**:
  - Check Vercel build logs for errors.
  - Verify environment variables are set in the Vercel dashboard.
  - Ensure the backend handles Vercel’s serverless environment correctly.

### 7. Optional Enhancements

- Integrate a rich text editor (e.g., Quill or TinyMCE) for post creation.
- Add social login (e.g., Google OAuth) using `next-auth`.
- Implement password reset via email with Nodemailer.
- Enhance SEO with dynamic meta tags per post using `next/head`.
- Optimize images with Next.js `Image` component for lazy loading.
- Add real-time notifications for likes/comments using WebSockets.

## Contributing

Feel free to fork the repository, make changes, and submit pull requests. For major changes, please open an issue first to discuss.

## License

This project is licensed under the MIT License.
