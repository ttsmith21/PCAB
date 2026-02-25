diff --git a/__tests__/integration/no-boosterhub.test.ts b/__tests__/integration/no-boosterhub.test.ts
new file mode 100644
index 0000000..3db91a4
--- /dev/null
+++ b/__tests__/integration/no-boosterhub.test.ts
@@ -0,0 +1,51 @@
+import { describe, it, expect } from "vitest";
+import { execSync } from "child_process";
+import path from "path";
+
+describe("BoosterHub removal verification", () => {
+  const rootDir = path.resolve(__dirname, "../..");
+
+  function grepSourceFiles(pattern: string): string[] {
+    try {
+      const result = execSync(
+        `grep -r -i -l "${pattern}" --include="*.ts" --include="*.tsx" --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=out "${rootDir}"`,
+        { encoding: "utf-8" }
+      );
+      return result
+        .trim()
+        .split("\n")
+        .filter((line) => line.length > 0)
+        .filter((line) => !line.includes("docs/plans/"))
+        .filter((line) => !line.includes("__tests__/integration/"));
+    } catch {
+      // grep exit code 1 = no matches = success
+      return [];
+    }
+  }
+
+  it("has zero case-insensitive 'boosterhub' matches in source files (excluding tests)", () => {
+    const matches = grepSourceFiles("boosterhub").filter(
+      (line) => !line.includes("__tests__/")
+    );
+    expect(matches).toEqual([]);
+  });
+
+  it("has zero 'BOOSTERHUB_BASE' references in source files", () => {
+    const matches = grepSourceFiles("BOOSTERHUB_BASE").filter(
+      (line) => !line.includes("__tests__/")
+    );
+    expect(matches).toEqual([]);
+  });
+
+  it("has zero 'BOOSTERHUB_URLS' references in source files", () => {
+    const matches = grepSourceFiles("BOOSTERHUB_URLS").filter(
+      (line) => !line.includes("__tests__/")
+    );
+    expect(matches).toEqual([]);
+  });
+
+  it("has zero references to the old BoosterHub domain", () => {
+    const matches = grepSourceFiles("pcathleticbooster.boosterhub.com");
+    expect(matches).toEqual([]);
+  });
+});
diff --git a/components/home/Hero.tsx b/components/home/Hero.tsx
index 0a4a975..1385312 100644
--- a/components/home/Hero.tsx
+++ b/components/home/Hero.tsx
@@ -1,6 +1,6 @@
 import Button from "@/components/ui/Button";
 import FadeIn from "@/components/ui/FadeIn";
-import { BOOSTERHUB_URLS } from "@/lib/constants";
+import { PAYMENT_URLS } from "@/lib/constants";
 
 export default function Hero() {
   return (
@@ -27,11 +27,11 @@ export default function Hero() {
           </p>
 
           <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
-            <Button href={BOOSTERHUB_URLS.membership} external>
+            <Button href="/membership">
               Become a Member
             </Button>
             <Button
-              href={BOOSTERHUB_URLS.donate}
+              href={PAYMENT_URLS.donate}
               variant="outline"
               external
               className="border-white text-white hover:bg-white hover:text-pc-dark"
diff --git a/docs/plans/03-payment-integration/implementation/deep_implement_config.json b/docs/plans/03-payment-integration/implementation/deep_implement_config.json
index b4941e9..1ab0615 100644
--- a/docs/plans/03-payment-integration/implementation/deep_implement_config.json
+++ b/docs/plans/03-payment-integration/implementation/deep_implement_config.json
@@ -45,6 +45,10 @@
     "section-07-initiatives": {
       "status": "complete",
       "commit_hash": "b7476f9"
+    },
+    "section-08-other-pages": {
+      "status": "complete",
+      "commit_hash": "a2a034f"
     }
   },
   "pre_commit": {
