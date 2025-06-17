# Multi-User Project Management App - Frontend

This repository contains the frontend application for the Multi-User Project Management App, built with Next.js. It provides the user interface for interacting with the backend services, allowing users to manage projects and tasks.

### Features

* User registration and login.
* Dashboard displaying user's projects.
* Detailed project view with Kanban-style task board.
* Drag-and-drop functionality for updating task status.
* Task analytics chart per project.
* Protected routes ensuring secure access.
* Responsive and modern UI with Tailwind CSS and Shadcn UI.

### Technologies Used

* **Framework:** Next.js (App Router)
* **Styling:** Tailwind CSS
* **UI Components:** Shadcn UI
* **Forms:** React Hook Form
* **Charts:** Chart.js with `react-chartjs-2`
* **Drag and Drop:** `@dnd-kit/core`
* **Alerts:** SweetAlert2
* **Authentication:** `js-cookie` (for client-side token management and middleware integration)
* **Language:** TypeScript

### Prerequisites

Before you begin, ensure you have the following installed on your machine:

* [Node.js](https://nodejs.org/en/download/) (LTS version recommended)
* [npm](https://www.npmjs.com/get-npm) (comes with Node.js) or [Yarn](https://yarnpkg.com/getting-started/install)
* The **backend server** for this application must be running (typically on `http://localhost:5000`). Refer to the [Backend Repository](https://github.com/yourusername/sp_fs_yourname_backend) for setup instructions.

### Getting Started

Follow these steps to set up and run the frontend locally:

1.  **Clone this repository:**
    ```bash
    git clone [https://github.com/yourusername/sp_fs_yourname_frontend.git](https://github.com/yourusername/sp_fs_yourname_frontend.git) # Replace with your actual frontend repo URL
    cd sp_fs_yourname_frontend
    ```

2.  **Install Dependencies:**
    ```bash
    npm install # or yarn install
    ```

3.  **Configure Environment Variables:**
    Create a `.env.local` file in the root of the `frontend` directory. This file is used for local environment variables and is ignored by Git.
    ```bash
    touch .env.local
    ```
    Add the following line to your `.env.local` file, ensuring it points to your running backend server:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
    ```

4.  **Start the Frontend Development Server:**
    ```bash
    npm run dev # or yarn dev
    ```
    The frontend application will typically run on `http://localhost:3000`.

### Access the Application

Ensure your **backend server is running first**. Then, open your web browser and go to: `http://localhost:3000`.

You will be redirected to the login page. Register a new account if you don't have one, then log in to access the application.

---

### Folder Structure

.
├── public/               # Static assets
├── src/                  # Frontend source code (pages, components, context, etc.)
│   ├── app/              # Next.js App Router pages
│   ├── components/       # Reusable UI components (Shadcn UI, custom)
│   ├── context/          # React Context for authentication
│   └── lib/              # Utility functions, API client
├── .env.local            # Frontend environment variables (ignored by Git)
├── package.json          # Frontend dependencies
├── package-lock.json     # Node.js dependency lock file
├── next.config.ts        # Next.js configuration
├── tsconfig.json         # TypeScript configuration
└── README.md             # This file


---

## License

This project is open-sourced under the MIT License.
