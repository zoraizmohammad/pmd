#!/usr/bin/env node

const crypto = require("crypto");
const fs = require("fs-extra");
const path = require("path");

const PMD_FOLDER = ".pmd";

// Encrypt function
function encrypt(data, key) {
    const cipher = crypto.createCipheriv("aes-256-cbc", key, key.slice(0, 16));
    let encrypted = cipher.update(data, "utf8", "base64");
    encrypted += cipher.final("base64");
    return encrypted;
}

// Initialize PMD repository
function initRepo() {
    if (!fs.existsSync(PMD_FOLDER)) {
        fs.mkdirSync(PMD_FOLDER);
        const key = crypto.randomBytes(32);
        fs.writeFileSync(path.join(PMD_FOLDER, "key"), key.toString("base64"));
        console.log("PMD initialized successfully!");
    } else {
        console.log("PMD is already initialized in this repository.");
    }

}