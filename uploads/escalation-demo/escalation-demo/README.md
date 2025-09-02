# Joblogic Customer Service Portal

A modern, comprehensive customer service portal for Joblogic's out-of-hours customer service operations. This portal provides support staff with tools to log jobs, track engineer progress, and manage customer escalations efficiently.

## Features

### 🚀 Modern Job Logging
- **Customer & Site Search**: Intelligent search functionality to quickly find customers and their sites
- **Contact Capture**: Comprehensive contact information collection including name, phone, email, and relationship
- **Job Details**: Detailed job information including type, category, priority, and target completion time
- **Engineer Assignment**: Assign jobs to specific engineers or teams
- **Form Validation**: Built-in validation to ensure all required information is captured

### 📊 Real-Time Dashboard
- **Live Status Tracking**: Monitor job progress in real-time with color-coded status indicators
- **Smart Status Management**: Automatic status transitions based on time and engineer actions
- **Search & Filtering**: Advanced search and filtering capabilities across all job data
- **Priority Management**: Visual priority indicators with color-coded badges
- **Time Tracking**: Automatic calculation of time elapsed and target completion monitoring

### 🎯 Status Management System
- **Green (Completed)**: Jobs successfully completed within target time
- **Amber (In Progress)**: Jobs accepted by engineers and currently being worked on
- **Red (Issues)**: Jobs with problems or delays, automatically triggered by:
  - Engineer not on site within 20 minutes of acceptance
  - Work not completed within target completion time
  - Manual escalation by support staff

### 📱 Responsive Design
- **Mobile-First**: Optimized for all device sizes
- **Modern UI/UX**: Clean, intuitive interface with smooth animations
- **Accessibility**: Built with accessibility best practices

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd escalation-demo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## Usage Guide

### Logging a New Job

1. **Navigate to "Log New Job"** from the sidebar
2. **Search for Customer**: Type to search and select from existing customers
3. **Select Site**: Choose the specific site from the customer's locations
4. **Enter Contact Details**: Fill in the contact person's information
5. **Job Information**: Provide detailed job description, type, category, and priority
6. **Engineer Assignment**: Select the appropriate engineer for the job
7. **Set Target Time**: Define expected completion time
8. **Save Job**: Click "Log Job" to create the job

### Managing Job Status

#### Support Staff Actions:
- **Mark as In Progress**: Change job status to amber when engineer accepts
- **Mark as Completed**: Change to green when work is finished
- **Escalate to Issue**: Change to red if problems arise

#### Automatic Status Changes:
- **20-Minute Rule**: Jobs automatically turn red if engineer not on site within 20 minutes
- **Completion Time Monitoring**: Jobs turn red if not completed within target time
- **Real-Time Updates**: Status changes are reflected immediately across the system

### Dashboard Features

#### Search & Filter:
- **Global Search**: Search across job numbers, customers, sites, engineers, and contacts
- **Status Filtering**: Filter by job status (All, Completed, In Progress, Issues)
- **Sorting Options**: Sort by date, priority, customer, or status

#### Quick Actions:
- **Call Contacts**: One-click calling directly from the dashboard
- **Status Updates**: Quick status change buttons for each job
- **Job Details**: Expandable view of comprehensive job information

## Technical Architecture

### Frontend Stack
- **React 18**: Modern React with hooks and functional components
- **Vite**: Fast build tool and development server
- **Lucide React**: Beautiful, consistent icon library
- **Date-fns**: Lightweight date manipulation library

### State Management
- **React Hooks**: useState and useEffect for local state management
- **Component Props**: Clean data flow between components
- **Real-Time Updates**: Automatic status updates with useEffect and setInterval

### Styling
- **CSS Grid & Flexbox**: Modern layout techniques
- **CSS Custom Properties**: Consistent theming and colors
- **Responsive Design**: Mobile-first approach with breakpoints
- **Modern CSS Features**: Box shadows, gradients, and smooth transitions

## Data Structure

### Job Object
```javascript
{
  id: 'unique-job-id',
  jobNumber: 'JL-1001',
  customer: 'Customer Name',
  site: 'Site Location',
  engineer: 'Engineer Name',
  contact: {
    name: 'Contact Name',
    number: 'Phone Number',
    email: 'Email Address',
    relationship: 'Role/Relationship'
  },
  status: 'green|amber|red',
  priority: 'Low|Medium|High|Critical',
  dateLogged: Date,
  dateAccepted: Date,
  dateOnSite: Date,
  dateCompleted: Date,
  description: 'Job Description',
  jobType: 'Maintenance|Repair|Installation|Emergency',
  category: 'Electrical|Mechanical|Plumbing|HVAC',
  targetCompletionTime: 60, // minutes
  reason: 'Status change reason (if applicable)'
}
```

## Configuration

### Environment Variables
The application can be configured through environment variables:

```bash
# Development
VITE_API_URL=http://localhost:8000
VITE_APP_TITLE=Joblogic Customer Service Portal

# Production
VITE_API_URL=https://api.joblogic.com
VITE_APP_TITLE=Joblogic Customer Service Portal
```

### Customization
- **Colors**: Modify CSS custom properties in `src/style.css`
- **Icons**: Replace Lucide React icons with custom icons
- **Data Sources**: Connect to real APIs by modifying the data fetching logic

## Deployment

### Build Process
```bash
npm run build
```

### Deployment Options
- **Static Hosting**: Deploy the `dist` folder to any static hosting service
- **CDN**: Use services like Netlify, Vercel, or AWS S3
- **Docker**: Containerize the application for container orchestration

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Roadmap

### Future Enhancements
- **Real-time Notifications**: Push notifications for status changes
- **Mobile App**: Native mobile application for engineers
- **Integration APIs**: Connect with existing Joblogic systems
- **Advanced Analytics**: Detailed reporting and performance metrics
- **Multi-language Support**: Internationalization for global teams
- **Dark Mode**: Alternative color scheme for different environments
