#!/bin/bash

# Vercel Deployment Script for Juris.AI

echo "🚀 Starting Vercel deployment for Juris.AI..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Login to Vercel (if not already logged in)
echo "🔐 Checking Vercel authentication..."
vercel whoami || vercel login

# Set up project
echo "📦 Setting up Vercel project..."
vercel link --yes

# Deploy to preview
echo "🔄 Deploying to preview..."
vercel --prod=false

# Deploy to production
echo "🌟 Deploying to production..."
vercel --prod

echo "✅ Deployment complete!"
echo "🌐 Your app is now live on Vercel!"
