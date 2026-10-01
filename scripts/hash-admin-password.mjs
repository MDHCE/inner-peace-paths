#!/usr/bin/env node
// Generates the ADMIN_PASSWORD_HASH value for .env — the equivalent of running
// `htpasswd` for an Apache .htaccess setup.
//
//   node scripts/hash-admin-password.mjs 'the-password-you-want'
//
// Paste the printed line into .env (and into the hosting panel's environment
// variables for production). The plain password is never stored anywhere.

import { randomBytes, scryptSync } from "crypto";

const password = process.argv[2];

if (!password) {
  console.error("Usage: node scripts/hash-admin-password.mjs '<password>'");
  process.exit(1);
}

if (password.length < 12) {
  console.error(`Refusing: password is ${password.length} characters, use at least 12.`);
  process.exit(1);
}

const salt = randomBytes(16);
const key = scryptSync(password, salt, 32);

console.log(`ADMIN_PASSWORD_HASH=scrypt$${salt.toString("hex")}$${key.toString("hex")}`);
