# sofenggs18agroup2
CSO ADM Dashboard

--- Version 0.1 (November 7, 2017) Issues Resolved ---

1. identical row numbers
2. home navigation link
3. organization list navigation link
4. page redesign
    - Homepage dashboard (/)
    - Organization List Page (/organization-list)
    - Organization-specific dashboard (/organization-list/0)
    - User Admin Settings Page (/settings)
    - 404 Page (/page-not-found)
5. angular search bar function
6. angular table head sorting function
7. search results function
8. dropdown filter function
9. angular modal function
10. dropdown sign in form
11. sticky filters



--- Version 0.2 (November 13, 2017) Issues Resolved ---

1. Connected to gspread and used as database
2. List of organizations and their statistics
3. Org-specific page reflects information accordingly
    - Name of the Organization
    - Statistics (Number of post-acts falling under certain criterion)
    - List of post-acts exclusive for that certain org
4. Modal displays appropriate info according to clicked post-act
5. Polished all forms of table in terms of alignment & custom width per column
6. Displays 404-page up to certain cases
7. Further redesigned the settings page
    - Edit settings tab
8. Revised URL patterns
    - /organization
    - /organization/org-abbreviation



--- Version 0.3 (November 21, 2017) Issues Resolved ---
1. Modals for settings page
2. Fixed filter by month
3. Fixed incorrect filter for status and time
4. post-acts data converted to ajax for capsulation



--- Version 0.4 (November 22, 2017) Issues Resolved ---
1. Added banner in update post-acts
2. refined the filter bar issue
3. Rename ModelJSON.py to modelJSON.py



--- Version 0.5 (November 22, 2017) Issues Resolved ---
1. Fixed the overlapping issues with the sign-in form
2. Sign-in form, with error message, automatically shows when input attempt fails.
3. The whole table row is now clickable
4. Added the ADM logo; clickable and will direct to home dashboard



--- Version 0.6 (November 23, 2017) Issues Resolved ---
1. Whole table row in organization list is now clickable
2. Fixed status dropdown in org-specific modal
3. Fixed search bar function
4. Added an org tooptip feature on main dashboard
5. Fixed the z-layer of the filter dropdown bar
6. Added the ADM logo to page settings



--- Version 0.7 (November 24, 2017) Issues Resolved ---
1. Fixed modal remarks and discarding functions
2. Changes made in application reflects on the gsheets
3. Syncing is now persistent
