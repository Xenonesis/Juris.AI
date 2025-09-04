# Release Notes v2.7

## New Features

* Added API keys management system for storing user's AI model API keys
* Implemented secure storage for API keys with Row Level Security (RLS)
* Created database verification and fix scripts for API keys table

## Bug Fixes

* Fixed missing api_keys table in Supabase database
* Resolved database caching issues with API keys table

## Improvements

* Enhanced database schema for better performance with indexes on user_id and model_type
* Improved security with proper RLS policies for API key management
* Added comprehensive database verification script for troubleshooting