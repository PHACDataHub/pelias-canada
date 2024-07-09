# TopNav Component Documentation

The `TopNav` component is a React component designed to render a navigation bar with a main menu and a dropdown menu functionality. It allows users to navigate between different sections of an application using links and provides interactive menu toggling behavior.

## Features

### Main Menu

The main menu consists of:
- **Logo/Title**: Displayed as a link to the homepage (`/`).
- **Menu Toggle Button**: A button to toggle the visibility of the main menu items.
- **Menu Items**: Links to various sections such as Home, Bulk Input, and Frequently Asked Questions.

### Dropdown Menu

The dropdown menu appears under the "Developers" button and includes:
- **Dropdown Toggle Button**: Toggles the visibility of the dropdown menu.
- **Dropdown Menu Items**: Links to specific developer resources like R Shiny API and Python API.

### Functionality

#### State Management

- **menuOpen State**: Manages the visibility of the main menu.
- **dropdownOpen State**: Manages the visibility of the dropdown menu.

#### Event Handling

- **Menu Toggle**: Clicking or pressing Enter/Space on the menu toggle button (`div.menu`) toggles the `menuOpen` state.
- **Dropdown Toggle**: Clicking the "Developers" button toggles the `dropdownOpen` state.
- **Keyboard Navigation**: Supports keyboard navigation:
  - **Tab key**: Moves focus through menu items.
  - **Escape key**: Closes the main menu.

#### Accessibility

- **ARIA Attributes**: Uses `aria-expanded` and `aria-haspopup` attributes for accessibility.
- **Focus Management**: Ensures proper focus management when navigating through menus and closing them.

#### Scroll Management

- **Body Class**: Adds/removes classes (`no-scroll`, `menu-open`) to the `<body>` element to prevent scrolling when menus are open.

#### Event Listeners

- **Document Listeners**: Registers event listeners (`keydown` for Escape key, `mousedown` for clicks outside dropdown) for interactive behavior.

#### Refs

- **Refs for DOM Elements**: Utilizes `useRef` to create references for key DOM elements (`menuRef`, `dropdownMenuRef`) to manage focus and event handling.

## Usage

To use the `TopNav.jsx` component :

```
import TopNav from "./TopNav"



      <TopNav />
    
```