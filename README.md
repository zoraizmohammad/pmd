# **PMD: Private Markdown Encryption for Public Repositories**

PMD (Private Markdown) is a secure solution for encrypting and managing sensitive markdown files in public repositories. It provides a CLI tool, VS Code extension, and web viewer for seamless integration into your workflow.

## Quick Start

### 1. Install PMD

```bash
# Install globally (recommended)
npm install -g @zoraizmohammad/pmd

# Or install in your project
npm install @zoraizmohammad/pmd
```

### 2. Initialize PMD

```bash
# Initialize PMD in your project
pmd init
```

This will:
- Create a `.pmd` directory for encryption keys
- Add `.pmd` to your `.gitignore`
- Set up the web viewer

### 3. Install the VS Code Extension

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "PMD - Private Markdown"
4. Click Install

### 4. Create a PMD File

#### Using VS Code:
1. Open a markdown file
2. Click the lock icon in the editor title bar
3. Enter usernames and passwords when prompted

#### Using CLI:
```bash
pmd encrypt README.md user1,user2 pass1,pass2
```

### 5. View PMD Files

#### Using VS Code:
1. Open a `.pmd` file
2. Click the preview icon
3. Enter your credentials

#### Using Web Viewer:
1. Open `viewer.html` in your browser
2. Enter the path to your `.pmd` file
3. Enter your credentials

## Features

- 🔒 **Secure Encryption**: AES-256 encryption for your markdown files
- 👥 **Multi-User Access**: Share encrypted files with specific users
- 📝 **Editor Integration**: Seamless VS Code integration
- 🌐 **Web Viewer**: View encrypted files in any browser
- 🛠️ **CLI Tools**: Powerful command-line interface
- 🔄 **Auto Setup**: Automatic project configuration

## CLI Commands

```bash
# Initialize PMD
pmd init

# Encrypt a file
pmd encrypt <file.md> <usernames> <passwords>

# View encrypted file
pmd view <file.pmd>
```

## VS Code Features

- One-click encryption
- Built-in preview
- Context menu integration
- Automatic setup
- Customizable settings

## Security

- Files are encrypted using AES-256
- Encryption keys are stored separately from content
- Credentials are never stored in plain text
- Web viewer uses client-side decryption

## Configuration

### VS Code Settings

```json
{
  "pmd.autoPreview": true,
  "pmd.defaultUsers": ["user1", "user2"]
}
```

### Project Structure

```
your-project/
├── .pmd/              # PMD configuration (gitignored)
│   └── key           # Encryption key
├── docs/
│   ├── secret.md     # Original markdown
│   └── secret.pmd    # Encrypted version
└── viewer.html       # Web viewer
```

## Contributing

We welcome contributions! Please check our [Contributing Guidelines](CONTRIBUTING.md) for details.

## License

ISC License - see [LICENSE](LICENSE) for details.

## Support

- 📖 [Documentation](https://github.com/zoraizmohammad/pmd/wiki)
- 🐛 [Issue Tracker](https://github.com/zoraizmohammad/pmd/issues)
- 💬 [Discussions](https://github.com/zoraizmohammad/pmd/discussions)
