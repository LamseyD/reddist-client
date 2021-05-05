# Next.js
In Next.js, any page you create is instantly a route.

# Server Side Rendering (SSR)
me -> browse http://localhost:3000
-> next.js server
-> request graphql server
-> building html
-> send it back to browser

when going back, it does client site routing and not server site rendering, loads items from browser.

don't server side render all the pages, server side render on pages with dynamic data and important data

# Client Side 
    request -> browse -> graphql api

That is why we had that issue where posts didn't have any upvotes. Cookie Session didn't get sent. because the results haven't got back yet.