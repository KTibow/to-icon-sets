# to-icon-sets

## Motivation

JS-style icon packages are great. They're better than CSS-based, JSON-based, or component-based icons, because they end up having a smaller bundle.

However, the admins at Iconify stopped publishing JS-style icon packages.

## Solution

Use GitHub Actions to host the following process:

- Download JSON icon data from Iconify
- Use `@iconify/tools` to convert them to packages
- Publish them on NPM as `@ktibow/iconset-<name>`  
  _note that each icon set has its own license and is not my own work_
