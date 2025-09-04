# Release Notes v2.6

## New Features

*

## Bug Fixes

*

## Improvements

* **Summary: Landing Page is Now Default for Non-Logged Users**

  **✅ What Changed:**

  1.  Main Route (/) - Now shows:
      *   Landing page for non-authenticated users (directly, no redirect)
      *   Legal Advisor dashboard for authenticated users (unchanged)
  2.  Performance Improvements:
      *   Eliminated redirect for new visitors
      *   Faster loading - immediate content display
      *   Better SEO - landing content on main domain route
      *   Improved Core Web Vitals
  3.  Backward Compatibility:
      *   Old /landing URLs redirect to main page
      *   All existing functionality preserved
      *   Login/logout flows unchanged
      *   Analytics tracking maintained

  **🚀 User Experience:**

  For New Visitors:
  *   Visit yoursite.com → See landing page immediately ⚡
  *   No redirect delays or loading screens
  *   Cleaner, more professional URLs

  For Logged-in Users:
  *   Visit yoursite.com → Dashboard immediately
  *   Everything works exactly as before
  
  For Old Links:
  *   Any /landing bookmarks redirect to main page
  *   No broken links or 404 errors
  
  **✅ Verification:**
  *   ✅ Build successful
  *   ✅ No TypeScript errors
  *   ✅ All routes functional
  *   ✅ Performance optimizations maintained
  *   ✅ No breaking changes
  
  The landing page is now the default experience for visitors while keeping all existing functionality intact!