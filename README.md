<div align="center">

# 🌿 NutriWell

### Eat Better. Live Better.

A responsive nutrition and healthy-lifestyle web application with an interactive front end and a secure PHP/MySQL authentication system.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Pages](#pages)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Database Setup](#database-setup)
- [Authentication Flow](#authentication-flow)
- [Security](#security)
- [Responsive Design & Accessibility](#responsive-design--accessibility)
- [Featured Expert](#featured-expert)
- [Roadmap](#roadmap)
- [Contact](#contact)

---

## Overview

**NutriWell** makes nutrition simple, practical and approachable. Visitors can learn the basics of nutrition, explore healthy foods, browse step-by-step recipes, calculate their BMI and connect with a qualified nutrition professional.

The project was developed for the **Web Technologies** course. It combines a polished, framework-free front end (HTML5, CSS3, vanilla JavaScript) with a PHP and MySQL backend that handles user registration, login and sessions.

---

## Features

**Front end**

- 🌗 **Dark mode** toggle with smooth light/dark theming
- 📱 **Responsive navigation** with a mobile hamburger menu
- 🥗 **Food Explorer** – filter healthy foods by category
- 🍳 **Recipe library** – filter by Breakfast, Lunch, Dinner, Juices & Smoothies, Snacks, Salads and Desserts
- 🪟 **Recipe detail modal** – ingredients, preparation steps, time and difficulty
- ⚖️ **BMI calculator** – validated inputs with instant category feedback
- ✅ **Form validation** – contact form and newsletter signup
- 💡 **Daily nutrition tips** – dynamic content
- 📊 **Animated statistics counters** and accordion-style nutrition principles
- 👩‍⚕️ **Featured nutrition expert** section

**Back end**

- 🔐 User **registration**, **login** and **logout**
- 🛡️ Password hashing, prepared statements and session protection
- 🚪 Protected home page (`index.php`) that requires an active session

---

## Pages

| Page | File | Description |
|------|------|-------------|
| Home (public) | `index.html` | Landing page with Login / Sign Up links |
| Home (members) | `index.php` | Session-protected home page with Logout |
| About | `about.html` | Mission, approach and four core nutrition principles |
| Nutrition | `nutrition.html` | Nutrient guide, Food Explorer and BMI calculator |
| Recipes | `recipes.html` | Filterable recipe grid with detail modal |
| Contact | `contact.html` | Contact form, details and expert profile |
| Sign Up | `signup.php` | Account registration |
| Login | `login.php` | User authentication |
| Logout | `logout.php` | Ends the session and redirects to login |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Markup | HTML5 (semantic elements) |
| Styling | CSS3 – Flexbox, Grid, custom properties, media queries |
| Scripting | Vanilla JavaScript (DOM, events, validation, modals) |
| Server | PHP 8+ (mysqli) |
| Database | MySQL / MariaDB |
| Fonts | Google Fonts – Fraunces & Manrope |

---

## Project Structure

```
project-root/
├── config/
│   └── database.php        # Database connection ($conn, mysqli)
├── includes/
│   └── session.php         # Secure session bootstrap
└── NutriWell/              # Public web root
    ├── index.html
    ├── index.php
    ├── about.html
    ├── nutrition.html
    ├── recipes.html
    ├── contact.html
    ├── login.php
    ├── signup.php
    ├── logout.php
    ├── css/
    │   └── style.css
    ├── js/
    │   └── script.js
    └── images/
        └── expert/
```

> The PHP files load `../config/database.php` and `../includes/session.php`, so these two folders must sit **one level above** the folder containing the PHP pages.

---

## Getting Started

### Prerequisites

- PHP 8.0 or higher
- MySQL 5.7+ or MariaDB
- A local server stack such as **XAMPP**, **WAMP**, **MAMP** or **Laragon**

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/NutriWell.git

# 2. Copy the project into your server's web root
#    XAMPP example: C:/xampp/htdocs/

# 3. Start Apache and MySQL from your control panel

# 4. Create the database (see next section)

# 5. Open in your browser
http://localhost/NutriWell/index.html
```

> 💡 The static pages (About, Nutrition, Recipes, Contact) also work by opening the `.html` files directly. Only login, signup and logout require PHP and MySQL.

---

## Database Setup

Create a database and the `users` table:

```sql
CREATE DATABASE nutriwell CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE nutriwell;

CREATE TABLE users (
    id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    full_name     VARCHAR(100)  NOT NULL,
    email         VARCHAR(255)  NOT NULL UNIQUE,
    password_hash VARCHAR(255)  NOT NULL,
    created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

Then create `config/database.php`:

```php
<?php
$conn = new mysqli('localhost', 'DB_USER', 'DB_PASSWORD', 'nutriwell');

if ($conn->connect_error) {
    die('Database connection failed.');
}

$conn->set_charset('utf8mb4');
```

And `includes/session.php`:

```php
<?php
if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params([
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_start();
}
```

> ⚠️ Never commit real database credentials. Add `config/database.php` to `.gitignore`.

---

## Authentication Flow

```
Visitor ──► index.html ──► Sign Up (signup.php) ──► Login (login.php) ──► index.php (members)
                                                                              │
                                                                  Logout (logout.php)
                                                                              │
                                                                       login.php
```

- **Sign Up** validates name, email format, password length (min. 8 characters) and password confirmation, and rejects duplicate emails.
- **Login** verifies credentials and regenerates the session ID.
- **index.php** redirects unauthenticated users to `login.php`.
- **Logout** clears session data, expires the session cookie and destroys the session.

---

## Security

- Passwords stored with `password_hash()` and checked with `password_verify()`
- All queries use **prepared statements** (protection against SQL injection)
- Output escaped with `htmlspecialchars()` (protection against XSS)
- `session_regenerate_id(true)` on login (protection against session fixation)
- Full session and cookie teardown on logout
- Server-side validation in addition to HTML5 client-side validation

---

## Responsive Design & Accessibility

- Layouts built with Flexbox and CSS Grid and tested across desktop, tablet and mobile breakpoints
- Semantic HTML, `aria-label`, `aria-expanded` and `aria-modal` attributes on interactive components
- Alt text on all meaningful images
- Light and dark themes with readable contrast

---

## Featured Expert

**DN Mahnoor** – *Dietitian & Nutritionist*
Specialises in PCOS, diabetes, weight management and personalised diet plans.
Instagram: [@dnmahnoor_01](https://www.instagram.com/dnmahnoor_01/)

---

## Roadmap

- [ ] Personal dashboard for logged-in users (saved recipes, BMI history)
- [ ] Contact form backend (store or email submissions)
- [ ] Password reset via email
- [ ] CSRF tokens on all forms
- [ ] Recipes and foods loaded from the database



<div align="center">

### 🌿 NutriWell
*Eat Better. Live Better.*

© 2026 NutriWell. All rights reserved.

</div>
