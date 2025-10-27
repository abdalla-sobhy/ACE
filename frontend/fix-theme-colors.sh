#!/bin/bash

# Script to replace hard-coded colors with CSS variables for theme support

# Find all CSS module files
CSS_FILES=$(find /home/user/ACE/frontend -name "*.module.css" -type f | grep -v node_modules)

for file in $CSS_FILES; do
  echo "Processing: $file"

  # Create backup
  cp "$file" "$file.backup"

  # Replace gradient colors
  sed -i \
    -e 's/linear-gradient(to right, #58a6ff, #79c0ff)/linear-gradient(to right, var(--gradient-blue-start), var(--gradient-blue-end))/g' \
    -e 's/linear-gradient(to left, #58a6ff, #79c0ff)/linear-gradient(to left, var(--gradient-blue-start), var(--gradient-blue-end))/g' \
    -e 's/linear-gradient(to bottom, #58a6ff, #79c0ff)/linear-gradient(to bottom, var(--gradient-blue-start), var(--gradient-blue-end))/g' \
    -e 's/linear-gradient(45deg, #58a6ff, #79c0ff, #58a6ff)/linear-gradient(45deg, var(--gradient-blue-start), var(--gradient-blue-end), var(--gradient-blue-start))/g' \
    "$file"

  # Replace blue colors
  sed -i \
    -e 's/color: #58a6ff/color: var(--accent-blue)/g' \
    -e 's/color: #388bfd/color: var(--accent-blue-hover)/g' \
    -e 's/color: #79c0ff/color: var(--blue-lighter)/g' \
    -e 's/color: #70b9ff/color: var(--blue)/g' \
    -e 's/color: #0969da/color: var(--blue)/g' \
    -e 's/color: #218bff/color: var(--blue-lighter)/g' \
    -e 's/border-color: #58a6ff/border-color: var(--accent-blue)/g' \
    -e 's/border-color: #388bfd/border-color: var(--accent-blue-hover)/g' \
    -e 's/border-color: #79c0ff/border-color: var(--blue-lighter)/g' \
    -e 's/background: #58a6ff/background: var(--accent-blue)/g' \
    -e 's/background: #388bfd/background: var(--accent-blue-hover)/g' \
    -e 's/background: #79c0ff/background: var(--blue-lighter)/g' \
    -e 's/background: #70b9ff/background: var(--blue)/g' \
    -e 's/background: #0969da/background: var(--blue)/g' \
    -e 's/background: #218bff/background: var(--blue-lighter)/g' \
    "$file"

  # Replace green colors (buttons and success)
  sed -i \
    -e 's/background: #238636/background: var(--btn-primary)/g' \
    -e 's/background: #2ea043/background: var(--btn-primary-hover)/g' \
    -e 's/background: #3fb950/background: var(--success)/g' \
    -e 's/background: #2EA043/background: var(--btn-primary-hover)/g' \
    -e 's/color: #238636/color: var(--btn-primary)/g' \
    -e 's/color: #2ea043/color: var(--btn-primary-hover)/g' \
    -e 's/color: #3fb950/color: var(--success)/g' \
    -e 's/border: 1px solid #238636/border: 1px solid var(--btn-primary)/g' \
    -e 's/border-color: #238636/border-color: var(--btn-primary)/g' \
    -e 's/border-color: #2ea043/border-color: var(--btn-primary-hover)/g' \
    -e 's/border-color: #3fb950/border-color: var(--success)/g' \
    "$file"

  # Replace red colors (errors)
  sed -i \
    -e 's/color: #f85149/color: var(--error)/g' \
    -e 's/color: #d1242f/color: var(--error)/g' \
    -e 's/border-color: #f85149/border-color: var(--error)/g' \
    -e 's/border-color: #d1242f/border-color: var(--error)/g' \
    -e 's/background: #f85149/background: var(--error)/g' \
    -e 's/outline: 2px solid #f85149/outline: 2px solid var(--error)/g' \
    "$file"

  # Replace warning colors
  sed -i \
    -e 's/background: #fb8500/background: var(--warning)/g' \
    -e 's/background: #d29922/background: var(--warning)/g' \
    -e 's/color: #fb8500/color: var(--warning)/g' \
    -e 's/color: #d29922/color: var(--warning)/g' \
    "$file"

  # Replace accent-color
  sed -i \
    -e 's/accent-color: #58a6ff/accent-color: var(--accent-blue)/g' \
    -e 's/accent-color: #388bfd/accent-color: var(--accent-blue-hover)/g' \
    "$file"

  # Replace outline colors
  sed -i \
    -e 's/outline: 2px solid #58a6ff/outline: 2px solid var(--accent-blue)/g' \
    -e 's/outline: 2px solid #388bfd/outline: 2px solid var(--accent-blue-hover)/g' \
    "$file"

  # Replace RGBA colors
  sed -i \
    -e 's/rgba(88, 166, 255, 0\.1)/var(--accent-blue-bg)/g' \
    -e 's/rgba(88, 166, 255, 0\.2)/var(--accent-blue-bg)/g' \
    -e 's/rgba(88, 166, 255, 0\.05)/var(--accent-blue-bg)/g' \
    -e 's/rgba(88, 166, 255, 0\.3)/var(--accent-blue)/g' \
    -e 's/rgba(9, 105, 218, 0\.1)/var(--accent-blue-bg)/g' \
    -e 's/rgba(35, 134, 54, 0\.1)/var(--success-bg)/g' \
    -e 's/rgba(35, 134, 54, 0\.3)/var(--success-bg)/g' \
    -e 's/rgba(46, 160, 67, 0\.1)/var(--success-bg)/g' \
    -e 's/rgba(63, 185, 80, 0\.1)/var(--success-bg)/g' \
    -e 's/rgba(63, 185, 80, 0\.3)/var(--success)/g' \
    -e 's/rgba(248, 81, 73, 0\.1)/var(--error-bg)/g' \
    -e 's/rgba(248, 81, 73, 0\.05)/var(--error-bg)/g' \
    -e 's/rgba(248, 81, 73, 0\.3)/var(--error)/g' \
    -e 's/rgba(209, 36, 47, 0\.1)/var(--error-bg)/g' \
    "$file"

  # Replace border colors
  sed -i \
    -e 's/border: 4px solid #f3f3f3/border: 4px solid var(--input-border-color)/g' \
    -e 's/border-top: 4px solid #3498db/border-top: 4px solid var(--accent-blue)/g' \
    -e 's/border-top: 4px solid #58a6ff/border-top: 4px solid var(--accent-blue)/g' \
    "$file"

  # Replace specific hex colors
  sed -i \
    -e 's/#3498db/var(--accent-blue)/g' \
    -e 's/#2980b9/var(--accent-blue-hover)/g' \
    -e 's/color: #f0f6fc/color: var(--main-text-white-lighter)/g' \
    "$file"

  echo "Completed: $file"
done

echo "All CSS module files have been updated!"
