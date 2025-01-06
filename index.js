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