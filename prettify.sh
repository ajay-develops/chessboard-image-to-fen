#!/bin/bash

# Prettify all files not ignored by .gitignore
git ls-files --cached --others --exclude-standard | grep -E '\.(js|jsx|ts|tsx)$' | xargs npx prettier --write
# Run ESLint to fix issues (including react/jsx-sort-props)
npx eslint --fix $(git ls-files --cached --others --exclude-standard | grep -E '\.(js|jsx|ts|tsx)$')