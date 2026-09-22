# Business-to-Business Invoice Management System React Frontend
## React Frontend starting prompt 
This document is a starter prompt to produce Product Requirements Document for B2B Invoice Management System Reactjs Frontend.

Frontend is to be built using Reactjs, mockapi, Vercel deployment from shared Github repo. Data to be persisted across sessions and user access.

Solution to be built as a training assignment but should be meaningful for real world application. Hybrid coding using AI with human coding input. 

Frontend coding team comprises Jenn Fang, Ralph, John. 

Timeline is 7 days. Team is managing daytime work and can only commit 6 hours daily for this project. Scope that cannot fit into timeline will be deferred into future phases. 


## Related documents and sources
- File: module2-project-brief.pdf
- when producing detailed plan read the project brief pdf for Reactjs concepts to be demonstrated in solution.  
- Previous project done by Team showing the react concepts implemented. Folder: ~/Documents/code/NTU-AIE/ai-2.11-form-validation-deployment/simple-crm-web-soln/
- architecture of previous project "simple-crm-web-soln" File: simple-crm-architecture (qwen3.8-mlx).svg 


## Core Technical Requirements
- Component-based UI with JSX, props, and composition
- State with useState , and useReducer where it fits
- Handling events and lifting state up
- Conditional rendering and rendering lists
- Fetching and displaying data with useEffect
- Context API, where the app's complexity warrants it
- Client-side routing with React Router
- Working as a team on a shared codebase with Git and GitHub
- Built with Vite
- Functional components and React hooks throughout, no class components
- UI organised into multiple, sensibly scoped components, with props passed cleanly
- At least two client-side routes with React Router, with navigation between them
- Shared state managed with useState / useReducer ; Context only where it genuinely helps
- All external interfaces integrations are simulated, including IRAS, Peppol, Paynow QR, etc.
- Automated Unit Tests

## UI/UX Mockup
- refer to mockup for visual design as a guide.
- File: singapore_invoicenow_app.html


## Use Cases 

### UC1 - Login to Landing/Dashboard
> As a registered user, I want to log in and see the invoice dashboard, so that I can view invoice statistics, statuses, and available actions based on my role.
- Login screen
- Dashboard Landing Displays:
	- number of invoices
	- overdue total 
	- paid total
	- list of invoices in system, clickable link to navigate to Mange Invoice
	- status of each invoice
	- CTA buttons for each invoice
- Access roles - determined by login user 
- search input to filter list of invoices,  status-filter direct filter buttons
- each invoice has appropriate CTA button. Edit only if in Draft status, Delete only for View/Edit access role 

### UC2 - Create invoice (part of CRUD)
> As an edit-access user, I want to create a new invoice, so that I can record a billable transaction for a customer.
- create new invoice, persist when saved or submitted
	- select Customer from dropdown
		- customer details are populated and cannot be overwritten when creating invoice
	- auto generate Inv#
	- auto populate Due Date 
	- Add line item
		- select Product from dropdown
		- Product data are populated and cannot be edited or overwitten
		- auto fill Product Description
	- auto calculate Totals (frontend logic)
	- checkbox to Embed Dynamic PayNow UEN QR Code for Instant B2B Settlement
- Save goes back to dashboard, invoice created as draft
- transmit sends to IRAS for gst reg (simulation)
- Cancel discards newly entered data if any, and navigates back to Home (Dashboard)

### UC3 - Manage Invoice  
> As an edit-access user, I want to view and manage an existing invoice, so that I can update permitted invoice details or change its status.
- view, 
- edit specific fields: Due Date,
- delete invoice
- Update Invoice to Paid status
- access role: Edit 

### UC9 - Access Roles
> As an administrator or system designer, I want users to have View-only or Edit roles, so that invoice actions can be controlled based on access rights.
- Roles (business logic coded in system)
	- View-only
	- Edit (View, Edit, Approver)
- Approver needs Edit access. cannot be same user as maker
- Use Cases requiring Approver flow:
	- Delete Invoice
	- Update Invoice as Paid
	- Change Due Date

### UC10 - Approver Flow
> As an approver, I want to approve or reject invoices that are pending approval, so that controlled actions such as delete, due date change, or paid-status update are properly reviewed.
- Special case of Manage Invoice
- Any user with Edit access can pick up invoices with pending approval status to approve them, as long as they are not the same person who created the invoice.
- Approve / Reject Button enabled for user with Edit access, and Invoice status as Pending Approval
- On Reject, status changes to Draft

## Simulated
- Peppol / InvoiceNow integration.
- IRAS submission.
- PayNow QR generation.
- Full maker-checker audit trail.
- Complex approval queues. Only basic maker-checker flow. 
- PDF invoice generation.
- Email sending.
- Multi-company support.
- Customers already defined in backend. Manage Customer feature in later phase.
- Products already defined in backend. Manage Products feature in later phase.