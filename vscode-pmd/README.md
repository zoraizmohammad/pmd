# PMD - Private Markdown Extension for VS Code

This extension adds support for PMD (Private Markdown) files in Visual Studio Code. PMD allows you to securely encrypt markdown files with username/password protection, making it perfect for storing sensitive documentation in public repositories.

## Features

- 🔒 **Encrypt Markdown Files**: Convert `.md` files to encrypted `.pmd` files
- 🔑 **Secure Access**: View encrypted files with username/password authentication
- 👀 **Preview Support**: Built-in preview for `.pmd` files
- 🛠️ **Easy Integration**: Automatic setup and configuration

## Getting Started

1. Install the PMD CLI tool:
   ```bash
   npm install -g @zoraizmohammad/pmd
   ```

2. Initialize PMD in your workspace:
   - Open the command palette (Ctrl+Shift+P)
   - Run "PMD: Initialize in Workspace"

3. Encrypt a markdown file:
   - Open a `.md` file
   - Click the lock icon in the editor title bar
   - Or use the command palette: "PMD: Encrypt Markdown File"
   - Enter usernames and passwords when prompted

4. View encrypted files:
   - Open a `.pmd` file
   - Click the preview icon in the editor title bar
   - Or use the command palette: "PMD: Preview PMD File"
   - Enter your credentials to view the content

## Extension Settings

This extension contributes the following settings:

* `pmd.autoPreview`: Enable/disable automatic preview when opening `.pmd` files
* `pmd.defaultUsers`: Set default usernames to suggest during encryption

## Commands

- `PMD: Initialize in Workspace`: Set up PMD in the current workspace
- `PMD: Encrypt Markdown File`: Convert current markdown file to PMD format
- `PMD: Decrypt PMD File`: Decrypt a PMD file (requires credentials)
- `PMD: Preview PMD File`: Open the PMD file in the preview panel

## Security

- All encryption is done locally using AES-256
- Credentials are never stored or transmitted
- Files are only decrypted when valid credentials are provided

## Contributing

Found a bug or have a feature request? Please open an issue on our [GitHub repository](https://github.com/zoraizmohammad/pmd).

## License

This extension is licensed under the ISC License. See the LICENSE file for details.
