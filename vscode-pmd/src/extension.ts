import * as vscode from 'vscode';
import * as CryptoJS from 'crypto-js';
import * as fs from 'fs';
import * as path from 'path';
import { marked } from 'marked';

export function activate(context: vscode.ExtensionContext) {
    // Register PMD Preview content provider
    const pmdPreviewProvider = new PMDPreviewProvider(context.extensionUri);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(PMDPreviewProvider.viewType, pmdPreviewProvider)
    );

    // Command to encrypt current markdown file
    let encryptCommand = vscode.commands.registerCommand('vscode-pmd.encrypt', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active file to encrypt');
            return;
        }

        if (!editor.document.fileName.endsWith('.md')) {
            vscode.window.showErrorMessage('Current file is not a markdown file');
            return;
        }

        try {
            const usernames = await vscode.window.showInputBox({
                prompt: 'Enter comma-separated usernames',
                placeHolder: 'user1,user2,user3'
            });

            const passwords = await vscode.window.showInputBox({
                prompt: 'Enter comma-separated passwords',
                password: true,
                placeHolder: 'pass1,pass2,pass3'
            });

            if (!usernames || !passwords) {
                return;
            }

            const usernameList = usernames.split(',').map(u => u.trim());
            const passwordList = passwords.split(',').map(p => p.trim());

            if (usernameList.length !== passwordList.length) {
                vscode.window.showErrorMessage('Number of usernames must match number of passwords');
                return;
            }

            const content = editor.document.getText();
            const key = CryptoJS.lib.WordArray.random(256/8).toString();
            
            const encryptedContent = CryptoJS.AES.encrypt(content, key).toString();
            const encryptedUsers = CryptoJS.AES.encrypt(usernameList.join(','), key).toString();
            const encryptedPasswords = CryptoJS.AES.encrypt(passwordList.join(','), key).toString();

            const pmdContent = `
                <content>${encryptedContent}</content>
                <users>${encryptedUsers}</users>
                <passwords>${encryptedPasswords}</passwords>
            `.trim();

            const pmdFile = editor.document.fileName.replace('.md', '.pmd');
            fs.writeFileSync(pmdFile, pmdContent);

            // Save the key
            const pmdDir = path.join(path.dirname(pmdFile), '.pmd');
            if (!fs.existsSync(pmdDir)) {
                fs.mkdirSync(pmdDir);
            }
            fs.writeFileSync(path.join(pmdDir, 'key'), key);

            vscode.window.showInformationMessage(`File encrypted successfully: ${pmdFile}`);
        } catch (error) {
            vscode.window.showErrorMessage(`Error encrypting file: ${error}`);
        }
    });

    // Command to decrypt PMD file
    let decryptCommand = vscode.commands.registerCommand('vscode-pmd.decrypt', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor || !editor.document.fileName.endsWith('.pmd')) {
            vscode.window.showErrorMessage('No active .pmd file to decrypt');
            return;
        }

        try {
            const username = await vscode.window.showInputBox({
                prompt: 'Enter your username'
            });

            const password = await vscode.window.showInputBox({
                prompt: 'Enter your password',
                password: true
            });

            if (!username || !password) {
                return;
            }

            const content = editor.document.getText();
            const pmdDir = path.join(path.dirname(editor.document.fileName), '.pmd');
            const key = fs.readFileSync(path.join(pmdDir, 'key'), 'utf8');

            // Parse PMD content
            const contentMatch = content.match(/<content>(.*?)<\/content>/s);
            const usersMatch = content.match(/<users>(.*?)<\/users>/s);
            const passwordsMatch = content.match(/<passwords>(.*?)<\/passwords>/s);

            if (!contentMatch || !usersMatch || !passwordsMatch) {
                throw new Error('Invalid PMD file format');
            }

            const encryptedContent = contentMatch[1];
            const encryptedUsers = usersMatch[1];
            const encryptedPasswords = passwordsMatch[1];

            // Decrypt users and passwords
            const users = CryptoJS.AES.decrypt(encryptedUsers, key).toString(CryptoJS.enc.Utf8).split(',');
            const passwords = CryptoJS.AES.decrypt(encryptedPasswords, key).toString(CryptoJS.enc.Utf8).split(',');

            // Verify credentials
            const userIndex = users.indexOf(username);
            if (userIndex === -1 || passwords[userIndex] !== password) {
                throw new Error('Invalid credentials');
            }

            // Decrypt content
            const decryptedContent = CryptoJS.AES.decrypt(encryptedContent, key).toString(CryptoJS.enc.Utf8);

            // Create new document with decrypted content
            const decryptedDoc = await vscode.workspace.openTextDocument({
                content: decryptedContent,
                language: 'markdown'
            });
            await vscode.window.showTextDocument(decryptedDoc);

        } catch (error) {
            vscode.window.showErrorMessage(`Error decrypting file: ${error}`);
        }
    });

    context.subscriptions.push(encryptCommand, decryptCommand);
}

class PMDPreviewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'pmd.preview';

    constructor(
        private readonly _extensionUri: vscode.Uri,
    ) { }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                this._extensionUri
            ]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        // Handle messages from the webview
        webviewView.webview.onDidReceiveMessage(
            async message => {
                switch (message.command) {
                    case 'decrypt':
                        // Handle decryption request
                        break;
                }
            },
            undefined,
            []
        );
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>PMD Preview</title>
            </head>
            <body>
                <div id="login">
                    <h2>PMD File Preview</h2>
                    <input type="text" id="username" placeholder="Username">
                    <input type="password" id="password" placeholder="Password">
                    <button onclick="decrypt()">View Content</button>
                </div>
                <div id="content"></div>
                <script>
                    const vscode = acquireVsCodeApi();
                    
                    function decrypt() {
                        const username = document.getElementById('username').value;
                        const password = document.getElementById('password').value;
                        vscode.postMessage({
                            command: 'decrypt',
                            username,
                            password
                        });
                    }
                </script>
            </body>
            </html>`;
    }
}

export function deactivate() {}
