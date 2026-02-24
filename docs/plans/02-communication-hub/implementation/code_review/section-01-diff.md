diff --git a/app/globals.css b/app/globals.css
index ddfa536..5de35e3 100644
--- a/app/globals.css
+++ b/app/globals.css
@@ -2,6 +2,8 @@
 
 @import "tailwindcss";
 
+@plugin "@tailwindcss/forms";
+
 @theme {
   --color-pc-red: #CC0033;
   --color-pc-dark: #111111;
diff --git a/lib/constants.ts b/lib/constants.ts
index b22655c..701b480 100644
--- a/lib/constants.ts
+++ b/lib/constants.ts
@@ -19,3 +19,32 @@ export const SITE_CONFIG = {
   mailingAddress: "P.O. Box 3, Port Clinton, Ohio 43452",
   founded: 1983,
 } as const;
+
+export const MAILCHIMP_CONFIG = {
+  formAction: "https://<dc>.list-manage.com/subscribe/post",
+  userId: "<USER_ID>",
+  audienceId: "<LIST_ID>",
+  honeypotFieldName: "b_<USER_ID>_<LIST_ID>",
+} as const;
+
+export const MAILCHIMP_GROUPS = {
+  sports: {
+    groupId: "<GROUP_ID>",
+    options: {} as Record<string, string>,
+  },
+  level: {
+    groupId: "<GROUP_ID>",
+    options: {} as Record<string, string>,
+  },
+  role: {
+    groupId: "<GROUP_ID>",
+    options: {} as Record<string, string>,
+  },
+} as const;
+
+export const COMMUNITY_URLS = {
+  join: "/join",
+  facebookPage: "https://www.facebook.com/PCathleticboosters",
+  facebookGroup: "https://facebook.com/groups/<GROUP_SLUG>",
+  signupGenius: "https://www.signupgenius.com/<SIGNUP_SLUG>",
+} as const;
diff --git a/lib/data/nav-links.ts b/lib/data/nav-links.ts
index 17d7764..8f325b3 100644
--- a/lib/data/nav-links.ts
+++ b/lib/data/nav-links.ts
@@ -13,4 +13,5 @@ export const navLinks: NavLink[] = [
   { label: "Store", href: "/store" },
   { label: "Resources", href: "/resources" },
   { label: "News", href: "/news" },
+  { label: "Join", href: "/join" },
 ];
diff --git a/package-lock.json b/package-lock.json
index 02f78f8..72406a9 100644
--- a/package-lock.json
+++ b/package-lock.json
@@ -15,6 +15,7 @@
         "react-dom": "19.2.3"
       },
       "devDependencies": {
+        "@tailwindcss/forms": "^0.5.11",
         "@tailwindcss/postcss": "^4",
         "@types/node": "^20",
         "@types/react": "^19",
@@ -1244,6 +1245,19 @@
         "tslib": "^2.8.0"
       }
     },
+    "node_modules/@tailwindcss/forms": {
+      "version": "0.5.11",
+      "resolved": "https://registry.npmjs.org/@tailwindcss/forms/-/forms-0.5.11.tgz",
+      "integrity": "sha512-h9wegbZDPurxG22xZSoWtdzc41/OlNEUQERNqI/0fOwa2aVlWGu7C35E/x6LDyD3lgtztFSSjKZyuVM0hxhbgA==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "mini-svg-data-uri": "^1.2.3"
+      },
+      "peerDependencies": {
+        "tailwindcss": ">=3.0.0 || >= 3.0.0-alpha.1 || >= 4.0.0-alpha.20 || >= 4.0.0-beta.1"
+      }
+    },
     "node_modules/@tailwindcss/node": {
       "version": "4.2.1",
       "resolved": "https://registry.npmjs.org/@tailwindcss/node/-/node-4.2.1.tgz",
@@ -4950,6 +4964,16 @@
         "node": ">=8.6"
       }
     },
+    "node_modules/mini-svg-data-uri": {
+      "version": "1.4.4",
+      "resolved": "https://registry.npmjs.org/mini-svg-data-uri/-/mini-svg-data-uri-1.4.4.tgz",
+      "integrity": "sha512-r9deDe9p5FJUPZAk3A59wGH7Ii9YrjjWw0jmw/liSbHl2CHiyXj6FcDXDu2K3TjVAXqiJdaw3xxwlZZr9E6nHg==",
+      "dev": true,
+      "license": "MIT",
+      "bin": {
+        "mini-svg-data-uri": "cli.js"
+      }
+    },
     "node_modules/minimatch": {
       "version": "3.1.3",
       "resolved": "https://registry.npmjs.org/minimatch/-/minimatch-3.1.3.tgz",
diff --git a/package.json b/package.json
index 0c6c81d..ee1ce0b 100644
--- a/package.json
+++ b/package.json
@@ -16,6 +16,7 @@
     "react-dom": "19.2.3"
   },
   "devDependencies": {
+    "@tailwindcss/forms": "^0.5.11",
     "@tailwindcss/postcss": "^4",
     "@types/node": "^20",
     "@types/react": "^19",
