# Task Management App

A full-featured task management application built with **Next.js**, **React**, and **NextAuth.js** for authentication. Users can add, update, delete, search, filter, and paginate tasks in a clean and responsive interface.

---

## Features

- User authentication with **NextAuth.js**
- Add new tasks with title and description
- Mark tasks as completed or pending
- Delete tasks
- Search tasks by title
- Filter tasks by status: All, Completed, Pending
- Pagination for task list
- Responsive design for desktop and mobile

---

## Tech Stack

- **Frontend & Backend:** Next.js (React)
- **Authentication:** NextAuth.js
- **Styling:** Tailwind CSS
- **Database:** MongoDB=
- **API:** RESTful API routes with Next.js

---

## Setup Instructions
upon cloning, run 
  -npm i
  - create .env.local and add NEXTAUTH_SECRET and MONGODB_URI
  -npm run dev

## Application Working
    Authentication:
    -Users must log in to access the dashboard.
    -Upon successful login, users can view their personal tasks.
    Adding Tasks:
    -Fill in the title and optional description in the form.
    -Click Add Task to save it to the database.
    Managing Tasks:
    -Tasks can be marked Complete or Undo using the button.
    -Tasks can be deleted with the Delete button.
    Search & Filter:
    -Search tasks by typing keywords in the search bar.
    -Filter tasks by All, Completed, or Pending status.
    Pagination:
    -Tasks are displayed in pages (default: 5 tasks per page).
    Real-time Updates:
    -Task list updates automatically after adding, updating, or deleting tasks.
