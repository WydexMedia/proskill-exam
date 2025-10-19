#!/bin/bash

# Certificate Test Script
# Usage: ./test-certificate.sh [name] [date]
# Example: ./test-certificate.sh "JANE SMITH" "25 Dec 2024"

echo "🎓 Certificate Generator Test Script"
echo "=================================="

# Check if we're in the correct directory
if [ ! -f "test-generate-certificate.ts" ]; then
    echo "❌ Error: test-generate-certificate.ts not found. Please run this script from the exam-platform directory."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed or not in PATH."
    exit 1
fi

# Check if TypeScript is available
if ! command -v npx &> /dev/null; then
    echo "❌ Error: npx is not available."
    exit 1
fi

# Set default values
NAME=${1:-"JOHN DOE"}
DATE=${2:-$(date +"%d %b %Y")}

echo "📝 Testing certificate generation..."
echo "   Name: $NAME"
echo "   Date: $DATE"
echo ""

# Run the test
echo "🚀 Generating certificate..."

# Try different approaches to run the TypeScript file
if npx ts-node --esm test-generate-certificate.ts "$NAME" "$DATE" 2>/dev/null; then
    echo "✅ Success with --esm flag"
elif npx ts-node test-generate-certificate.ts "$NAME" "$DATE" 2>/dev/null; then
    echo "✅ Success with standard ts-node"
else
    # Fallback: compile to JS first
    echo "📦 Compiling TypeScript to JavaScript..."
    npx tsc test-generate-certificate.ts --target ES2020 --module commonjs --esModuleInterop --allowSyntheticDefaultImports --outDir ./temp
    if [ $? -eq 0 ]; then
        echo "🚀 Running compiled JavaScript..."
        node ./temp/test-generate-certificate.js "$NAME" "$DATE"
        rm -rf ./temp
    else
        echo "❌ TypeScript compilation failed!"
        exit 1
    fi
fi

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Certificate generated successfully!"
    echo "📁 Check the current directory for the generated PDF file."
else
    echo ""
    echo "❌ Certificate generation failed!"
    exit 1
fi
