# Department Management System

A Next.js application for managing departments and sub-departments with GraphQL integration.

## Features

### Authentication

- Secure login system with JWT tokens
- Protected routes requiring authentication
- Logout functionality

Test Credentials:

```
username: admin
password: admin123
```

### Department Management

- View all departments with pagination
- Create new departments
- Update department names
- Delete departments and their sub-departments
- Search departments by name
- Responsive grid layout for department cards

### Sub-Department Management

- View all sub-departments
- Create new sub-departments with parent department selection
- Update sub-department names
- Delete sub-departments
- Search sub-departments by name or parent department
- Responsive grid layout for sub-department cards

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/tglobal-client.git
   cd tglobal-client
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory with:

   ```env
   NEXT_PUBLIC_GRAPHQL_URL=your_graphql_api_url
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`

## Usage

1. **Authentication**

   - Visit the login page at `/login`
   - Enter your credentials to access the system
   - Use the logout button in the header to end your session

2. **Department Management**

   - Navigate to the departments page at `/`
   - Use the "Create Department" button to add new departments
   - Click on department cards to view options for editing or deletion
   - Use the search bar to filter departments by name
   - Navigate through pages using the pagination controls

3. **Sub-Department Management**
   - Navigate to the sub-departments page at `/sub-departments`
   - Use the "Create Sub-Department" button to add new sub-departments
   - Select a parent department when creating sub-departments
   - Click on sub-department cards to view options for editing or deletion
   - Use the search bar to filter sub-departments by name or parent department

## Technologies Used

- **Frontend Framework**: Next.js 13+ with App Router
- **UI Library**: React 18+
- **Styling**: Tailwind CSS
- **State Management**: React Context
- **API Integration**: Apollo Client
- **Authentication**: JWT
- **Form Handling**: React Hook Form
- **Type Safety**: TypeScript

## Project Structure

```
src/
├── app/                    # Next.js app router pages
├── components/
│   ├── departments/       # Department-related components
│   ├── sub-departments/   # Sub-department-related components
│   ├── shared/           # Shared components (header, etc.)
│   └── providers/         # Context providers
├── contexts/              # React contexts
└── hooks/                 # Custom React hooks
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License
