diff --git a/__tests__/components/ui/CuratorFeed.test.tsx b/__tests__/components/ui/CuratorFeed.test.tsx
new file mode 100644
index 0000000..9f852c6
--- /dev/null
+++ b/__tests__/components/ui/CuratorFeed.test.tsx
@@ -0,0 +1,62 @@
+import { describe, it, expect, vi } from "vitest";
+import { render } from "@testing-library/react";
+import CuratorFeed from "@/components/ui/CuratorFeed";
+
+// Mock next/script -- same pattern used in StripeBuyButton.test.tsx.
+// Renders a plain <script> tag so we can assert src, strategy, and id.
+vi.mock("next/script", () => ({
+  __esModule: true,
+  default: (props: Record<string, unknown>) => {
+    return (
+      <script
+        data-testid="curator-script"
+        src={props.src as string}
+        data-strategy={props.strategy as string}
+        id={props.id as string}
+      />
+    );
+  },
+}));
+
+describe("CuratorFeed", () => {
+  it("renders a container div with data-crt-feed-id matching the feedId prop", () => {
+    const { container } = render(<CuratorFeed feedId="abc123" />);
+    const div = container.querySelector("[data-crt-feed-id]");
+    expect(div).not.toBeNull();
+    expect(div?.getAttribute("data-crt-feed-id")).toBe("abc123");
+  });
+
+  it("renders a Script element with src pointing to the published feed URL", () => {
+    const { getByTestId } = render(<CuratorFeed feedId="abc123" />);
+    const script = getByTestId("curator-script");
+    expect(script.getAttribute("src")).toBe(
+      "https://cdn.curator.io/published/abc123.js"
+    );
+  });
+
+  it("sets the Script strategy to lazyOnload", () => {
+    const { getByTestId } = render(<CuratorFeed feedId="abc123" />);
+    const script = getByTestId("curator-script");
+    expect(script.getAttribute("data-strategy")).toBe("lazyOnload");
+  });
+
+  it("sets a unique Script id containing the feedId", () => {
+    const { getByTestId } = render(<CuratorFeed feedId="abc123" />);
+    const script = getByTestId("curator-script");
+    expect(script.getAttribute("id")).toContain("abc123");
+  });
+
+  it("applies optional className to the container div", () => {
+    const { container } = render(
+      <CuratorFeed feedId="abc123" className="mt-4 w-full" />
+    );
+    const div = container.querySelector("[data-crt-feed-id]");
+    expect(div?.className).toContain("mt-4 w-full");
+  });
+
+  it("renders the container div without className when the prop is omitted", () => {
+    const { container } = render(<CuratorFeed feedId="abc123" />);
+    const div = container.querySelector("[data-crt-feed-id]");
+    expect(div?.className).toBe("");
+  });
+});
diff --git a/components/ui/CuratorFeed.tsx b/components/ui/CuratorFeed.tsx
new file mode 100644
index 0000000..a292197
--- /dev/null
+++ b/components/ui/CuratorFeed.tsx
@@ -0,0 +1,21 @@
+"use client";
+
+import Script from "next/script";
+
+interface CuratorFeedProps {
+  feedId: string;
+  className?: string;
+}
+
+export default function CuratorFeed({ feedId, className }: CuratorFeedProps) {
+  return (
+    <>
+      <div data-crt-feed-id={feedId} className={className ?? ""} />
+      <Script
+        src={`https://cdn.curator.io/published/${feedId}.js`}
+        strategy="lazyOnload"
+        id={`curator-${feedId}`}
+      />
+    </>
+  );
+}
diff --git a/docs/plans/04-social-media-news-feed/implementation/deep_implement_config.json b/docs/plans/04-social-media-news-feed/implementation/deep_implement_config.json
index eec4a25..d0c71d9 100644
--- a/docs/plans/04-social-media-news-feed/implementation/deep_implement_config.json
+++ b/docs/plans/04-social-media-news-feed/implementation/deep_implement_config.json
@@ -1,9 +1,9 @@
 {
   "plugin_root": "C:\\Users\\tsmith\\.claude\\plugins\\cache\\piercelamb-plugins\\deep-implement\\0.2.0",
-  "sections_dir": "C:\\Users\\tsmith\\OneDrive - Northern Manufacturing Co., Inc\\Documents\\GitHub\\PC-Boosters-Web\\docs\\plans\\04-social-media-news-feed\\sections",
-  "target_dir": "C:\\Users\\tsmith\\OneDrive - Northern Manufacturing Co., Inc\\Documents\\GitHub\\PC-Boosters-Web",
-  "state_dir": "C:\\Users\\tsmith\\OneDrive - Northern Manufacturing Co., Inc\\Documents\\GitHub\\PC-Boosters-Web\\docs\\plans\\04-social-media-news-feed\\implementation",
-  "git_root": "C:\\Users\\tsmith\\OneDrive - Northern Manufacturing Co., Inc\\Documents\\GitHub\\PC-Boosters-Web",
+  "sections_dir": "C:\\GitHub\\PCAB\\docs\\plans\\04-social-media-news-feed\\sections",
+  "target_dir": "C:\\GitHub\\PCAB",
+  "state_dir": "C:\\GitHub\\PCAB\\docs\\plans\\04-social-media-news-feed\\implementation",
+  "git_root": "C:\\GitHub\\PCAB",
   "commit_style": "conventional",
   "test_command": "uv run pytest",
   "sections": [
@@ -16,7 +16,12 @@
     "section-07-footer-modification",
     "section-08-cleanup-and-integration"
   ],
-  "sections_state": {},
+  "sections_state": {
+    "section-01-constants-and-dependencies": {
+      "status": "complete",
+      "commit_hash": "9d8d71e"
+    }
+  },
   "pre_commit": {
     "present": false,
     "type": "none",
@@ -25,5 +30,5 @@
     "may_modify_files": false,
     "detected_formatters": []
   },
-  "created_at": "2026-02-25T02:00:40.003115+00:00"
+  "created_at": "2026-02-25T11:47:07.172331+00:00"
 }
\ No newline at end of file
