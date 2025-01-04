# **PMD: Private Markdown Encryption for Public Repositories**

PMD is a CLI tool for creating, encrypting, and managing private `.pmd` files. It allows users to securely encrypt Markdown content with a username and password system, making it accessible only to authorized users. The encrypted `.pmd` files can be viewed with an HTML viewer that decrypts the content in-browser after authentication.

---

## **Features**
- **Encrypt Markdown files**: Secure `.md` files into `.pmd` format with AES encryption.
- **User Authentication**: Embed usernames and passwords directly into the `.pmd` file.
- **HTML Viewer**: Host `.pmd` files publicly and view them after authentication.
- **Simple CLI Commands**: Easy-to-use commands to initialize repositories and manage files.

---

## **Installation**

### **1. Install via NPM**
To use PMD globally on your machine, install it via `npm`:
```bash
npm install -g pmd-cli
```

---

## **Usage**

### **1. Initialize the Repository**
Set up your repository for `.pmd` support:
```bash
pmd init
```

This command:
1. Creates a `.pmd/` folder in the repository.
2. Generates a unique AES encryption key (`.pmd/key`).
3. Creates an `viewer.html` file to decrypt and display `.pmd` files.

---

### **2. Encrypt a Markdown File**
Encrypt a Markdown file into `.pmd` format with embedded usernames and passwords:
```bash
pmd encrypt <file.md> <usernames> <passwords>
```

#### **Example**
```bash
pmd encrypt README.md user1,user2,user3 pass1,pass2,pass3
```

This generates an encrypted `README.pmd` file with the following structure:
```plaintext
<content>[Encrypted markdown content]</content>
<users>[Encrypted usernames]</users>
<passwords>[Encrypted passwords]</passwords>
```

---

### **3. Host the Viewer**
Upload the `viewer.html` file to a public hosting service (e.g., GitHub Pages). Link your `.pmd` files to this viewer to allow users to decrypt and view them.

---

## **File Structure**

When using PMD, your repository will look like this:

```plaintext
project/
├── .pmd/              # PMD configuration folder
│   ├── key            # AES encryption key (generated during init)
├── README.md          # Original Markdown file
├── README.pmd         # Encrypted Markdown file
├── viewer.html        # HTML viewer for `.pmd` files
└── ...                # Other files in your project
```

---

## **Example Workflow**

### **1. Initialize PMD**
```bash
pmd init
```

### **2. Encrypt a File**
```bash
pmd encrypt README.md user1,user2 pass1,pass2
```

### **3. Host Viewer**
- Upload `viewer.html` to GitHub Pages or any public hosting service.
- Share the `.pmd` file and viewer link with your users.

### **4. View Encrypted File**
Users can:
1. Open `viewer.html`.
2. Enter their username and password to decrypt and view the `.pmd` file.

---

## **Development**

### **File Structure**
The PMD project is organized as follows:
```plaintext
pmd-cli/
├── package.json       # NPM configuration
├── index.js           # Main CLI implementation
├── .pmd/              # Configuration folder (created during init)
│   ├── key            # AES encryption key
├── viewer.html        # Decrypt and view `.pmd` files
├── tests/             # Test scripts
│   ├── test-encrypt.js
│   ├── test-init.js
├── examples/          # Sample `.md` and `.pmd` files
│   ├── example.md
│   ├── example.pmd
└── README.md          # Project documentation
```

---

## **Commands**

### **Initialize**
```bash
pmd init
```
- Creates `.pmd/` folder and generates the encryption key.
- Creates the `viewer.html` file for hosting.

### **Encrypt**
```bash
pmd encrypt <file.md> <usernames> <passwords>
```
- Converts `.md` file to `.pmd` with AES encryption.

---

## **Security Considerations**
1. **Encryption Key**: The AES key is stored in `.pmd/key`. Ensure this file is **never shared publicly** (e.g., add `.pmd/` to `.gitignore`).
2. **Public Hosting**: `.pmd` files are public by nature but are unreadable without decryption.

---

## **Future Enhancements**
- **VS Code Extension**:
  - Preview `.pmd` files directly in VS Code.
  - Encrypt and decrypt files from the editor.
- **GitHub Integration**:
  - Enable `.pmd` file previews directly on GitHub repositories.
- **Advanced Authentication**:
  - Add support for hashed passwords.
  - Allow multi-factor authentication for `.pmd` files.

---

## **Contributing**

### **Development Setup**
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/pmd-cli.git
   cd pmd-cli
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Link the package locally:
   ```bash
   npm link
   ```

### **Running Tests**
Use the test scripts in the `tests/` folder to verify functionality:
```bash
node tests/test-init.js
node tests/test-encrypt.js
```
