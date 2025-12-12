[ 🇪🇸 Versión en Español ](README.md)

# MariaDB Secure Password Generator

A client-side web password generator optimized for **MariaDB/MySQL**. This project allows creating secure credentials and automatically generates SQL user creation commands (`CREATE USER`), correctly handling special character escaping.

![Captura de pantalla](./screenshot.png)

---

## 🚀 Features

- **100% Client-side**: All processing is done in the browser using JavaScript; nothing is sent to a server.
- **MariaDB Optimized**: Algorithms designed to handle "safe" and "risky" characters in SQL syntax.
- **SQL Command Generation**: Automatically generates `CREATE USER` or `SET PASSWORD` statements.
- **Fisher-Yates Shuffle**: Robust implementation for character randomization.
- **Responsive UI**: Modern and adaptive interface built with native CSS.
- **Clipboard Integration**: Quick copy for passwords and SQL commands with a single click.

---

## 🧩 Requirements

- Any modern web browser (Firefox, Chrome, Edge, Safari).
- Requires no web server, Node.js, or database to run.
- **Optional**: Local server (Apache/Nginx) if you wish to host it on a network.

---

## 🧰 Setup

Since this is a static application, no compilation is required.

### 1. Clone the repository

```bash
git clone [https://github.com/your-username/password-generator.git](https://github.com/your-username/password-generator.git)
cd password-generator
```

### 2. Run the application

Simply open the `index.html` file with your preferred browser:

```bash
# From terminal (example for KDE)
kioclient5 exec index.html
# Or simply
firefox index.html
```

---

## 🧠 How It Works

The tool uses `crypto.getRandomValues()` (when available) or `Math.random()` along with the **Fisher-Yates** shuffle algorithm to ensure characters do not follow predictable patterns.

The generation flow in `script.js` follows these steps:
1.  **Selection**: Builds a *charset* based on user preferences (Uppercase, Lowercase, Numbers, Symbols).
2.  **Entropy Guarantee**: Forces the inclusion of at least one character from each selected type before filling the rest.
3.  **Shuffle**: Applies the shuffling algorithm to remove the predictable order of the forced insertion.
4.  **SQL Sanitization**: If "problematic" characters are used (such as `'` or `\`), the tool automatically escapes the string in the visual SQL output to prevent syntax errors in MariaDB.

Example of generated SQL output:
```sql
CREATE USER 'new_user'@'localhost' IDENTIFIED BY 'your_s3cure_password';
```

---

## ⚡ Character Sets

The application classifies special characters into two groups to maximize compatibility with different SQL clients and shells:

| Type | Characters | Compatibility | Recommended Use |
|--------|------|----------------|-----------|
| **Safe** | `! @ # $ % ^ * ( ) _ + - =` | High | **Always** |
| **Risky** | `& ' " ; \ ` ` | Medium/Low | Requires SQL escaping |
| **Alphanumeric** | `A-Z`, `a-z`, `0-9` | Universal | Password base |

*Note: The tool automatically handles the escaping of "Risky" characters within the SQL code block.*

---

## 🧾 License

This project includes components under the following license:

### 1. Font Awesome (Icons)
Used via CDN, under the [CC BY 4.0 License](https://fontawesome.com/license).

### 2. Password Generator Code (this repository)
All original HTML, CSS, and JavaScript code — including generation logic and interface — is © 2025 **X Software** and released under the **MIT License**.

You are free to use, modify, and redistribute this software under the terms of the MIT License.  
See the full license here: [https://opensource.org/licenses/MIT](https://opensource.org/licenses/MIT)

---

## 🧑‍💻 Author

Developed by [**X Software**](https://xsoftware.es).  
Linux software development, web solutions, and system automation.
