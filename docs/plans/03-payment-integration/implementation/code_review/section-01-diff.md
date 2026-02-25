diff --git a/__tests__/sanity.test.ts b/__tests__/sanity.test.ts
new file mode 100644
index 0000000..716ce05
--- /dev/null
+++ b/__tests__/sanity.test.ts
@@ -0,0 +1,5 @@
+describe("test setup", () => {
+  it("vitest runs successfully", () => {
+    expect(1 + 1).toBe(2);
+  });
+});
diff --git a/__tests__/setup.ts b/__tests__/setup.ts
new file mode 100644
index 0000000..7815223
--- /dev/null
+++ b/__tests__/setup.ts
@@ -0,0 +1,2 @@
+/// <reference types="vitest/globals" />
+import "@testing-library/jest-dom/vitest";
diff --git a/package-lock.json b/package-lock.json
index 72406a9..5c28e3c 100644
--- a/package-lock.json
+++ b/package-lock.json
@@ -17,15 +17,34 @@
       "devDependencies": {
         "@tailwindcss/forms": "^0.5.11",
         "@tailwindcss/postcss": "^4",
+        "@testing-library/jest-dom": "^6.9.1",
+        "@testing-library/react": "^16.3.2",
         "@types/node": "^20",
         "@types/react": "^19",
         "@types/react-dom": "^19",
+        "@vitejs/plugin-react": "^5.1.4",
         "eslint": "^9",
         "eslint-config-next": "16.1.6",
+        "jsdom": "^28.1.0",
         "tailwindcss": "^4",
-        "typescript": "^5"
+        "typescript": "^5",
+        "vitest": "^4.0.18"
       }
     },
+    "node_modules/@acemir/cssom": {
+      "version": "0.9.31",
+      "resolved": "https://registry.npmjs.org/@acemir/cssom/-/cssom-0.9.31.tgz",
+      "integrity": "sha512-ZnR3GSaH+/vJ0YlHau21FjfLYjMpYVIzTD8M8vIEQvIGxeOXyXdzCI140rrCY862p/C/BbzWsjc1dgnM9mkoTA==",
+      "dev": true,
+      "license": "MIT"
+    },
+    "node_modules/@adobe/css-tools": {
+      "version": "4.4.4",
+      "resolved": "https://registry.npmjs.org/@adobe/css-tools/-/css-tools-4.4.4.tgz",
+      "integrity": "sha512-Elp+iwUx5rN5+Y8xLt5/GRoG20WGoDCQ/1Fb+1LiGtvwbDavuSk0jhD/eZdckHAuzcDzccnkv+rEjyWfRx18gg==",
+      "dev": true,
+      "license": "MIT"
+    },
     "node_modules/@alloc/quick-lru": {
       "version": "5.2.0",
       "resolved": "https://registry.npmjs.org/@alloc/quick-lru/-/quick-lru-5.2.0.tgz",
@@ -39,6 +58,64 @@
         "url": "https://github.com/sponsors/sindresorhus"
       }
     },
+    "node_modules/@asamuzakjp/css-color": {
+      "version": "5.0.1",
+      "resolved": "https://registry.npmjs.org/@asamuzakjp/css-color/-/css-color-5.0.1.tgz",
+      "integrity": "sha512-2SZFvqMyvboVV1d15lMf7XiI3m7SDqXUuKaTymJYLN6dSGadqp+fVojqJlVoMlbZnlTmu3S0TLwLTJpvBMO1Aw==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@csstools/css-calc": "^3.1.1",
+        "@csstools/css-color-parser": "^4.0.2",
+        "@csstools/css-parser-algorithms": "^4.0.0",
+        "@csstools/css-tokenizer": "^4.0.0",
+        "lru-cache": "^11.2.6"
+      },
+      "engines": {
+        "node": "^20.19.0 || ^22.12.0 || >=24.0.0"
+      }
+    },
+    "node_modules/@asamuzakjp/css-color/node_modules/lru-cache": {
+      "version": "11.2.6",
+      "resolved": "https://registry.npmjs.org/lru-cache/-/lru-cache-11.2.6.tgz",
+      "integrity": "sha512-ESL2CrkS/2wTPfuend7Zhkzo2u0daGJ/A2VucJOgQ/C48S/zB8MMeMHSGKYpXhIjbPxfuezITkaBH1wqv00DDQ==",
+      "dev": true,
+      "license": "BlueOak-1.0.0",
+      "engines": {
+        "node": "20 || >=22"
+      }
+    },
+    "node_modules/@asamuzakjp/dom-selector": {
+      "version": "6.8.1",
+      "resolved": "https://registry.npmjs.org/@asamuzakjp/dom-selector/-/dom-selector-6.8.1.tgz",
+      "integrity": "sha512-MvRz1nCqW0fsy8Qz4dnLIvhOlMzqDVBabZx6lH+YywFDdjXhMY37SmpV1XFX3JzG5GWHn63j6HX6QPr3lZXHvQ==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@asamuzakjp/nwsapi": "^2.3.9",
+        "bidi-js": "^1.0.3",
+        "css-tree": "^3.1.0",
+        "is-potential-custom-element-name": "^1.0.1",
+        "lru-cache": "^11.2.6"
+      }
+    },
+    "node_modules/@asamuzakjp/dom-selector/node_modules/lru-cache": {
+      "version": "11.2.6",
+      "resolved": "https://registry.npmjs.org/lru-cache/-/lru-cache-11.2.6.tgz",
+      "integrity": "sha512-ESL2CrkS/2wTPfuend7Zhkzo2u0daGJ/A2VucJOgQ/C48S/zB8MMeMHSGKYpXhIjbPxfuezITkaBH1wqv00DDQ==",
+      "dev": true,
+      "license": "BlueOak-1.0.0",
+      "engines": {
+        "node": "20 || >=22"
+      }
+    },
+    "node_modules/@asamuzakjp/nwsapi": {
+      "version": "2.3.9",
+      "resolved": "https://registry.npmjs.org/@asamuzakjp/nwsapi/-/nwsapi-2.3.9.tgz",
+      "integrity": "sha512-n8GuYSrI9bF7FFZ/SjhwevlHc8xaVlb/7HmHelnc/PZXBD2ZR49NnN9sMMuDdEGPeeRQ5d0hqlSlEpgCX3Wl0Q==",
+      "dev": true,
+      "license": "MIT"
+    },
     "node_modules/@babel/code-frame": {
       "version": "7.29.0",
       "resolved": "https://registry.npmjs.org/@babel/code-frame/-/code-frame-7.29.0.tgz",
@@ -171,6 +248,16 @@
         "@babel/core": "^7.0.0"
       }
     },
+    "node_modules/@babel/helper-plugin-utils": {
+      "version": "7.28.6",
+      "resolved": "https://registry.npmjs.org/@babel/helper-plugin-utils/-/helper-plugin-utils-7.28.6.tgz",
+      "integrity": "sha512-S9gzZ/bz83GRysI7gAD4wPT/AI3uCnY+9xn+Mx/KPs2JwHJIz1W8PZkg2cqyt3RNOBM8ejcXhV6y8Og7ly/Dug==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">=6.9.0"
+      }
+    },
     "node_modules/@babel/helper-string-parser": {
       "version": "7.27.1",
       "resolved": "https://registry.npmjs.org/@babel/helper-string-parser/-/helper-string-parser-7.27.1.tgz",
@@ -231,6 +318,48 @@
         "node": ">=6.0.0"
       }
     },
+    "node_modules/@babel/plugin-transform-react-jsx-self": {
+      "version": "7.27.1",
+      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-react-jsx-self/-/plugin-transform-react-jsx-self-7.27.1.tgz",
+      "integrity": "sha512-6UzkCs+ejGdZ5mFFC/OCUrv028ab2fp1znZmCZjAOBKiBK2jXD1O+BPSfX8X2qjJ75fZBMSnQn3Rq2mrBJK2mw==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@babel/helper-plugin-utils": "^7.27.1"
+      },
+      "engines": {
+        "node": ">=6.9.0"
+      },
+      "peerDependencies": {
+        "@babel/core": "^7.0.0-0"
+      }
+    },
+    "node_modules/@babel/plugin-transform-react-jsx-source": {
+      "version": "7.27.1",
+      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-react-jsx-source/-/plugin-transform-react-jsx-source-7.27.1.tgz",
+      "integrity": "sha512-zbwoTsBruTeKB9hSq73ha66iFeJHuaFkUbwvqElnygoNbj/jHRsSeokowZFN3CZ64IvEqcmmkVe89OPXc7ldAw==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@babel/helper-plugin-utils": "^7.27.1"
+      },
+      "engines": {
+        "node": ">=6.9.0"
+      },
+      "peerDependencies": {
+        "@babel/core": "^7.0.0-0"
+      }
+    },
+    "node_modules/@babel/runtime": {
+      "version": "7.28.6",
+      "resolved": "https://registry.npmjs.org/@babel/runtime/-/runtime-7.28.6.tgz",
+      "integrity": "sha512-05WQkdpL9COIMz4LjTxGpPNCdlpyimKppYNoJ5Di5EUObifl8t4tuLuUBBZEpoLYOmfvIWrsp9fCl0HoPRVTdA==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">=6.9.0"
+      }
+    },
     "node_modules/@babel/template": {
       "version": "7.28.6",
       "resolved": "https://registry.npmjs.org/@babel/template/-/template-7.28.6.tgz",
@@ -279,6 +408,151 @@
         "node": ">=6.9.0"
       }
     },
+    "node_modules/@bramus/specificity": {
+      "version": "2.4.2",
+      "resolved": "https://registry.npmjs.org/@bramus/specificity/-/specificity-2.4.2.tgz",
+      "integrity": "sha512-ctxtJ/eA+t+6q2++vj5j7FYX3nRu311q1wfYH3xjlLOsczhlhxAg2FWNUXhpGvAw3BWo1xBcvOV6/YLc2r5FJw==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "css-tree": "^3.0.0"
+      },
+      "bin": {
+        "specificity": "bin/cli.js"
+      }
+    },
+    "node_modules/@csstools/color-helpers": {
+      "version": "6.0.2",
+      "resolved": "https://registry.npmjs.org/@csstools/color-helpers/-/color-helpers-6.0.2.tgz",
+      "integrity": "sha512-LMGQLS9EuADloEFkcTBR3BwV/CGHV7zyDxVRtVDTwdI2Ca4it0CCVTT9wCkxSgokjE5Ho41hEPgb8OEUwoXr6Q==",
+      "dev": true,
+      "funding": [
+        {
+          "type": "github",
+          "url": "https://github.com/sponsors/csstools"
+        },
+        {
+          "type": "opencollective",
+          "url": "https://opencollective.com/csstools"
+        }
+      ],
+      "license": "MIT-0",
+      "engines": {
+        "node": ">=20.19.0"
+      }
+    },
+    "node_modules/@csstools/css-calc": {
+      "version": "3.1.1",
+      "resolved": "https://registry.npmjs.org/@csstools/css-calc/-/css-calc-3.1.1.tgz",
+      "integrity": "sha512-HJ26Z/vmsZQqs/o3a6bgKslXGFAungXGbinULZO3eMsOyNJHeBBZfup5FiZInOghgoM4Hwnmw+OgbJCNg1wwUQ==",
+      "dev": true,
+      "funding": [
+        {
+          "type": "github",
+          "url": "https://github.com/sponsors/csstools"
+        },
+        {
+          "type": "opencollective",
+          "url": "https://opencollective.com/csstools"
+        }
+      ],
+      "license": "MIT",
+      "engines": {
+        "node": ">=20.19.0"
+      },
+      "peerDependencies": {
+        "@csstools/css-parser-algorithms": "^4.0.0",
+        "@csstools/css-tokenizer": "^4.0.0"
+      }
+    },
+    "node_modules/@csstools/css-color-parser": {
+      "version": "4.0.2",
+      "resolved": "https://registry.npmjs.org/@csstools/css-color-parser/-/css-color-parser-4.0.2.tgz",
+      "integrity": "sha512-0GEfbBLmTFf0dJlpsNU7zwxRIH0/BGEMuXLTCvFYxuL1tNhqzTbtnFICyJLTNK4a+RechKP75e7w42ClXSnJQw==",
+      "dev": true,
+      "funding": [
+        {
+          "type": "github",
+          "url": "https://github.com/sponsors/csstools"
+        },
+        {
+          "type": "opencollective",
+          "url": "https://opencollective.com/csstools"
+        }
+      ],
+      "license": "MIT",
+      "dependencies": {
+        "@csstools/color-helpers": "^6.0.2",
+        "@csstools/css-calc": "^3.1.1"
+      },
+      "engines": {
+        "node": ">=20.19.0"
+      },
+      "peerDependencies": {
+        "@csstools/css-parser-algorithms": "^4.0.0",
+        "@csstools/css-tokenizer": "^4.0.0"
+      }
+    },
+    "node_modules/@csstools/css-parser-algorithms": {
+      "version": "4.0.0",
+      "resolved": "https://registry.npmjs.org/@csstools/css-parser-algorithms/-/css-parser-algorithms-4.0.0.tgz",
+      "integrity": "sha512-+B87qS7fIG3L5h3qwJ/IFbjoVoOe/bpOdh9hAjXbvx0o8ImEmUsGXN0inFOnk2ChCFgqkkGFQ+TpM5rbhkKe4w==",
+      "dev": true,
+      "funding": [
+        {
+          "type": "github",
+          "url": "https://github.com/sponsors/csstools"
+        },
+        {
+          "type": "opencollective",
+          "url": "https://opencollective.com/csstools"
+        }
+      ],
+      "license": "MIT",
+      "engines": {
+        "node": ">=20.19.0"
+      },
+      "peerDependencies": {
+        "@csstools/css-tokenizer": "^4.0.0"
+      }
+    },
+    "node_modules/@csstools/css-syntax-patches-for-csstree": {
+      "version": "1.0.28",
+      "resolved": "https://registry.npmjs.org/@csstools/css-syntax-patches-for-csstree/-/css-syntax-patches-for-csstree-1.0.28.tgz",
+      "integrity": "sha512-1NRf1CUBjnr3K7hu8BLxjQrKCxEe8FP/xmPTenAxCRZWVLbmGotkFvG9mfNpjA6k7Bw1bw4BilZq9cu19RA5pg==",
+      "dev": true,
+      "funding": [
+        {
+          "type": "github",
+          "url": "https://github.com/sponsors/csstools"
+        },
+        {
+          "type": "opencollective",
+          "url": "https://opencollective.com/csstools"
+        }
+      ],
+      "license": "MIT-0"
+    },
+    "node_modules/@csstools/css-tokenizer": {
+      "version": "4.0.0",
+      "resolved": "https://registry.npmjs.org/@csstools/css-tokenizer/-/css-tokenizer-4.0.0.tgz",
+      "integrity": "sha512-QxULHAm7cNu72w97JUNCBFODFaXpbDg+dP8b/oWFAZ2MTRppA3U00Y2L1HqaS4J6yBqxwa/Y3nMBaxVKbB/NsA==",
+      "dev": true,
+      "funding": [
+        {
+          "type": "github",
+          "url": "https://github.com/sponsors/csstools"
+        },
+        {
+          "type": "opencollective",
+          "url": "https://opencollective.com/csstools"
+        }
+      ],
+      "license": "MIT",
+      "engines": {
+        "node": ">=20.19.0"
+      }
+    },
     "node_modules/@emnapi/core": {
       "version": "1.8.1",
       "resolved": "https://registry.npmjs.org/@emnapi/core/-/core-1.8.1.tgz",
@@ -312,922 +586,1739 @@
         "tslib": "^2.4.0"
       }
     },
-    "node_modules/@eslint-community/eslint-utils": {
-      "version": "4.9.1",
-      "resolved": "https://registry.npmjs.org/@eslint-community/eslint-utils/-/eslint-utils-4.9.1.tgz",
-      "integrity": "sha512-phrYmNiYppR7znFEdqgfWHXR6NCkZEK7hwWDHZUjit/2/U0r6XvkDl0SYnoM51Hq7FhCGdLDT6zxCCOY1hexsQ==",
+    "node_modules/@esbuild/aix-ppc64": {
+      "version": "0.27.3",
+      "resolved": "https://registry.npmjs.org/@esbuild/aix-ppc64/-/aix-ppc64-0.27.3.tgz",
+      "integrity": "sha512-9fJMTNFTWZMh5qwrBItuziu834eOCUcEqymSH7pY+zoMVEZg3gcPuBNxH1EvfVYe9h0x/Ptw8KBzv7qxb7l8dg==",
+      "cpu": [
+        "ppc64"
+      ],
       "dev": true,
       "license": "MIT",
-      "dependencies": {
-        "eslint-visitor-keys": "^3.4.3"
-      },
+      "optional": true,
+      "os": [
+        "aix"
+      ],
       "engines": {
-        "node": "^12.22.0 || ^14.17.0 || >=16.0.0"
-      },
-      "funding": {
-        "url": "https://opencollective.com/eslint"
-      },
-      "peerDependencies": {
-        "eslint": "^6.0.0 || ^7.0.0 || >=8.0.0"
+        "node": ">=18"
       }
     },
-    "node_modules/@eslint-community/eslint-utils/node_modules/eslint-visitor-keys": {
-      "version": "3.4.3",
-      "resolved": "https://registry.npmjs.org/eslint-visitor-keys/-/eslint-visitor-keys-3.4.3.tgz",
-      "integrity": "sha512-wpc+LXeiyiisxPlEkUzU6svyS1frIO3Mgxj1fdy7Pm8Ygzguax2N3Fa/D/ag1WqbOprdI+uY6wMUl8/a2G+iag==",
+    "node_modules/@esbuild/android-arm": {
+      "version": "0.27.3",
+      "resolved": "https://registry.npmjs.org/@esbuild/android-arm/-/android-arm-0.27.3.tgz",
+      "integrity": "sha512-i5D1hPY7GIQmXlXhs2w8AWHhenb00+GxjxRncS2ZM7YNVGNfaMxgzSGuO8o8SJzRc/oZwU2bcScvVERk03QhzA==",
+      "cpu": [
+        "arm"
+      ],
       "dev": true,
-      "license": "Apache-2.0",
+      "license": "MIT",
+      "optional": true,
+      "os": [
+        "android"
+      ],
       "engines": {
-        "node": "^12.22.0 || ^14.17.0 || >=16.0.0"
-      },
-      "funding": {
-        "url": "https://opencollective.com/eslint"
+        "node": ">=18"
       }
     },
-    "node_modules/@eslint-community/regexpp": {
-      "version": "4.12.2",
-      "resolved": "https://registry.npmjs.org/@eslint-community/regexpp/-/regexpp-4.12.2.tgz",
-      "integrity": "sha512-EriSTlt5OC9/7SXkRSCAhfSxxoSUgBm33OH+IkwbdpgoqsSsUg7y3uh+IICI/Qg4BBWr3U2i39RpmycbxMq4ew==",
+    "node_modules/@esbuild/android-arm64": {
+      "version": "0.27.3",
+      "resolved": "https://registry.npmjs.org/@esbuild/android-arm64/-/android-arm64-0.27.3.tgz",
+      "integrity": "sha512-YdghPYUmj/FX2SYKJ0OZxf+iaKgMsKHVPF1MAq/P8WirnSpCStzKJFjOjzsW0QQ7oIAiccHdcqjbHmJxRb/dmg==",
+      "cpu": [
+        "arm64"
+      ],
       "dev": true,
       "license": "MIT",
+      "optional": true,
+      "os": [
+        "android"
+      ],
       "engines": {
-        "node": "^12.0.0 || ^14.0.0 || >=16.0.0"
+        "node": ">=18"
       }
     },
-    "node_modules/@eslint/config-array": {
-      "version": "0.21.1",
-      "resolved": "https://registry.npmjs.org/@eslint/config-array/-/config-array-0.21.1.tgz",
-      "integrity": "sha512-aw1gNayWpdI/jSYVgzN5pL0cfzU02GT3NBpeT/DXbx1/1x7ZKxFPd9bwrzygx/qiwIQiJ1sw/zD8qY/kRvlGHA==",
+    "node_modules/@esbuild/android-x64": {
+      "version": "0.27.3",
+      "resolved": "https://registry.npmjs.org/@esbuild/android-x64/-/android-x64-0.27.3.tgz",
+      "integrity": "sha512-IN/0BNTkHtk8lkOM8JWAYFg4ORxBkZQf9zXiEOfERX/CzxW3Vg1ewAhU7QSWQpVIzTW+b8Xy+lGzdYXV6UZObQ==",
+      "cpu": [
+        "x64"
+      ],
       "dev": true,
-      "license": "Apache-2.0",
-      "dependencies": {
-        "@eslint/object-schema": "^2.1.7",
-        "debug": "^4.3.1",
-        "minimatch": "^3.1.2"
-      },
+      "license": "MIT",
+      "optional": true,
+      "os": [
+        "android"
+      ],
       "engines": {
-        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
+        "node": ">=18"
       }
     },
-    "node_modules/@eslint/config-helpers": {
-      "version": "0.4.2",
-      "resolved": "https://registry.npmjs.org/@eslint/config-helpers/-/config-helpers-0.4.2.tgz",
-      "integrity": "sha512-gBrxN88gOIf3R7ja5K9slwNayVcZgK6SOUORm2uBzTeIEfeVaIhOpCtTox3P6R7o2jLFwLFTLnC7kU/RGcYEgw==",
+    "node_modules/@esbuild/darwin-arm64": {
+      "version": "0.27.3",
+      "resolved": "https://registry.npmjs.org/@esbuild/darwin-arm64/-/darwin-arm64-0.27.3.tgz",
+      "integrity": "sha512-Re491k7ByTVRy0t3EKWajdLIr0gz2kKKfzafkth4Q8A5n1xTHrkqZgLLjFEHVD+AXdUGgQMq+Godfq45mGpCKg==",
+      "cpu": [
+        "arm64"
+      ],
       "dev": true,
-      "license": "Apache-2.0",
-      "dependencies": {
-        "@eslint/core": "^0.17.0"
-      },
+      "license": "MIT",
+      "optional": true,
+      "os": [
+        "darwin"
+      ],
       "engines": {
-        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
+        "node": ">=18"
       }
     },
-    "node_modules/@eslint/core": {
-      "version": "0.17.0",
-      "resolved": "https://registry.npmjs.org/@eslint/core/-/core-0.17.0.tgz",
-      "integrity": "sha512-yL/sLrpmtDaFEiUj1osRP4TI2MDz1AddJL+jZ7KSqvBuliN4xqYY54IfdN8qD8Toa6g1iloph1fxQNkjOxrrpQ==",
+    "node_modules/@esbuild/darwin-x64": {
+      "version": "0.27.3",
+      "resolved": "https://registry.npmjs.org/@esbuild/darwin-x64/-/darwin-x64-0.27.3.tgz",
+      "integrity": "sha512-vHk/hA7/1AckjGzRqi6wbo+jaShzRowYip6rt6q7VYEDX4LEy1pZfDpdxCBnGtl+A5zq8iXDcyuxwtv3hNtHFg==",
+      "cpu": [
+        "x64"
+      ],
       "dev": true,
-      "license": "Apache-2.0",
-      "dependencies": {
-        "@types/json-schema": "^7.0.15"
-      },
+      "license": "MIT",
+      "optional": true,
+      "os": [
+        "darwin"
+      ],
       "engines": {
-        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
+        "node": ">=18"
       }
     },
-    "node_modules/@eslint/eslintrc": {
-      "version": "3.3.4",
-      "resolved": "https://registry.npmjs.org/@eslint/eslintrc/-/eslintrc-3.3.4.tgz",
-      "integrity": "sha512-4h4MVF8pmBsncB60r0wSJiIeUKTSD4m7FmTFThG8RHlsg9ajqckLm9OraguFGZE4vVdpiI1Q4+hFnisopmG6gQ==",
+    "node_modules/@esbuild/freebsd-arm64": {
+      "version": "0.27.3",
+      "resolved": "https://registry.npmjs.org/@esbuild/freebsd-arm64/-/freebsd-arm64-0.27.3.tgz",
+      "integrity": "sha512-ipTYM2fjt3kQAYOvo6vcxJx3nBYAzPjgTCk7QEgZG8AUO3ydUhvelmhrbOheMnGOlaSFUoHXB6un+A7q4ygY9w==",
+      "cpu": [
+        "arm64"
+      ],
       "dev": true,
       "license": "MIT",
-      "dependencies": {
-        "ajv": "^6.14.0",
-        "debug": "^4.3.2",
-        "espree": "^10.0.1",
-        "globals": "^14.0.0",
-        "ignore": "^5.2.0",
-        "import-fresh": "^3.2.1",
-        "js-yaml": "^4.1.1",
-        "minimatch": "^3.1.3",
-        "strip-json-comments": "^3.1.1"
-      },
+      "optional": true,
+      "os": [
+        "freebsd"
+      ],
       "engines": {
-        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
-      },
-      "funding": {
-        "url": "https://opencollective.com/eslint"
+        "node": ">=18"
       }
     },
-    "node_modules/@eslint/js": {
-      "version": "9.39.3",
-      "resolved": "https://registry.npmjs.org/@eslint/js/-/js-9.39.3.tgz",
-      "integrity": "sha512-1B1VkCq6FuUNlQvlBYb+1jDu/gV297TIs/OeiaSR9l1H27SVW55ONE1e1Vp16NqP683+xEGzxYtv4XCiDPaQiw==",
+    "node_modules/@esbuild/freebsd-x64": {
+      "version": "0.27.3",
+      "resolved": "https://registry.npmjs.org/@esbuild/freebsd-x64/-/freebsd-x64-0.27.3.tgz",
+      "integrity": "sha512-dDk0X87T7mI6U3K9VjWtHOXqwAMJBNN2r7bejDsc+j03SEjtD9HrOl8gVFByeM0aJksoUuUVU9TBaZa2rgj0oA==",
+      "cpu": [
+        "x64"
+      ],
       "dev": true,
       "license": "MIT",
+      "optional": true,
+      "os": [
+        "freebsd"
+      ],
       "engines": {
-        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
-      },
-      "funding": {
-        "url": "https://eslint.org/donate"
+        "node": ">=18"
       }
     },
-    "node_modules/@eslint/object-schema": {
-      "version": "2.1.7",
-      "resolved": "https://registry.npmjs.org/@eslint/object-schema/-/object-schema-2.1.7.tgz",
-      "integrity": "sha512-VtAOaymWVfZcmZbp6E2mympDIHvyjXs/12LqWYjVw6qjrfF+VK+fyG33kChz3nnK+SU5/NeHOqrTEHS8sXO3OA==",
+    "node_modules/@esbuild/linux-arm": {
+      "version": "0.27.3",
+      "resolved": "https://registry.npmjs.org/@esbuild/linux-arm/-/linux-arm-0.27.3.tgz",
+      "integrity": "sha512-s6nPv2QkSupJwLYyfS+gwdirm0ukyTFNl3KTgZEAiJDd+iHZcbTPPcWCcRYH+WlNbwChgH2QkE9NSlNrMT8Gfw==",
+      "cpu": [
+        "arm"
+      ],
       "dev": true,
-      "license": "Apache-2.0",
+      "license": "MIT",
+      "optional": true,
+      "os": [
+        "linux"
+      ],
       "engines": {
-        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
+        "node": ">=18"
       }
     },
-    "node_modules/@eslint/plugin-kit": {
-      "version": "0.4.1",
-      "resolved": "https://registry.npmjs.org/@eslint/plugin-kit/-/plugin-kit-0.4.1.tgz",
-      "integrity": "sha512-43/qtrDUokr7LJqoF2c3+RInu/t4zfrpYdoSDfYyhg52rwLV6TnOvdG4fXm7IkSB3wErkcmJS9iEhjVtOSEjjA==",
+    "node_modules/@esbuild/linux-arm64": {
+      "version": "0.27.3",
+      "resolved": "https://registry.npmjs.org/@esbuild/linux-arm64/-/linux-arm64-0.27.3.tgz",
+      "integrity": "sha512-sZOuFz/xWnZ4KH3YfFrKCf1WyPZHakVzTiqji3WDc0BCl2kBwiJLCXpzLzUBLgmp4veFZdvN5ChW4Eq/8Fc2Fg==",
+      "cpu": [
+        "arm64"
+      ],
       "dev": true,
-      "license": "Apache-2.0",
-      "dependencies": {
-        "@eslint/core": "^0.17.0",
-        "levn": "^0.4.1"
-      },
+      "license": "MIT",
+      "optional": true,
+      "os": [
+        "linux"
+      ],
       "engines": {
-        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
+        "node": ">=18"
       }
     },
-    "node_modules/@humanfs/core": {
-      "version": "0.19.1",
-      "resolved": "https://registry.npmjs.org/@humanfs/core/-/core-0.19.1.tgz",
-      "integrity": "sha512-5DyQ4+1JEUzejeK1JGICcideyfUbGixgS9jNgex5nqkW+cY7WZhxBigmieN5Qnw9ZosSNVC9KQKyb+GUaGyKUA==",
+    "node_modules/@esbuild/linux-ia32": {
+      "version": "0.27.3",
+      "resolved": "https://registry.npmjs.org/@esbuild/linux-ia32/-/linux-ia32-0.27.3.tgz",
+      "integrity": "sha512-yGlQYjdxtLdh0a3jHjuwOrxQjOZYD/C9PfdbgJJF3TIZWnm/tMd/RcNiLngiu4iwcBAOezdnSLAwQDPqTmtTYg==",
+      "cpu": [
+        "ia32"
+      ],
       "dev": true,
-      "license": "Apache-2.0",
+      "license": "MIT",
+      "optional": true,
+      "os": [
+        "linux"
+      ],
       "engines": {
-        "node": ">=18.18.0"
+        "node": ">=18"
       }
     },
-    "node_modules/@humanfs/node": {
-      "version": "0.16.7",
-      "resolved": "https://registry.npmjs.org/@humanfs/node/-/node-0.16.7.tgz",
-      "integrity": "sha512-/zUx+yOsIrG4Y43Eh2peDeKCxlRt/gET6aHfaKpuq267qXdYDFViVHfMaLyygZOnl0kGWxFIgsBy8QFuTLUXEQ==",
+    "node_modules/@esbuild/linux-loong64": {
+      "version": "0.27.3",
+      "resolved": "https://registry.npmjs.org/@esbuild/linux-loong64/-/linux-loong64-0.27.3.tgz",
+      "integrity": "sha512-WO60Sn8ly3gtzhyjATDgieJNet/KqsDlX5nRC5Y3oTFcS1l0KWba+SEa9Ja1GfDqSF1z6hif/SkpQJbL63cgOA==",
+      "cpu": [
+        "loong64"
+      ],
       "dev": true,
-      "license": "Apache-2.0",
-      "dependencies": {
-        "@humanfs/core": "^0.19.1",
-        "@humanwhocodes/retry": "^0.4.0"
-      },
+      "license": "MIT",
+      "optional": true,
+      "os": [
+        "linux"
+      ],
       "engines": {
-        "node": ">=18.18.0"
+        "node": ">=18"
       }
     },
-    "node_modules/@humanwhocodes/module-importer": {
-      "version": "1.0.1",
-      "resolved": "https://registry.npmjs.org/@humanwhocodes/module-importer/-/module-importer-1.0.1.tgz",
-      "integrity": "sha512-bxveV4V8v5Yb4ncFTT3rPSgZBOpCkjfK0y4oVVVJwIuDVBRMDXrPyXRL988i5ap9m9bnyEEjWfm5WkBmtffLfA==",
+    "node_modules/@esbuild/linux-mips64el": {
+      "version": "0.27.3",
+      "resolved": "https://registry.npmjs.org/@esbuild/linux-mips64el/-/linux-mips64el-0.27.3.tgz",
+      "integrity": "sha512-APsymYA6sGcZ4pD6k+UxbDjOFSvPWyZhjaiPyl/f79xKxwTnrn5QUnXR5prvetuaSMsb4jgeHewIDCIWljrSxw==",
+      "cpu": [
+        "mips64el"
+      ],
       "dev": true,
-      "license": "Apache-2.0",
+      "license": "MIT",
+      "optional": true,
+      "os": [
+        "linux"
+      ],
       "engines": {
-        "node": ">=12.22"
-      },
-      "funding": {
-        "type": "github",
-        "url": "https://github.com/sponsors/nzakas"
+        "node": ">=18"
       }
     },
-    "node_modules/@humanwhocodes/retry": {
-      "version": "0.4.3",
-      "resolved": "https://registry.npmjs.org/@humanwhocodes/retry/-/retry-0.4.3.tgz",
-      "integrity": "sha512-bV0Tgo9K4hfPCek+aMAn81RppFKv2ySDQeMoSZuvTASywNTnVJCArCZE2FWqpvIatKu7VMRLWlR1EazvVhDyhQ==",
+    "node_modules/@esbuild/linux-ppc64": {
+      "version": "0.27.3",
+      "resolved": "https://registry.npmjs.org/@esbuild/linux-ppc64/-/linux-ppc64-0.27.3.tgz",
+      "integrity": "sha512-eizBnTeBefojtDb9nSh4vvVQ3V9Qf9Df01PfawPcRzJH4gFSgrObw+LveUyDoKU3kxi5+9RJTCWlj4FjYXVPEA==",
+      "cpu": [
+        "ppc64"
+      ],
       "dev": true,
-      "license": "Apache-2.0",
+      "license": "MIT",
+      "optional": true,
+      "os": [
+        "linux"
+      ],
       "engines": {
-        "node": ">=18.18"
-      },
-      "funding": {
-        "type": "github",
-        "url": "https://github.com/sponsors/nzakas"
+        "node": ">=18"
       }
     },
-    "node_modules/@img/colour": {
-      "version": "1.0.0",
-      "resolved": "https://registry.npmjs.org/@img/colour/-/colour-1.0.0.tgz",
-      "integrity": "sha512-A5P/LfWGFSl6nsckYtjw9da+19jB8hkJ6ACTGcDfEJ0aE+l2n2El7dsVM7UVHZQ9s2lmYMWlrS21YLy2IR1LUw==",
+    "node_modules/@esbuild/linux-riscv64": {
+      "version": "0.27.3",
+      "resolved": "https://registry.npmjs.org/@esbuild/linux-riscv64/-/linux-riscv64-0.27.3.tgz",
+      "integrity": "sha512-3Emwh0r5wmfm3ssTWRQSyVhbOHvqegUDRd0WhmXKX2mkHJe1SFCMJhagUleMq+Uci34wLSipf8Lagt4LlpRFWQ==",
+      "cpu": [
+        "riscv64"
+      ],
+      "dev": true,
       "license": "MIT",
       "optional": true,
+      "os": [
+        "linux"
+      ],
       "engines": {
         "node": ">=18"
       }
     },
-    "node_modules/@img/sharp-darwin-arm64": {
-      "version": "0.34.5",
-      "resolved": "https://registry.npmjs.org/@img/sharp-darwin-arm64/-/sharp-darwin-arm64-0.34.5.tgz",
-      "integrity": "sha512-imtQ3WMJXbMY4fxb/Ndp6HBTNVtWCUI0WdobyheGf5+ad6xX8VIDO8u2xE4qc/fr08CKG/7dDseFtn6M6g/r3w==",
+    "node_modules/@esbuild/linux-s390x": {
+      "version": "0.27.3",
+      "resolved": "https://registry.npmjs.org/@esbuild/linux-s390x/-/linux-s390x-0.27.3.tgz",
+      "integrity": "sha512-pBHUx9LzXWBc7MFIEEL0yD/ZVtNgLytvx60gES28GcWMqil8ElCYR4kvbV2BDqsHOvVDRrOxGySBM9Fcv744hw==",
       "cpu": [
-        "arm64"
+        "s390x"
       ],
-      "license": "Apache-2.0",
+      "dev": true,
+      "license": "MIT",
       "optional": true,
       "os": [
-        "darwin"
+        "linux"
       ],
       "engines": {
-        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
-      },
-      "funding": {
-        "url": "https://opencollective.com/libvips"
-      },
-      "optionalDependencies": {
-        "@img/sharp-libvips-darwin-arm64": "1.2.4"
+        "node": ">=18"
       }
     },
-    "node_modules/@img/sharp-darwin-x64": {
-      "version": "0.34.5",
-      "resolved": "https://registry.npmjs.org/@img/sharp-darwin-x64/-/sharp-darwin-x64-0.34.5.tgz",
-      "integrity": "sha512-YNEFAF/4KQ/PeW0N+r+aVVsoIY0/qxxikF2SWdp+NRkmMB7y9LBZAVqQ4yhGCm/H3H270OSykqmQMKLBhBJDEw==",
+    "node_modules/@esbuild/linux-x64": {
+      "version": "0.27.3",
+      "resolved": "https://registry.npmjs.org/@esbuild/linux-x64/-/linux-x64-0.27.3.tgz",
+      "integrity": "sha512-Czi8yzXUWIQYAtL/2y6vogER8pvcsOsk5cpwL4Gk5nJqH5UZiVByIY8Eorm5R13gq+DQKYg0+JyQoytLQas4dA==",
       "cpu": [
         "x64"
       ],
-      "license": "Apache-2.0",
+      "dev": true,
+      "license": "MIT",
       "optional": true,
       "os": [
-        "darwin"
+        "linux"
       ],
       "engines": {
-        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
-      },
-      "funding": {
-        "url": "https://opencollective.com/libvips"
-      },
-      "optionalDependencies": {
-        "@img/sharp-libvips-darwin-x64": "1.2.4"
+        "node": ">=18"
       }
     },
-    "node_modules/@img/sharp-libvips-darwin-arm64": {
-      "version": "1.2.4",
-      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-darwin-arm64/-/sharp-libvips-darwin-arm64-1.2.4.tgz",
-      "integrity": "sha512-zqjjo7RatFfFoP0MkQ51jfuFZBnVE2pRiaydKJ1G/rHZvnsrHAOcQALIi9sA5co5xenQdTugCvtb1cuf78Vf4g==",
+    "node_modules/@esbuild/netbsd-arm64": {
+      "version": "0.27.3",
+      "resolved": "https://registry.npmjs.org/@esbuild/netbsd-arm64/-/netbsd-arm64-0.27.3.tgz",
+      "integrity": "sha512-sDpk0RgmTCR/5HguIZa9n9u+HVKf40fbEUt+iTzSnCaGvY9kFP0YKBWZtJaraonFnqef5SlJ8/TiPAxzyS+UoA==",
       "cpu": [
         "arm64"
       ],
-      "license": "LGPL-3.0-or-later",
+      "dev": true,
+      "license": "MIT",
       "optional": true,
       "os": [
-        "darwin"
+        "netbsd"
       ],
-      "funding": {
-        "url": "https://opencollective.com/libvips"
+      "engines": {
+        "node": ">=18"
       }
     },
-    "node_modules/@img/sharp-libvips-darwin-x64": {
-      "version": "1.2.4",
-      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-darwin-x64/-/sharp-libvips-darwin-x64-1.2.4.tgz",
-      "integrity": "sha512-1IOd5xfVhlGwX+zXv2N93k0yMONvUlANylbJw1eTah8K/Jtpi15KC+WSiaX/nBmbm2HxRM1gZ0nSdjSsrZbGKg==",
+    "node_modules/@esbuild/netbsd-x64": {
+      "version": "0.27.3",
+      "resolved": "https://registry.npmjs.org/@esbuild/netbsd-x64/-/netbsd-x64-0.27.3.tgz",
+      "integrity": "sha512-P14lFKJl/DdaE00LItAukUdZO5iqNH7+PjoBm+fLQjtxfcfFE20Xf5CrLsmZdq5LFFZzb5JMZ9grUwvtVYzjiA==",
       "cpu": [
         "x64"
       ],
-      "license": "LGPL-3.0-or-later",
+      "dev": true,
+      "license": "MIT",
       "optional": true,
       "os": [
-        "darwin"
+        "netbsd"
       ],
-      "funding": {
-        "url": "https://opencollective.com/libvips"
+      "engines": {
+        "node": ">=18"
       }
     },
-    "node_modules/@img/sharp-libvips-linux-arm": {
-      "version": "1.2.4",
-      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-arm/-/sharp-libvips-linux-arm-1.2.4.tgz",
-      "integrity": "sha512-bFI7xcKFELdiNCVov8e44Ia4u2byA+l3XtsAj+Q8tfCwO6BQ8iDojYdvoPMqsKDkuoOo+X6HZA0s0q11ANMQ8A==",
+    "node_modules/@esbuild/openbsd-arm64": {
+      "version": "0.27.3",
+      "resolved": "https://registry.npmjs.org/@esbuild/openbsd-arm64/-/openbsd-arm64-0.27.3.tgz",
+      "integrity": "sha512-AIcMP77AvirGbRl/UZFTq5hjXK+2wC7qFRGoHSDrZ5v5b8DK/GYpXW3CPRL53NkvDqb9D+alBiC/dV0Fb7eJcw==",
       "cpu": [
-        "arm"
+        "arm64"
       ],
-      "license": "LGPL-3.0-or-later",
+      "dev": true,
+      "license": "MIT",
       "optional": true,
       "os": [
-        "linux"
+        "openbsd"
       ],
-      "funding": {
-        "url": "https://opencollective.com/libvips"
+      "engines": {
+        "node": ">=18"
       }
     },
-    "node_modules/@img/sharp-libvips-linux-arm64": {
-      "version": "1.2.4",
-      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-arm64/-/sharp-libvips-linux-arm64-1.2.4.tgz",
-      "integrity": "sha512-excjX8DfsIcJ10x1Kzr4RcWe1edC9PquDRRPx3YVCvQv+U5p7Yin2s32ftzikXojb1PIFc/9Mt28/y+iRklkrw==",
+    "node_modules/@esbuild/openbsd-x64": {
+      "version": "0.27.3",
+      "resolved": "https://registry.npmjs.org/@esbuild/openbsd-x64/-/openbsd-x64-0.27.3.tgz",
+      "integrity": "sha512-DnW2sRrBzA+YnE70LKqnM3P+z8vehfJWHXECbwBmH/CU51z6FiqTQTHFenPlHmo3a8UgpLyH3PT+87OViOh1AQ==",
       "cpu": [
-        "arm64"
+        "x64"
       ],
-      "license": "LGPL-3.0-or-later",
+      "dev": true,
+      "license": "MIT",
       "optional": true,
       "os": [
-        "linux"
+        "openbsd"
       ],
+      "engines": {
+        "node": ">=18"
+      }
+    },
+    "node_modules/@esbuild/openharmony-arm64": {
+      "version": "0.27.3",
+      "resolved": "https://registry.npmjs.org/@esbuild/openharmony-arm64/-/openharmony-arm64-0.27.3.tgz",
+      "integrity": "sha512-NinAEgr/etERPTsZJ7aEZQvvg/A6IsZG/LgZy+81wON2huV7SrK3e63dU0XhyZP4RKGyTm7aOgmQk0bGp0fy2g==",
+      "cpu": [
+        "arm64"
+      ],
+      "dev": true,
+      "license": "MIT",
+      "optional": true,
+      "os": [
+        "openharmony"
+      ],
+      "engines": {
+        "node": ">=18"
+      }
+    },
+    "node_modules/@esbuild/sunos-x64": {
+      "version": "0.27.3",
+      "resolved": "https://registry.npmjs.org/@esbuild/sunos-x64/-/sunos-x64-0.27.3.tgz",
+      "integrity": "sha512-PanZ+nEz+eWoBJ8/f8HKxTTD172SKwdXebZ0ndd953gt1HRBbhMsaNqjTyYLGLPdoWHy4zLU7bDVJztF5f3BHA==",
+      "cpu": [
+        "x64"
+      ],
+      "dev": true,
+      "license": "MIT",
+      "optional": true,
+      "os": [
+        "sunos"
+      ],
+      "engines": {
+        "node": ">=18"
+      }
+    },
+    "node_modules/@esbuild/win32-arm64": {
+      "version": "0.27.3",
+      "resolved": "https://registry.npmjs.org/@esbuild/win32-arm64/-/win32-arm64-0.27.3.tgz",
+      "integrity": "sha512-B2t59lWWYrbRDw/tjiWOuzSsFh1Y/E95ofKz7rIVYSQkUYBjfSgf6oeYPNWHToFRr2zx52JKApIcAS/D5TUBnA==",
+      "cpu": [
+        "arm64"
+      ],
+      "dev": true,
+      "license": "MIT",
+      "optional": true,
+      "os": [
+        "win32"
+      ],
+      "engines": {
+        "node": ">=18"
+      }
+    },
+    "node_modules/@esbuild/win32-ia32": {
+      "version": "0.27.3",
+      "resolved": "https://registry.npmjs.org/@esbuild/win32-ia32/-/win32-ia32-0.27.3.tgz",
+      "integrity": "sha512-QLKSFeXNS8+tHW7tZpMtjlNb7HKau0QDpwm49u0vUp9y1WOF+PEzkU84y9GqYaAVW8aH8f3GcBck26jh54cX4Q==",
+      "cpu": [
+        "ia32"
+      ],
+      "dev": true,
+      "license": "MIT",
+      "optional": true,
+      "os": [
+        "win32"
+      ],
+      "engines": {
+        "node": ">=18"
+      }
+    },
+    "node_modules/@esbuild/win32-x64": {
+      "version": "0.27.3",
+      "resolved": "https://registry.npmjs.org/@esbuild/win32-x64/-/win32-x64-0.27.3.tgz",
+      "integrity": "sha512-4uJGhsxuptu3OcpVAzli+/gWusVGwZZHTlS63hh++ehExkVT8SgiEf7/uC/PclrPPkLhZqGgCTjd0VWLo6xMqA==",
+      "cpu": [
+        "x64"
+      ],
+      "dev": true,
+      "license": "MIT",
+      "optional": true,
+      "os": [
+        "win32"
+      ],
+      "engines": {
+        "node": ">=18"
+      }
+    },
+    "node_modules/@eslint-community/eslint-utils": {
+      "version": "4.9.1",
+      "resolved": "https://registry.npmjs.org/@eslint-community/eslint-utils/-/eslint-utils-4.9.1.tgz",
+      "integrity": "sha512-phrYmNiYppR7znFEdqgfWHXR6NCkZEK7hwWDHZUjit/2/U0r6XvkDl0SYnoM51Hq7FhCGdLDT6zxCCOY1hexsQ==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "eslint-visitor-keys": "^3.4.3"
+      },
+      "engines": {
+        "node": "^12.22.0 || ^14.17.0 || >=16.0.0"
+      },
+      "funding": {
+        "url": "https://opencollective.com/eslint"
+      },
+      "peerDependencies": {
+        "eslint": "^6.0.0 || ^7.0.0 || >=8.0.0"
+      }
+    },
+    "node_modules/@eslint-community/eslint-utils/node_modules/eslint-visitor-keys": {
+      "version": "3.4.3",
+      "resolved": "https://registry.npmjs.org/eslint-visitor-keys/-/eslint-visitor-keys-3.4.3.tgz",
+      "integrity": "sha512-wpc+LXeiyiisxPlEkUzU6svyS1frIO3Mgxj1fdy7Pm8Ygzguax2N3Fa/D/ag1WqbOprdI+uY6wMUl8/a2G+iag==",
+      "dev": true,
+      "license": "Apache-2.0",
+      "engines": {
+        "node": "^12.22.0 || ^14.17.0 || >=16.0.0"
+      },
+      "funding": {
+        "url": "https://opencollective.com/eslint"
+      }
+    },
+    "node_modules/@eslint-community/regexpp": {
+      "version": "4.12.2",
+      "resolved": "https://registry.npmjs.org/@eslint-community/regexpp/-/regexpp-4.12.2.tgz",
+      "integrity": "sha512-EriSTlt5OC9/7SXkRSCAhfSxxoSUgBm33OH+IkwbdpgoqsSsUg7y3uh+IICI/Qg4BBWr3U2i39RpmycbxMq4ew==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": "^12.0.0 || ^14.0.0 || >=16.0.0"
+      }
+    },
+    "node_modules/@eslint/config-array": {
+      "version": "0.21.1",
+      "resolved": "https://registry.npmjs.org/@eslint/config-array/-/config-array-0.21.1.tgz",
+      "integrity": "sha512-aw1gNayWpdI/jSYVgzN5pL0cfzU02GT3NBpeT/DXbx1/1x7ZKxFPd9bwrzygx/qiwIQiJ1sw/zD8qY/kRvlGHA==",
+      "dev": true,
+      "license": "Apache-2.0",
+      "dependencies": {
+        "@eslint/object-schema": "^2.1.7",
+        "debug": "^4.3.1",
+        "minimatch": "^3.1.2"
+      },
+      "engines": {
+        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
+      }
+    },
+    "node_modules/@eslint/config-helpers": {
+      "version": "0.4.2",
+      "resolved": "https://registry.npmjs.org/@eslint/config-helpers/-/config-helpers-0.4.2.tgz",
+      "integrity": "sha512-gBrxN88gOIf3R7ja5K9slwNayVcZgK6SOUORm2uBzTeIEfeVaIhOpCtTox3P6R7o2jLFwLFTLnC7kU/RGcYEgw==",
+      "dev": true,
+      "license": "Apache-2.0",
+      "dependencies": {
+        "@eslint/core": "^0.17.0"
+      },
+      "engines": {
+        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
+      }
+    },
+    "node_modules/@eslint/core": {
+      "version": "0.17.0",
+      "resolved": "https://registry.npmjs.org/@eslint/core/-/core-0.17.0.tgz",
+      "integrity": "sha512-yL/sLrpmtDaFEiUj1osRP4TI2MDz1AddJL+jZ7KSqvBuliN4xqYY54IfdN8qD8Toa6g1iloph1fxQNkjOxrrpQ==",
+      "dev": true,
+      "license": "Apache-2.0",
+      "dependencies": {
+        "@types/json-schema": "^7.0.15"
+      },
+      "engines": {
+        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
+      }
+    },
+    "node_modules/@eslint/eslintrc": {
+      "version": "3.3.4",
+      "resolved": "https://registry.npmjs.org/@eslint/eslintrc/-/eslintrc-3.3.4.tgz",
+      "integrity": "sha512-4h4MVF8pmBsncB60r0wSJiIeUKTSD4m7FmTFThG8RHlsg9ajqckLm9OraguFGZE4vVdpiI1Q4+hFnisopmG6gQ==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "ajv": "^6.14.0",
+        "debug": "^4.3.2",
+        "espree": "^10.0.1",
+        "globals": "^14.0.0",
+        "ignore": "^5.2.0",
+        "import-fresh": "^3.2.1",
+        "js-yaml": "^4.1.1",
+        "minimatch": "^3.1.3",
+        "strip-json-comments": "^3.1.1"
+      },
+      "engines": {
+        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
+      },
+      "funding": {
+        "url": "https://opencollective.com/eslint"
+      }
+    },
+    "node_modules/@eslint/js": {
+      "version": "9.39.3",
+      "resolved": "https://registry.npmjs.org/@eslint/js/-/js-9.39.3.tgz",
+      "integrity": "sha512-1B1VkCq6FuUNlQvlBYb+1jDu/gV297TIs/OeiaSR9l1H27SVW55ONE1e1Vp16NqP683+xEGzxYtv4XCiDPaQiw==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
+      },
+      "funding": {
+        "url": "https://eslint.org/donate"
+      }
+    },
+    "node_modules/@eslint/object-schema": {
+      "version": "2.1.7",
+      "resolved": "https://registry.npmjs.org/@eslint/object-schema/-/object-schema-2.1.7.tgz",
+      "integrity": "sha512-VtAOaymWVfZcmZbp6E2mympDIHvyjXs/12LqWYjVw6qjrfF+VK+fyG33kChz3nnK+SU5/NeHOqrTEHS8sXO3OA==",
+      "dev": true,
+      "license": "Apache-2.0",
+      "engines": {
+        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
+      }
+    },
+    "node_modules/@eslint/plugin-kit": {
+      "version": "0.4.1",
+      "resolved": "https://registry.npmjs.org/@eslint/plugin-kit/-/plugin-kit-0.4.1.tgz",
+      "integrity": "sha512-43/qtrDUokr7LJqoF2c3+RInu/t4zfrpYdoSDfYyhg52rwLV6TnOvdG4fXm7IkSB3wErkcmJS9iEhjVtOSEjjA==",
+      "dev": true,
+      "license": "Apache-2.0",
+      "dependencies": {
+        "@eslint/core": "^0.17.0",
+        "levn": "^0.4.1"
+      },
+      "engines": {
+        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
+      }
+    },
+    "node_modules/@exodus/bytes": {
+      "version": "1.14.1",
+      "resolved": "https://registry.npmjs.org/@exodus/bytes/-/bytes-1.14.1.tgz",
+      "integrity": "sha512-OhkBFWI6GcRMUroChZiopRiSp2iAMvEBK47NhJooDqz1RERO4QuZIZnjP63TXX8GAiLABkYmX+fuQsdJ1dd2QQ==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": "^20.19.0 || ^22.12.0 || >=24.0.0"
+      },
+      "peerDependencies": {
+        "@noble/hashes": "^1.8.0 || ^2.0.0"
+      },
+      "peerDependenciesMeta": {
+        "@noble/hashes": {
+          "optional": true
+        }
+      }
+    },
+    "node_modules/@humanfs/core": {
+      "version": "0.19.1",
+      "resolved": "https://registry.npmjs.org/@humanfs/core/-/core-0.19.1.tgz",
+      "integrity": "sha512-5DyQ4+1JEUzejeK1JGICcideyfUbGixgS9jNgex5nqkW+cY7WZhxBigmieN5Qnw9ZosSNVC9KQKyb+GUaGyKUA==",
+      "dev": true,
+      "license": "Apache-2.0",
+      "engines": {
+        "node": ">=18.18.0"
+      }
+    },
+    "node_modules/@humanfs/node": {
+      "version": "0.16.7",
+      "resolved": "https://registry.npmjs.org/@humanfs/node/-/node-0.16.7.tgz",
+      "integrity": "sha512-/zUx+yOsIrG4Y43Eh2peDeKCxlRt/gET6aHfaKpuq267qXdYDFViVHfMaLyygZOnl0kGWxFIgsBy8QFuTLUXEQ==",
+      "dev": true,
+      "license": "Apache-2.0",
+      "dependencies": {
+        "@humanfs/core": "^0.19.1",
+        "@humanwhocodes/retry": "^0.4.0"
+      },
+      "engines": {
+        "node": ">=18.18.0"
+      }
+    },
+    "node_modules/@humanwhocodes/module-importer": {
+      "version": "1.0.1",
+      "resolved": "https://registry.npmjs.org/@humanwhocodes/module-importer/-/module-importer-1.0.1.tgz",
+      "integrity": "sha512-bxveV4V8v5Yb4ncFTT3rPSgZBOpCkjfK0y4oVVVJwIuDVBRMDXrPyXRL988i5ap9m9bnyEEjWfm5WkBmtffLfA==",
+      "dev": true,
+      "license": "Apache-2.0",
+      "engines": {
+        "node": ">=12.22"
+      },
+      "funding": {
+        "type": "github",
+        "url": "https://github.com/sponsors/nzakas"
+      }
+    },
+    "node_modules/@humanwhocodes/retry": {
+      "version": "0.4.3",
+      "resolved": "https://registry.npmjs.org/@humanwhocodes/retry/-/retry-0.4.3.tgz",
+      "integrity": "sha512-bV0Tgo9K4hfPCek+aMAn81RppFKv2ySDQeMoSZuvTASywNTnVJCArCZE2FWqpvIatKu7VMRLWlR1EazvVhDyhQ==",
+      "dev": true,
+      "license": "Apache-2.0",
+      "engines": {
+        "node": ">=18.18"
+      },
+      "funding": {
+        "type": "github",
+        "url": "https://github.com/sponsors/nzakas"
+      }
+    },
+    "node_modules/@img/colour": {
+      "version": "1.0.0",
+      "resolved": "https://registry.npmjs.org/@img/colour/-/colour-1.0.0.tgz",
+      "integrity": "sha512-A5P/LfWGFSl6nsckYtjw9da+19jB8hkJ6ACTGcDfEJ0aE+l2n2El7dsVM7UVHZQ9s2lmYMWlrS21YLy2IR1LUw==",
+      "license": "MIT",
+      "optional": true,
+      "engines": {
+        "node": ">=18"
+      }
+    },
+    "node_modules/@img/sharp-darwin-arm64": {
+      "version": "0.34.5",
+      "resolved": "https://registry.npmjs.org/@img/sharp-darwin-arm64/-/sharp-darwin-arm64-0.34.5.tgz",
+      "integrity": "sha512-imtQ3WMJXbMY4fxb/Ndp6HBTNVtWCUI0WdobyheGf5+ad6xX8VIDO8u2xE4qc/fr08CKG/7dDseFtn6M6g/r3w==",
+      "cpu": [
+        "arm64"
+      ],
+      "license": "Apache-2.0",
+      "optional": true,
+      "os": [
+        "darwin"
+      ],
+      "engines": {
+        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
+      },
+      "funding": {
+        "url": "https://opencollective.com/libvips"
+      },
+      "optionalDependencies": {
+        "@img/sharp-libvips-darwin-arm64": "1.2.4"
+      }
+    },
+    "node_modules/@img/sharp-darwin-x64": {
+      "version": "0.34.5",
+      "resolved": "https://registry.npmjs.org/@img/sharp-darwin-x64/-/sharp-darwin-x64-0.34.5.tgz",
+      "integrity": "sha512-YNEFAF/4KQ/PeW0N+r+aVVsoIY0/qxxikF2SWdp+NRkmMB7y9LBZAVqQ4yhGCm/H3H270OSykqmQMKLBhBJDEw==",
+      "cpu": [
+        "x64"
+      ],
+      "license": "Apache-2.0",
+      "optional": true,
+      "os": [
+        "darwin"
+      ],
+      "engines": {
+        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
+      },
+      "funding": {
+        "url": "https://opencollective.com/libvips"
+      },
+      "optionalDependencies": {
+        "@img/sharp-libvips-darwin-x64": "1.2.4"
+      }
+    },
+    "node_modules/@img/sharp-libvips-darwin-arm64": {
+      "version": "1.2.4",
+      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-darwin-arm64/-/sharp-libvips-darwin-arm64-1.2.4.tgz",
+      "integrity": "sha512-zqjjo7RatFfFoP0MkQ51jfuFZBnVE2pRiaydKJ1G/rHZvnsrHAOcQALIi9sA5co5xenQdTugCvtb1cuf78Vf4g==",
+      "cpu": [
+        "arm64"
+      ],
+      "license": "LGPL-3.0-or-later",
+      "optional": true,
+      "os": [
+        "darwin"
+      ],
+      "funding": {
+        "url": "https://opencollective.com/libvips"
+      }
+    },
+    "node_modules/@img/sharp-libvips-darwin-x64": {
+      "version": "1.2.4",
+      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-darwin-x64/-/sharp-libvips-darwin-x64-1.2.4.tgz",
+      "integrity": "sha512-1IOd5xfVhlGwX+zXv2N93k0yMONvUlANylbJw1eTah8K/Jtpi15KC+WSiaX/nBmbm2HxRM1gZ0nSdjSsrZbGKg==",
+      "cpu": [
+        "x64"
+      ],
+      "license": "LGPL-3.0-or-later",
+      "optional": true,
+      "os": [
+        "darwin"
+      ],
+      "funding": {
+        "url": "https://opencollective.com/libvips"
+      }
+    },
+    "node_modules/@img/sharp-libvips-linux-arm": {
+      "version": "1.2.4",
+      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-arm/-/sharp-libvips-linux-arm-1.2.4.tgz",
+      "integrity": "sha512-bFI7xcKFELdiNCVov8e44Ia4u2byA+l3XtsAj+Q8tfCwO6BQ8iDojYdvoPMqsKDkuoOo+X6HZA0s0q11ANMQ8A==",
+      "cpu": [
+        "arm"
+      ],
+      "license": "LGPL-3.0-or-later",
+      "optional": true,
+      "os": [
+        "linux"
+      ],
+      "funding": {
+        "url": "https://opencollective.com/libvips"
+      }
+    },
+    "node_modules/@img/sharp-libvips-linux-arm64": {
+      "version": "1.2.4",
+      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-arm64/-/sharp-libvips-linux-arm64-1.2.4.tgz",
+      "integrity": "sha512-excjX8DfsIcJ10x1Kzr4RcWe1edC9PquDRRPx3YVCvQv+U5p7Yin2s32ftzikXojb1PIFc/9Mt28/y+iRklkrw==",
+      "cpu": [
+        "arm64"
+      ],
+      "license": "LGPL-3.0-or-later",
+      "optional": true,
+      "os": [
+        "linux"
+      ],
+      "funding": {
+        "url": "https://opencollective.com/libvips"
+      }
+    },
+    "node_modules/@img/sharp-libvips-linux-ppc64": {
+      "version": "1.2.4",
+      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-ppc64/-/sharp-libvips-linux-ppc64-1.2.4.tgz",
+      "integrity": "sha512-FMuvGijLDYG6lW+b/UvyilUWu5Ayu+3r2d1S8notiGCIyYU/76eig1UfMmkZ7vwgOrzKzlQbFSuQfgm7GYUPpA==",
+      "cpu": [
+        "ppc64"
+      ],
+      "license": "LGPL-3.0-or-later",
+      "optional": true,
+      "os": [
+        "linux"
+      ],
+      "funding": {
+        "url": "https://opencollective.com/libvips"
+      }
+    },
+    "node_modules/@img/sharp-libvips-linux-riscv64": {
+      "version": "1.2.4",
+      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-riscv64/-/sharp-libvips-linux-riscv64-1.2.4.tgz",
+      "integrity": "sha512-oVDbcR4zUC0ce82teubSm+x6ETixtKZBh/qbREIOcI3cULzDyb18Sr/Wcyx7NRQeQzOiHTNbZFF1UwPS2scyGA==",
+      "cpu": [
+        "riscv64"
+      ],
+      "license": "LGPL-3.0-or-later",
+      "optional": true,
+      "os": [
+        "linux"
+      ],
+      "funding": {
+        "url": "https://opencollective.com/libvips"
+      }
+    },
+    "node_modules/@img/sharp-libvips-linux-s390x": {
+      "version": "1.2.4",
+      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-s390x/-/sharp-libvips-linux-s390x-1.2.4.tgz",
+      "integrity": "sha512-qmp9VrzgPgMoGZyPvrQHqk02uyjA0/QrTO26Tqk6l4ZV0MPWIW6LTkqOIov+J1yEu7MbFQaDpwdwJKhbJvuRxQ==",
+      "cpu": [
+        "s390x"
+      ],
+      "license": "LGPL-3.0-or-later",
+      "optional": true,
+      "os": [
+        "linux"
+      ],
+      "funding": {
+        "url": "https://opencollective.com/libvips"
+      }
+    },
+    "node_modules/@img/sharp-libvips-linux-x64": {
+      "version": "1.2.4",
+      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-x64/-/sharp-libvips-linux-x64-1.2.4.tgz",
+      "integrity": "sha512-tJxiiLsmHc9Ax1bz3oaOYBURTXGIRDODBqhveVHonrHJ9/+k89qbLl0bcJns+e4t4rvaNBxaEZsFtSfAdquPrw==",
+      "cpu": [
+        "x64"
+      ],
+      "license": "LGPL-3.0-or-later",
+      "optional": true,
+      "os": [
+        "linux"
+      ],
+      "funding": {
+        "url": "https://opencollective.com/libvips"
+      }
+    },
+    "node_modules/@img/sharp-libvips-linuxmusl-arm64": {
+      "version": "1.2.4",
+      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linuxmusl-arm64/-/sharp-libvips-linuxmusl-arm64-1.2.4.tgz",
+      "integrity": "sha512-FVQHuwx1IIuNow9QAbYUzJ+En8KcVm9Lk5+uGUQJHaZmMECZmOlix9HnH7n1TRkXMS0pGxIJokIVB9SuqZGGXw==",
+      "cpu": [
+        "arm64"
+      ],
+      "license": "LGPL-3.0-or-later",
+      "optional": true,
+      "os": [
+        "linux"
+      ],
+      "funding": {
+        "url": "https://opencollective.com/libvips"
+      }
+    },
+    "node_modules/@img/sharp-libvips-linuxmusl-x64": {
+      "version": "1.2.4",
+      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linuxmusl-x64/-/sharp-libvips-linuxmusl-x64-1.2.4.tgz",
+      "integrity": "sha512-+LpyBk7L44ZIXwz/VYfglaX/okxezESc6UxDSoyo2Ks6Jxc4Y7sGjpgU9s4PMgqgjj1gZCylTieNamqA1MF7Dg==",
+      "cpu": [
+        "x64"
+      ],
+      "license": "LGPL-3.0-or-later",
+      "optional": true,
+      "os": [
+        "linux"
+      ],
+      "funding": {
+        "url": "https://opencollective.com/libvips"
+      }
+    },
+    "node_modules/@img/sharp-linux-arm": {
+      "version": "0.34.5",
+      "resolved": "https://registry.npmjs.org/@img/sharp-linux-arm/-/sharp-linux-arm-0.34.5.tgz",
+      "integrity": "sha512-9dLqsvwtg1uuXBGZKsxem9595+ujv0sJ6Vi8wcTANSFpwV/GONat5eCkzQo/1O6zRIkh0m/8+5BjrRr7jDUSZw==",
+      "cpu": [
+        "arm"
+      ],
+      "license": "Apache-2.0",
+      "optional": true,
+      "os": [
+        "linux"
+      ],
+      "engines": {
+        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
+      },
+      "funding": {
+        "url": "https://opencollective.com/libvips"
+      },
+      "optionalDependencies": {
+        "@img/sharp-libvips-linux-arm": "1.2.4"
+      }
+    },
+    "node_modules/@img/sharp-linux-arm64": {
+      "version": "0.34.5",
+      "resolved": "https://registry.npmjs.org/@img/sharp-linux-arm64/-/sharp-linux-arm64-0.34.5.tgz",
+      "integrity": "sha512-bKQzaJRY/bkPOXyKx5EVup7qkaojECG6NLYswgktOZjaXecSAeCWiZwwiFf3/Y+O1HrauiE3FVsGxFg8c24rZg==",
+      "cpu": [
+        "arm64"
+      ],
+      "license": "Apache-2.0",
+      "optional": true,
+      "os": [
+        "linux"
+      ],
+      "engines": {
+        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
+      },
       "funding": {
         "url": "https://opencollective.com/libvips"
+      },
+      "optionalDependencies": {
+        "@img/sharp-libvips-linux-arm64": "1.2.4"
       }
     },
-    "node_modules/@img/sharp-libvips-linux-ppc64": {
-      "version": "1.2.4",
-      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-ppc64/-/sharp-libvips-linux-ppc64-1.2.4.tgz",
-      "integrity": "sha512-FMuvGijLDYG6lW+b/UvyilUWu5Ayu+3r2d1S8notiGCIyYU/76eig1UfMmkZ7vwgOrzKzlQbFSuQfgm7GYUPpA==",
+    "node_modules/@img/sharp-linux-ppc64": {
+      "version": "0.34.5",
+      "resolved": "https://registry.npmjs.org/@img/sharp-linux-ppc64/-/sharp-linux-ppc64-0.34.5.tgz",
+      "integrity": "sha512-7zznwNaqW6YtsfrGGDA6BRkISKAAE1Jo0QdpNYXNMHu2+0dTrPflTLNkpc8l7MUP5M16ZJcUvysVWWrMefZquA==",
       "cpu": [
         "ppc64"
       ],
-      "license": "LGPL-3.0-or-later",
+      "license": "Apache-2.0",
       "optional": true,
       "os": [
         "linux"
       ],
+      "engines": {
+        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
+      },
       "funding": {
         "url": "https://opencollective.com/libvips"
+      },
+      "optionalDependencies": {
+        "@img/sharp-libvips-linux-ppc64": "1.2.4"
       }
     },
-    "node_modules/@img/sharp-libvips-linux-riscv64": {
-      "version": "1.2.4",
-      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-riscv64/-/sharp-libvips-linux-riscv64-1.2.4.tgz",
-      "integrity": "sha512-oVDbcR4zUC0ce82teubSm+x6ETixtKZBh/qbREIOcI3cULzDyb18Sr/Wcyx7NRQeQzOiHTNbZFF1UwPS2scyGA==",
+    "node_modules/@img/sharp-linux-riscv64": {
+      "version": "0.34.5",
+      "resolved": "https://registry.npmjs.org/@img/sharp-linux-riscv64/-/sharp-linux-riscv64-0.34.5.tgz",
+      "integrity": "sha512-51gJuLPTKa7piYPaVs8GmByo7/U7/7TZOq+cnXJIHZKavIRHAP77e3N2HEl3dgiqdD/w0yUfiJnII77PuDDFdw==",
       "cpu": [
         "riscv64"
       ],
-      "license": "LGPL-3.0-or-later",
+      "license": "Apache-2.0",
       "optional": true,
       "os": [
         "linux"
       ],
+      "engines": {
+        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
+      },
       "funding": {
         "url": "https://opencollective.com/libvips"
+      },
+      "optionalDependencies": {
+        "@img/sharp-libvips-linux-riscv64": "1.2.4"
       }
     },
-    "node_modules/@img/sharp-libvips-linux-s390x": {
-      "version": "1.2.4",
-      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-s390x/-/sharp-libvips-linux-s390x-1.2.4.tgz",
-      "integrity": "sha512-qmp9VrzgPgMoGZyPvrQHqk02uyjA0/QrTO26Tqk6l4ZV0MPWIW6LTkqOIov+J1yEu7MbFQaDpwdwJKhbJvuRxQ==",
+    "node_modules/@img/sharp-linux-s390x": {
+      "version": "0.34.5",
+      "resolved": "https://registry.npmjs.org/@img/sharp-linux-s390x/-/sharp-linux-s390x-0.34.5.tgz",
+      "integrity": "sha512-nQtCk0PdKfho3eC5MrbQoigJ2gd1CgddUMkabUj+rBevs8tZ2cULOx46E7oyX+04WGfABgIwmMC0VqieTiR4jg==",
       "cpu": [
         "s390x"
       ],
-      "license": "LGPL-3.0-or-later",
+      "license": "Apache-2.0",
+      "optional": true,
+      "os": [
+        "linux"
+      ],
+      "engines": {
+        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
+      },
+      "funding": {
+        "url": "https://opencollective.com/libvips"
+      },
+      "optionalDependencies": {
+        "@img/sharp-libvips-linux-s390x": "1.2.4"
+      }
+    },
+    "node_modules/@img/sharp-linux-x64": {
+      "version": "0.34.5",
+      "resolved": "https://registry.npmjs.org/@img/sharp-linux-x64/-/sharp-linux-x64-0.34.5.tgz",
+      "integrity": "sha512-MEzd8HPKxVxVenwAa+JRPwEC7QFjoPWuS5NZnBt6B3pu7EG2Ge0id1oLHZpPJdn3OQK+BQDiw9zStiHBTJQQQQ==",
+      "cpu": [
+        "x64"
+      ],
+      "license": "Apache-2.0",
+      "optional": true,
+      "os": [
+        "linux"
+      ],
+      "engines": {
+        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
+      },
+      "funding": {
+        "url": "https://opencollective.com/libvips"
+      },
+      "optionalDependencies": {
+        "@img/sharp-libvips-linux-x64": "1.2.4"
+      }
+    },
+    "node_modules/@img/sharp-linuxmusl-arm64": {
+      "version": "0.34.5",
+      "resolved": "https://registry.npmjs.org/@img/sharp-linuxmusl-arm64/-/sharp-linuxmusl-arm64-0.34.5.tgz",
+      "integrity": "sha512-fprJR6GtRsMt6Kyfq44IsChVZeGN97gTD331weR1ex1c1rypDEABN6Tm2xa1wE6lYb5DdEnk03NZPqA7Id21yg==",
+      "cpu": [
+        "arm64"
+      ],
+      "license": "Apache-2.0",
       "optional": true,
       "os": [
         "linux"
       ],
+      "engines": {
+        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
+      },
+      "funding": {
+        "url": "https://opencollective.com/libvips"
+      },
+      "optionalDependencies": {
+        "@img/sharp-libvips-linuxmusl-arm64": "1.2.4"
+      }
+    },
+    "node_modules/@img/sharp-linuxmusl-x64": {
+      "version": "0.34.5",
+      "resolved": "https://registry.npmjs.org/@img/sharp-linuxmusl-x64/-/sharp-linuxmusl-x64-0.34.5.tgz",
+      "integrity": "sha512-Jg8wNT1MUzIvhBFxViqrEhWDGzqymo3sV7z7ZsaWbZNDLXRJZoRGrjulp60YYtV4wfY8VIKcWidjojlLcWrd8Q==",
+      "cpu": [
+        "x64"
+      ],
+      "license": "Apache-2.0",
+      "optional": true,
+      "os": [
+        "linux"
+      ],
+      "engines": {
+        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
+      },
+      "funding": {
+        "url": "https://opencollective.com/libvips"
+      },
+      "optionalDependencies": {
+        "@img/sharp-libvips-linuxmusl-x64": "1.2.4"
+      }
+    },
+    "node_modules/@img/sharp-wasm32": {
+      "version": "0.34.5",
+      "resolved": "https://registry.npmjs.org/@img/sharp-wasm32/-/sharp-wasm32-0.34.5.tgz",
+      "integrity": "sha512-OdWTEiVkY2PHwqkbBI8frFxQQFekHaSSkUIJkwzclWZe64O1X4UlUjqqqLaPbUpMOQk6FBu/HtlGXNblIs0huw==",
+      "cpu": [
+        "wasm32"
+      ],
+      "license": "Apache-2.0 AND LGPL-3.0-or-later AND MIT",
+      "optional": true,
+      "dependencies": {
+        "@emnapi/runtime": "^1.7.0"
+      },
+      "engines": {
+        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
+      },
+      "funding": {
+        "url": "https://opencollective.com/libvips"
+      }
+    },
+    "node_modules/@img/sharp-win32-arm64": {
+      "version": "0.34.5",
+      "resolved": "https://registry.npmjs.org/@img/sharp-win32-arm64/-/sharp-win32-arm64-0.34.5.tgz",
+      "integrity": "sha512-WQ3AgWCWYSb2yt+IG8mnC6Jdk9Whs7O0gxphblsLvdhSpSTtmu69ZG1Gkb6NuvxsNACwiPV6cNSZNzt0KPsw7g==",
+      "cpu": [
+        "arm64"
+      ],
+      "license": "Apache-2.0 AND LGPL-3.0-or-later",
+      "optional": true,
+      "os": [
+        "win32"
+      ],
+      "engines": {
+        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
+      },
+      "funding": {
+        "url": "https://opencollective.com/libvips"
+      }
+    },
+    "node_modules/@img/sharp-win32-ia32": {
+      "version": "0.34.5",
+      "resolved": "https://registry.npmjs.org/@img/sharp-win32-ia32/-/sharp-win32-ia32-0.34.5.tgz",
+      "integrity": "sha512-FV9m/7NmeCmSHDD5j4+4pNI8Cp3aW+JvLoXcTUo0IqyjSfAZJ8dIUmijx1qaJsIiU+Hosw6xM5KijAWRJCSgNg==",
+      "cpu": [
+        "ia32"
+      ],
+      "license": "Apache-2.0 AND LGPL-3.0-or-later",
+      "optional": true,
+      "os": [
+        "win32"
+      ],
+      "engines": {
+        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
+      },
+      "funding": {
+        "url": "https://opencollective.com/libvips"
+      }
+    },
+    "node_modules/@img/sharp-win32-x64": {
+      "version": "0.34.5",
+      "resolved": "https://registry.npmjs.org/@img/sharp-win32-x64/-/sharp-win32-x64-0.34.5.tgz",
+      "integrity": "sha512-+29YMsqY2/9eFEiW93eqWnuLcWcufowXewwSNIT6UwZdUUCrM3oFjMWH/Z6/TMmb4hlFenmfAVbpWeup2jryCw==",
+      "cpu": [
+        "x64"
+      ],
+      "license": "Apache-2.0 AND LGPL-3.0-or-later",
+      "optional": true,
+      "os": [
+        "win32"
+      ],
+      "engines": {
+        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
+      },
       "funding": {
         "url": "https://opencollective.com/libvips"
       }
     },
-    "node_modules/@img/sharp-libvips-linux-x64": {
-      "version": "1.2.4",
-      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-x64/-/sharp-libvips-linux-x64-1.2.4.tgz",
-      "integrity": "sha512-tJxiiLsmHc9Ax1bz3oaOYBURTXGIRDODBqhveVHonrHJ9/+k89qbLl0bcJns+e4t4rvaNBxaEZsFtSfAdquPrw==",
-      "cpu": [
-        "x64"
-      ],
-      "license": "LGPL-3.0-or-later",
-      "optional": true,
-      "os": [
-        "linux"
-      ],
-      "funding": {
-        "url": "https://opencollective.com/libvips"
+    "node_modules/@jridgewell/gen-mapping": {
+      "version": "0.3.13",
+      "resolved": "https://registry.npmjs.org/@jridgewell/gen-mapping/-/gen-mapping-0.3.13.tgz",
+      "integrity": "sha512-2kkt/7niJ6MgEPxF0bYdQ6etZaA+fQvDcLKckhy1yIQOzaoKjBBjSj63/aLVjYE3qhRt5dvM+uUyfCg6UKCBbA==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@jridgewell/sourcemap-codec": "^1.5.0",
+        "@jridgewell/trace-mapping": "^0.3.24"
+      }
+    },
+    "node_modules/@jridgewell/remapping": {
+      "version": "2.3.5",
+      "resolved": "https://registry.npmjs.org/@jridgewell/remapping/-/remapping-2.3.5.tgz",
+      "integrity": "sha512-LI9u/+laYG4Ds1TDKSJW2YPrIlcVYOwi2fUC6xB43lueCjgxV4lffOCZCtYFiH6TNOX+tQKXx97T4IKHbhyHEQ==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@jridgewell/gen-mapping": "^0.3.5",
+        "@jridgewell/trace-mapping": "^0.3.24"
+      }
+    },
+    "node_modules/@jridgewell/resolve-uri": {
+      "version": "3.1.2",
+      "resolved": "https://registry.npmjs.org/@jridgewell/resolve-uri/-/resolve-uri-3.1.2.tgz",
+      "integrity": "sha512-bRISgCIjP20/tbWSPWMEi54QVPRZExkuD9lJL+UIxUKtwVJA8wW1Trb1jMs1RFXo1CBTNZ/5hpC9QvmKWdopKw==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">=6.0.0"
+      }
+    },
+    "node_modules/@jridgewell/sourcemap-codec": {
+      "version": "1.5.5",
+      "resolved": "https://registry.npmjs.org/@jridgewell/sourcemap-codec/-/sourcemap-codec-1.5.5.tgz",
+      "integrity": "sha512-cYQ9310grqxueWbl+WuIUIaiUaDcj7WOq5fVhEljNVgRfOUhY9fy2zTvfoqWsnebh8Sl70VScFbICvJnLKB0Og==",
+      "dev": true,
+      "license": "MIT"
+    },
+    "node_modules/@jridgewell/trace-mapping": {
+      "version": "0.3.31",
+      "resolved": "https://registry.npmjs.org/@jridgewell/trace-mapping/-/trace-mapping-0.3.31.tgz",
+      "integrity": "sha512-zzNR+SdQSDJzc8joaeP8QQoCQr8NuYx2dIIytl1QeBEZHJ9uW6hebsrYgbz8hJwUQao3TWCMtmfV8Nu1twOLAw==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@jridgewell/resolve-uri": "^3.1.0",
+        "@jridgewell/sourcemap-codec": "^1.4.14"
+      }
+    },
+    "node_modules/@napi-rs/wasm-runtime": {
+      "version": "0.2.12",
+      "resolved": "https://registry.npmjs.org/@napi-rs/wasm-runtime/-/wasm-runtime-0.2.12.tgz",
+      "integrity": "sha512-ZVWUcfwY4E/yPitQJl481FjFo3K22D6qF0DuFH6Y/nbnE11GY5uguDxZMGXPQ8WQ0128MXQD7TnfHyK4oWoIJQ==",
+      "dev": true,
+      "license": "MIT",
+      "optional": true,
+      "dependencies": {
+        "@emnapi/core": "^1.4.3",
+        "@emnapi/runtime": "^1.4.3",
+        "@tybys/wasm-util": "^0.10.0"
+      }
+    },
+    "node_modules/@next/env": {
+      "version": "16.1.6",
+      "resolved": "https://registry.npmjs.org/@next/env/-/env-16.1.6.tgz",
+      "integrity": "sha512-N1ySLuZjnAtN3kFnwhAwPvZah8RJxKasD7x1f8shFqhncnWZn4JMfg37diLNuoHsLAlrDfM3g4mawVdtAG8XLQ==",
+      "license": "MIT"
+    },
+    "node_modules/@next/eslint-plugin-next": {
+      "version": "16.1.6",
+      "resolved": "https://registry.npmjs.org/@next/eslint-plugin-next/-/eslint-plugin-next-16.1.6.tgz",
+      "integrity": "sha512-/Qq3PTagA6+nYVfryAtQ7/9FEr/6YVyvOtl6rZnGsbReGLf0jZU6gkpr1FuChAQpvV46a78p4cmHOVP8mbfSMQ==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "fast-glob": "3.3.1"
       }
     },
-    "node_modules/@img/sharp-libvips-linuxmusl-arm64": {
-      "version": "1.2.4",
-      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linuxmusl-arm64/-/sharp-libvips-linuxmusl-arm64-1.2.4.tgz",
-      "integrity": "sha512-FVQHuwx1IIuNow9QAbYUzJ+En8KcVm9Lk5+uGUQJHaZmMECZmOlix9HnH7n1TRkXMS0pGxIJokIVB9SuqZGGXw==",
+    "node_modules/@next/swc-darwin-arm64": {
+      "version": "16.1.6",
+      "resolved": "https://registry.npmjs.org/@next/swc-darwin-arm64/-/swc-darwin-arm64-16.1.6.tgz",
+      "integrity": "sha512-wTzYulosJr/6nFnqGW7FrG3jfUUlEf8UjGA0/pyypJl42ExdVgC6xJgcXQ+V8QFn6niSG2Pb8+MIG1mZr2vczw==",
       "cpu": [
         "arm64"
       ],
-      "license": "LGPL-3.0-or-later",
+      "license": "MIT",
       "optional": true,
       "os": [
-        "linux"
+        "darwin"
       ],
-      "funding": {
-        "url": "https://opencollective.com/libvips"
+      "engines": {
+        "node": ">= 10"
       }
     },
-    "node_modules/@img/sharp-libvips-linuxmusl-x64": {
-      "version": "1.2.4",
-      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linuxmusl-x64/-/sharp-libvips-linuxmusl-x64-1.2.4.tgz",
-      "integrity": "sha512-+LpyBk7L44ZIXwz/VYfglaX/okxezESc6UxDSoyo2Ks6Jxc4Y7sGjpgU9s4PMgqgjj1gZCylTieNamqA1MF7Dg==",
+    "node_modules/@next/swc-darwin-x64": {
+      "version": "16.1.6",
+      "resolved": "https://registry.npmjs.org/@next/swc-darwin-x64/-/swc-darwin-x64-16.1.6.tgz",
+      "integrity": "sha512-BLFPYPDO+MNJsiDWbeVzqvYd4NyuRrEYVB5k2N3JfWncuHAy2IVwMAOlVQDFjj+krkWzhY2apvmekMkfQR0CUQ==",
       "cpu": [
         "x64"
       ],
-      "license": "LGPL-3.0-or-later",
+      "license": "MIT",
       "optional": true,
       "os": [
-        "linux"
+        "darwin"
       ],
-      "funding": {
-        "url": "https://opencollective.com/libvips"
+      "engines": {
+        "node": ">= 10"
       }
     },
-    "node_modules/@img/sharp-linux-arm": {
-      "version": "0.34.5",
-      "resolved": "https://registry.npmjs.org/@img/sharp-linux-arm/-/sharp-linux-arm-0.34.5.tgz",
-      "integrity": "sha512-9dLqsvwtg1uuXBGZKsxem9595+ujv0sJ6Vi8wcTANSFpwV/GONat5eCkzQo/1O6zRIkh0m/8+5BjrRr7jDUSZw==",
+    "node_modules/@next/swc-linux-arm64-gnu": {
+      "version": "16.1.6",
+      "resolved": "https://registry.npmjs.org/@next/swc-linux-arm64-gnu/-/swc-linux-arm64-gnu-16.1.6.tgz",
+      "integrity": "sha512-OJYkCd5pj/QloBvoEcJ2XiMnlJkRv9idWA/j0ugSuA34gMT6f5b7vOiCQHVRpvStoZUknhl6/UxOXL4OwtdaBw==",
       "cpu": [
-        "arm"
+        "arm64"
       ],
-      "license": "Apache-2.0",
+      "license": "MIT",
       "optional": true,
       "os": [
         "linux"
       ],
       "engines": {
-        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
-      },
-      "funding": {
-        "url": "https://opencollective.com/libvips"
-      },
-      "optionalDependencies": {
-        "@img/sharp-libvips-linux-arm": "1.2.4"
+        "node": ">= 10"
       }
     },
-    "node_modules/@img/sharp-linux-arm64": {
-      "version": "0.34.5",
-      "resolved": "https://registry.npmjs.org/@img/sharp-linux-arm64/-/sharp-linux-arm64-0.34.5.tgz",
-      "integrity": "sha512-bKQzaJRY/bkPOXyKx5EVup7qkaojECG6NLYswgktOZjaXecSAeCWiZwwiFf3/Y+O1HrauiE3FVsGxFg8c24rZg==",
+    "node_modules/@next/swc-linux-arm64-musl": {
+      "version": "16.1.6",
+      "resolved": "https://registry.npmjs.org/@next/swc-linux-arm64-musl/-/swc-linux-arm64-musl-16.1.6.tgz",
+      "integrity": "sha512-S4J2v+8tT3NIO9u2q+S0G5KdvNDjXfAv06OhfOzNDaBn5rw84DGXWndOEB7d5/x852A20sW1M56vhC/tRVbccQ==",
       "cpu": [
         "arm64"
       ],
-      "license": "Apache-2.0",
+      "license": "MIT",
       "optional": true,
       "os": [
         "linux"
       ],
       "engines": {
-        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
-      },
-      "funding": {
-        "url": "https://opencollective.com/libvips"
-      },
-      "optionalDependencies": {
-        "@img/sharp-libvips-linux-arm64": "1.2.4"
+        "node": ">= 10"
       }
     },
-    "node_modules/@img/sharp-linux-ppc64": {
-      "version": "0.34.5",
-      "resolved": "https://registry.npmjs.org/@img/sharp-linux-ppc64/-/sharp-linux-ppc64-0.34.5.tgz",
-      "integrity": "sha512-7zznwNaqW6YtsfrGGDA6BRkISKAAE1Jo0QdpNYXNMHu2+0dTrPflTLNkpc8l7MUP5M16ZJcUvysVWWrMefZquA==",
+    "node_modules/@next/swc-linux-x64-gnu": {
+      "version": "16.1.6",
+      "resolved": "https://registry.npmjs.org/@next/swc-linux-x64-gnu/-/swc-linux-x64-gnu-16.1.6.tgz",
+      "integrity": "sha512-2eEBDkFlMMNQnkTyPBhQOAyn2qMxyG2eE7GPH2WIDGEpEILcBPI/jdSv4t6xupSP+ot/jkfrCShLAa7+ZUPcJQ==",
       "cpu": [
-        "ppc64"
+        "x64"
       ],
-      "license": "Apache-2.0",
+      "license": "MIT",
       "optional": true,
       "os": [
         "linux"
       ],
       "engines": {
-        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
-      },
-      "funding": {
-        "url": "https://opencollective.com/libvips"
-      },
-      "optionalDependencies": {
-        "@img/sharp-libvips-linux-ppc64": "1.2.4"
+        "node": ">= 10"
       }
     },
-    "node_modules/@img/sharp-linux-riscv64": {
-      "version": "0.34.5",
-      "resolved": "https://registry.npmjs.org/@img/sharp-linux-riscv64/-/sharp-linux-riscv64-0.34.5.tgz",
-      "integrity": "sha512-51gJuLPTKa7piYPaVs8GmByo7/U7/7TZOq+cnXJIHZKavIRHAP77e3N2HEl3dgiqdD/w0yUfiJnII77PuDDFdw==",
+    "node_modules/@next/swc-linux-x64-musl": {
+      "version": "16.1.6",
+      "resolved": "https://registry.npmjs.org/@next/swc-linux-x64-musl/-/swc-linux-x64-musl-16.1.6.tgz",
+      "integrity": "sha512-oicJwRlyOoZXVlxmIMaTq7f8pN9QNbdes0q2FXfRsPhfCi8n8JmOZJm5oo1pwDaFbnnD421rVU409M3evFbIqg==",
       "cpu": [
-        "riscv64"
+        "x64"
       ],
-      "license": "Apache-2.0",
+      "license": "MIT",
       "optional": true,
       "os": [
         "linux"
       ],
       "engines": {
-        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
-      },
-      "funding": {
-        "url": "https://opencollective.com/libvips"
-      },
-      "optionalDependencies": {
-        "@img/sharp-libvips-linux-riscv64": "1.2.4"
+        "node": ">= 10"
       }
     },
-    "node_modules/@img/sharp-linux-s390x": {
-      "version": "0.34.5",
-      "resolved": "https://registry.npmjs.org/@img/sharp-linux-s390x/-/sharp-linux-s390x-0.34.5.tgz",
-      "integrity": "sha512-nQtCk0PdKfho3eC5MrbQoigJ2gd1CgddUMkabUj+rBevs8tZ2cULOx46E7oyX+04WGfABgIwmMC0VqieTiR4jg==",
+    "node_modules/@next/swc-win32-arm64-msvc": {
+      "version": "16.1.6",
+      "resolved": "https://registry.npmjs.org/@next/swc-win32-arm64-msvc/-/swc-win32-arm64-msvc-16.1.6.tgz",
+      "integrity": "sha512-gQmm8izDTPgs+DCWH22kcDmuUp7NyiJgEl18bcr8irXA5N2m2O+JQIr6f3ct42GOs9c0h8QF3L5SzIxcYAAXXw==",
       "cpu": [
-        "s390x"
+        "arm64"
       ],
-      "license": "Apache-2.0",
+      "license": "MIT",
       "optional": true,
       "os": [
-        "linux"
+        "win32"
       ],
       "engines": {
-        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
-      },
-      "funding": {
-        "url": "https://opencollective.com/libvips"
-      },
-      "optionalDependencies": {
-        "@img/sharp-libvips-linux-s390x": "1.2.4"
+        "node": ">= 10"
       }
     },
-    "node_modules/@img/sharp-linux-x64": {
-      "version": "0.34.5",
-      "resolved": "https://registry.npmjs.org/@img/sharp-linux-x64/-/sharp-linux-x64-0.34.5.tgz",
-      "integrity": "sha512-MEzd8HPKxVxVenwAa+JRPwEC7QFjoPWuS5NZnBt6B3pu7EG2Ge0id1oLHZpPJdn3OQK+BQDiw9zStiHBTJQQQQ==",
+    "node_modules/@next/swc-win32-x64-msvc": {
+      "version": "16.1.6",
+      "resolved": "https://registry.npmjs.org/@next/swc-win32-x64-msvc/-/swc-win32-x64-msvc-16.1.6.tgz",
+      "integrity": "sha512-NRfO39AIrzBnixKbjuo2YiYhB6o9d8v/ymU9m/Xk8cyVk+k7XylniXkHwjs4s70wedVffc6bQNbufk5v0xEm0A==",
       "cpu": [
         "x64"
       ],
-      "license": "Apache-2.0",
+      "license": "MIT",
       "optional": true,
       "os": [
-        "linux"
+        "win32"
       ],
       "engines": {
-        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
-      },
-      "funding": {
-        "url": "https://opencollective.com/libvips"
+        "node": ">= 10"
+      }
+    },
+    "node_modules/@nodelib/fs.scandir": {
+      "version": "2.1.5",
+      "resolved": "https://registry.npmjs.org/@nodelib/fs.scandir/-/fs.scandir-2.1.5.tgz",
+      "integrity": "sha512-vq24Bq3ym5HEQm2NKCr3yXDwjc7vTsEThRDnkp2DK9p1uqLR+DHurm/NOTo0KG7HYHU7eppKZj3MyqYuMBf62g==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@nodelib/fs.stat": "2.0.5",
+        "run-parallel": "^1.1.9"
       },
-      "optionalDependencies": {
-        "@img/sharp-libvips-linux-x64": "1.2.4"
+      "engines": {
+        "node": ">= 8"
       }
     },
-    "node_modules/@img/sharp-linuxmusl-arm64": {
-      "version": "0.34.5",
-      "resolved": "https://registry.npmjs.org/@img/sharp-linuxmusl-arm64/-/sharp-linuxmusl-arm64-0.34.5.tgz",
-      "integrity": "sha512-fprJR6GtRsMt6Kyfq44IsChVZeGN97gTD331weR1ex1c1rypDEABN6Tm2xa1wE6lYb5DdEnk03NZPqA7Id21yg==",
-      "cpu": [
-        "arm64"
-      ],
-      "license": "Apache-2.0",
-      "optional": true,
-      "os": [
-        "linux"
-      ],
+    "node_modules/@nodelib/fs.stat": {
+      "version": "2.0.5",
+      "resolved": "https://registry.npmjs.org/@nodelib/fs.stat/-/fs.stat-2.0.5.tgz",
+      "integrity": "sha512-RkhPPp2zrqDAQA/2jNhnztcPAlv64XdhIp7a7454A5ovI7Bukxgt7MX7udwAu3zg1DcpPU0rz3VV1SeaqvY4+A==",
+      "dev": true,
+      "license": "MIT",
       "engines": {
-        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
-      },
-      "funding": {
-        "url": "https://opencollective.com/libvips"
+        "node": ">= 8"
+      }
+    },
+    "node_modules/@nodelib/fs.walk": {
+      "version": "1.2.8",
+      "resolved": "https://registry.npmjs.org/@nodelib/fs.walk/-/fs.walk-1.2.8.tgz",
+      "integrity": "sha512-oGB+UxlgWcgQkgwo8GcEGwemoTFt3FIO9ababBmaGwXIoBKZ+GTy0pP185beGg7Llih/NSHSV2XAs1lnznocSg==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@nodelib/fs.scandir": "2.1.5",
+        "fastq": "^1.6.0"
       },
-      "optionalDependencies": {
-        "@img/sharp-libvips-linuxmusl-arm64": "1.2.4"
+      "engines": {
+        "node": ">= 8"
       }
     },
-    "node_modules/@img/sharp-linuxmusl-x64": {
-      "version": "0.34.5",
-      "resolved": "https://registry.npmjs.org/@img/sharp-linuxmusl-x64/-/sharp-linuxmusl-x64-0.34.5.tgz",
-      "integrity": "sha512-Jg8wNT1MUzIvhBFxViqrEhWDGzqymo3sV7z7ZsaWbZNDLXRJZoRGrjulp60YYtV4wfY8VIKcWidjojlLcWrd8Q==",
+    "node_modules/@nolyfill/is-core-module": {
+      "version": "1.0.39",
+      "resolved": "https://registry.npmjs.org/@nolyfill/is-core-module/-/is-core-module-1.0.39.tgz",
+      "integrity": "sha512-nn5ozdjYQpUCZlWGuxcJY/KpxkWQs4DcbMCmKojjyrYDEAGy4Ce19NN4v5MduafTwJlbKc99UA8YhSVqq9yPZA==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">=12.4.0"
+      }
+    },
+    "node_modules/@rolldown/pluginutils": {
+      "version": "1.0.0-rc.3",
+      "resolved": "https://registry.npmjs.org/@rolldown/pluginutils/-/pluginutils-1.0.0-rc.3.tgz",
+      "integrity": "sha512-eybk3TjzzzV97Dlj5c+XrBFW57eTNhzod66y9HrBlzJ6NsCrWCp/2kaPS3K9wJmurBC0Tdw4yPjXKZqlznim3Q==",
+      "dev": true,
+      "license": "MIT"
+    },
+    "node_modules/@rollup/rollup-android-arm-eabi": {
+      "version": "4.59.0",
+      "resolved": "https://registry.npmjs.org/@rollup/rollup-android-arm-eabi/-/rollup-android-arm-eabi-4.59.0.tgz",
+      "integrity": "sha512-upnNBkA6ZH2VKGcBj9Fyl9IGNPULcjXRlg0LLeaioQWueH30p6IXtJEbKAgvyv+mJaMxSm1l6xwDXYjpEMiLMg==",
       "cpu": [
-        "x64"
+        "arm"
       ],
-      "license": "Apache-2.0",
+      "dev": true,
+      "license": "MIT",
       "optional": true,
       "os": [
-        "linux"
-      ],
-      "engines": {
-        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
-      },
-      "funding": {
-        "url": "https://opencollective.com/libvips"
-      },
-      "optionalDependencies": {
-        "@img/sharp-libvips-linuxmusl-x64": "1.2.4"
-      }
+        "android"
+      ]
     },
-    "node_modules/@img/sharp-wasm32": {
-      "version": "0.34.5",
-      "resolved": "https://registry.npmjs.org/@img/sharp-wasm32/-/sharp-wasm32-0.34.5.tgz",
-      "integrity": "sha512-OdWTEiVkY2PHwqkbBI8frFxQQFekHaSSkUIJkwzclWZe64O1X4UlUjqqqLaPbUpMOQk6FBu/HtlGXNblIs0huw==",
+    "node_modules/@rollup/rollup-android-arm64": {
+      "version": "4.59.0",
+      "resolved": "https://registry.npmjs.org/@rollup/rollup-android-arm64/-/rollup-android-arm64-4.59.0.tgz",
+      "integrity": "sha512-hZ+Zxj3SySm4A/DylsDKZAeVg0mvi++0PYVceVyX7hemkw7OreKdCvW2oQ3T1FMZvCaQXqOTHb8qmBShoqk69Q==",
       "cpu": [
-        "wasm32"
+        "arm64"
       ],
-      "license": "Apache-2.0 AND LGPL-3.0-or-later AND MIT",
+      "dev": true,
+      "license": "MIT",
       "optional": true,
-      "dependencies": {
-        "@emnapi/runtime": "^1.7.0"
-      },
-      "engines": {
-        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
-      },
-      "funding": {
-        "url": "https://opencollective.com/libvips"
-      }
+      "os": [
+        "android"
+      ]
     },
-    "node_modules/@img/sharp-win32-arm64": {
-      "version": "0.34.5",
-      "resolved": "https://registry.npmjs.org/@img/sharp-win32-arm64/-/sharp-win32-arm64-0.34.5.tgz",
-      "integrity": "sha512-WQ3AgWCWYSb2yt+IG8mnC6Jdk9Whs7O0gxphblsLvdhSpSTtmu69ZG1Gkb6NuvxsNACwiPV6cNSZNzt0KPsw7g==",
+    "node_modules/@rollup/rollup-darwin-arm64": {
+      "version": "4.59.0",
+      "resolved": "https://registry.npmjs.org/@rollup/rollup-darwin-arm64/-/rollup-darwin-arm64-4.59.0.tgz",
+      "integrity": "sha512-W2Psnbh1J8ZJw0xKAd8zdNgF9HRLkdWwwdWqubSVk0pUuQkoHnv7rx4GiF9rT4t5DIZGAsConRE3AxCdJ4m8rg==",
       "cpu": [
         "arm64"
       ],
-      "license": "Apache-2.0 AND LGPL-3.0-or-later",
+      "dev": true,
+      "license": "MIT",
       "optional": true,
       "os": [
-        "win32"
-      ],
-      "engines": {
-        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
-      },
-      "funding": {
-        "url": "https://opencollective.com/libvips"
-      }
+        "darwin"
+      ]
     },
-    "node_modules/@img/sharp-win32-ia32": {
-      "version": "0.34.5",
-      "resolved": "https://registry.npmjs.org/@img/sharp-win32-ia32/-/sharp-win32-ia32-0.34.5.tgz",
-      "integrity": "sha512-FV9m/7NmeCmSHDD5j4+4pNI8Cp3aW+JvLoXcTUo0IqyjSfAZJ8dIUmijx1qaJsIiU+Hosw6xM5KijAWRJCSgNg==",
+    "node_modules/@rollup/rollup-darwin-x64": {
+      "version": "4.59.0",
+      "resolved": "https://registry.npmjs.org/@rollup/rollup-darwin-x64/-/rollup-darwin-x64-4.59.0.tgz",
+      "integrity": "sha512-ZW2KkwlS4lwTv7ZVsYDiARfFCnSGhzYPdiOU4IM2fDbL+QGlyAbjgSFuqNRbSthybLbIJ915UtZBtmuLrQAT/w==",
       "cpu": [
-        "ia32"
+        "x64"
       ],
-      "license": "Apache-2.0 AND LGPL-3.0-or-later",
+      "dev": true,
+      "license": "MIT",
       "optional": true,
       "os": [
-        "win32"
+        "darwin"
+      ]
+    },
+    "node_modules/@rollup/rollup-freebsd-arm64": {
+      "version": "4.59.0",
+      "resolved": "https://registry.npmjs.org/@rollup/rollup-freebsd-arm64/-/rollup-freebsd-arm64-4.59.0.tgz",
+      "integrity": "sha512-EsKaJ5ytAu9jI3lonzn3BgG8iRBjV4LxZexygcQbpiU0wU0ATxhNVEpXKfUa0pS05gTcSDMKpn3Sx+QB9RlTTA==",
+      "cpu": [
+        "arm64"
       ],
-      "engines": {
-        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
-      },
-      "funding": {
-        "url": "https://opencollective.com/libvips"
-      }
+      "dev": true,
+      "license": "MIT",
+      "optional": true,
+      "os": [
+        "freebsd"
+      ]
     },
-    "node_modules/@img/sharp-win32-x64": {
-      "version": "0.34.5",
-      "resolved": "https://registry.npmjs.org/@img/sharp-win32-x64/-/sharp-win32-x64-0.34.5.tgz",
-      "integrity": "sha512-+29YMsqY2/9eFEiW93eqWnuLcWcufowXewwSNIT6UwZdUUCrM3oFjMWH/Z6/TMmb4hlFenmfAVbpWeup2jryCw==",
+    "node_modules/@rollup/rollup-freebsd-x64": {
+      "version": "4.59.0",
+      "resolved": "https://registry.npmjs.org/@rollup/rollup-freebsd-x64/-/rollup-freebsd-x64-4.59.0.tgz",
+      "integrity": "sha512-d3DuZi2KzTMjImrxoHIAODUZYoUUMsuUiY4SRRcJy6NJoZ6iIqWnJu9IScV9jXysyGMVuW+KNzZvBLOcpdl3Vg==",
       "cpu": [
         "x64"
       ],
-      "license": "Apache-2.0 AND LGPL-3.0-or-later",
+      "dev": true,
+      "license": "MIT",
       "optional": true,
       "os": [
-        "win32"
-      ],
-      "engines": {
-        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
-      },
-      "funding": {
-        "url": "https://opencollective.com/libvips"
-      }
+        "freebsd"
+      ]
     },
-    "node_modules/@jridgewell/gen-mapping": {
-      "version": "0.3.13",
-      "resolved": "https://registry.npmjs.org/@jridgewell/gen-mapping/-/gen-mapping-0.3.13.tgz",
-      "integrity": "sha512-2kkt/7niJ6MgEPxF0bYdQ6etZaA+fQvDcLKckhy1yIQOzaoKjBBjSj63/aLVjYE3qhRt5dvM+uUyfCg6UKCBbA==",
+    "node_modules/@rollup/rollup-linux-arm-gnueabihf": {
+      "version": "4.59.0",
+      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-arm-gnueabihf/-/rollup-linux-arm-gnueabihf-4.59.0.tgz",
+      "integrity": "sha512-t4ONHboXi/3E0rT6OZl1pKbl2Vgxf9vJfWgmUoCEVQVxhW6Cw/c8I6hbbu7DAvgp82RKiH7TpLwxnJeKv2pbsw==",
+      "cpu": [
+        "arm"
+      ],
       "dev": true,
       "license": "MIT",
-      "dependencies": {
-        "@jridgewell/sourcemap-codec": "^1.5.0",
-        "@jridgewell/trace-mapping": "^0.3.24"
-      }
+      "optional": true,
+      "os": [
+        "linux"
+      ]
     },
-    "node_modules/@jridgewell/remapping": {
-      "version": "2.3.5",
-      "resolved": "https://registry.npmjs.org/@jridgewell/remapping/-/remapping-2.3.5.tgz",
-      "integrity": "sha512-LI9u/+laYG4Ds1TDKSJW2YPrIlcVYOwi2fUC6xB43lueCjgxV4lffOCZCtYFiH6TNOX+tQKXx97T4IKHbhyHEQ==",
+    "node_modules/@rollup/rollup-linux-arm-musleabihf": {
+      "version": "4.59.0",
+      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-arm-musleabihf/-/rollup-linux-arm-musleabihf-4.59.0.tgz",
+      "integrity": "sha512-CikFT7aYPA2ufMD086cVORBYGHffBo4K8MQ4uPS/ZnY54GKj36i196u8U+aDVT2LX4eSMbyHtyOh7D7Zvk2VvA==",
+      "cpu": [
+        "arm"
+      ],
       "dev": true,
       "license": "MIT",
-      "dependencies": {
-        "@jridgewell/gen-mapping": "^0.3.5",
-        "@jridgewell/trace-mapping": "^0.3.24"
-      }
+      "optional": true,
+      "os": [
+        "linux"
+      ]
     },
-    "node_modules/@jridgewell/resolve-uri": {
-      "version": "3.1.2",
-      "resolved": "https://registry.npmjs.org/@jridgewell/resolve-uri/-/resolve-uri-3.1.2.tgz",
-      "integrity": "sha512-bRISgCIjP20/tbWSPWMEi54QVPRZExkuD9lJL+UIxUKtwVJA8wW1Trb1jMs1RFXo1CBTNZ/5hpC9QvmKWdopKw==",
+    "node_modules/@rollup/rollup-linux-arm64-gnu": {
+      "version": "4.59.0",
+      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-arm64-gnu/-/rollup-linux-arm64-gnu-4.59.0.tgz",
+      "integrity": "sha512-jYgUGk5aLd1nUb1CtQ8E+t5JhLc9x5WdBKew9ZgAXg7DBk0ZHErLHdXM24rfX+bKrFe+Xp5YuJo54I5HFjGDAA==",
+      "cpu": [
+        "arm64"
+      ],
       "dev": true,
       "license": "MIT",
-      "engines": {
-        "node": ">=6.0.0"
-      }
+      "optional": true,
+      "os": [
+        "linux"
+      ]
     },
-    "node_modules/@jridgewell/sourcemap-codec": {
-      "version": "1.5.5",
-      "resolved": "https://registry.npmjs.org/@jridgewell/sourcemap-codec/-/sourcemap-codec-1.5.5.tgz",
-      "integrity": "sha512-cYQ9310grqxueWbl+WuIUIaiUaDcj7WOq5fVhEljNVgRfOUhY9fy2zTvfoqWsnebh8Sl70VScFbICvJnLKB0Og==",
+    "node_modules/@rollup/rollup-linux-arm64-musl": {
+      "version": "4.59.0",
+      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-arm64-musl/-/rollup-linux-arm64-musl-4.59.0.tgz",
+      "integrity": "sha512-peZRVEdnFWZ5Bh2KeumKG9ty7aCXzzEsHShOZEFiCQlDEepP1dpUl/SrUNXNg13UmZl+gzVDPsiCwnV1uI0RUA==",
+      "cpu": [
+        "arm64"
+      ],
       "dev": true,
-      "license": "MIT"
+      "license": "MIT",
+      "optional": true,
+      "os": [
+        "linux"
+      ]
     },
-    "node_modules/@jridgewell/trace-mapping": {
-      "version": "0.3.31",
-      "resolved": "https://registry.npmjs.org/@jridgewell/trace-mapping/-/trace-mapping-0.3.31.tgz",
-      "integrity": "sha512-zzNR+SdQSDJzc8joaeP8QQoCQr8NuYx2dIIytl1QeBEZHJ9uW6hebsrYgbz8hJwUQao3TWCMtmfV8Nu1twOLAw==",
+    "node_modules/@rollup/rollup-linux-loong64-gnu": {
+      "version": "4.59.0",
+      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-loong64-gnu/-/rollup-linux-loong64-gnu-4.59.0.tgz",
+      "integrity": "sha512-gbUSW/97f7+r4gHy3Jlup8zDG190AuodsWnNiXErp9mT90iCy9NKKU0Xwx5k8VlRAIV2uU9CsMnEFg/xXaOfXg==",
+      "cpu": [
+        "loong64"
+      ],
       "dev": true,
       "license": "MIT",
-      "dependencies": {
-        "@jridgewell/resolve-uri": "^3.1.0",
-        "@jridgewell/sourcemap-codec": "^1.4.14"
-      }
+      "optional": true,
+      "os": [
+        "linux"
+      ]
     },
-    "node_modules/@napi-rs/wasm-runtime": {
-      "version": "0.2.12",
-      "resolved": "https://registry.npmjs.org/@napi-rs/wasm-runtime/-/wasm-runtime-0.2.12.tgz",
-      "integrity": "sha512-ZVWUcfwY4E/yPitQJl481FjFo3K22D6qF0DuFH6Y/nbnE11GY5uguDxZMGXPQ8WQ0128MXQD7TnfHyK4oWoIJQ==",
+    "node_modules/@rollup/rollup-linux-loong64-musl": {
+      "version": "4.59.0",
+      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-loong64-musl/-/rollup-linux-loong64-musl-4.59.0.tgz",
+      "integrity": "sha512-yTRONe79E+o0FWFijasoTjtzG9EBedFXJMl888NBEDCDV9I2wGbFFfJQQe63OijbFCUZqxpHz1GzpbtSFikJ4Q==",
+      "cpu": [
+        "loong64"
+      ],
       "dev": true,
       "license": "MIT",
       "optional": true,
-      "dependencies": {
-        "@emnapi/core": "^1.4.3",
-        "@emnapi/runtime": "^1.4.3",
-        "@tybys/wasm-util": "^0.10.0"
-      }
-    },
-    "node_modules/@next/env": {
-      "version": "16.1.6",
-      "resolved": "https://registry.npmjs.org/@next/env/-/env-16.1.6.tgz",
-      "integrity": "sha512-N1ySLuZjnAtN3kFnwhAwPvZah8RJxKasD7x1f8shFqhncnWZn4JMfg37diLNuoHsLAlrDfM3g4mawVdtAG8XLQ==",
-      "license": "MIT"
+      "os": [
+        "linux"
+      ]
     },
-    "node_modules/@next/eslint-plugin-next": {
-      "version": "16.1.6",
-      "resolved": "https://registry.npmjs.org/@next/eslint-plugin-next/-/eslint-plugin-next-16.1.6.tgz",
-      "integrity": "sha512-/Qq3PTagA6+nYVfryAtQ7/9FEr/6YVyvOtl6rZnGsbReGLf0jZU6gkpr1FuChAQpvV46a78p4cmHOVP8mbfSMQ==",
+    "node_modules/@rollup/rollup-linux-ppc64-gnu": {
+      "version": "4.59.0",
+      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-ppc64-gnu/-/rollup-linux-ppc64-gnu-4.59.0.tgz",
+      "integrity": "sha512-sw1o3tfyk12k3OEpRddF68a1unZ5VCN7zoTNtSn2KndUE+ea3m3ROOKRCZxEpmT9nsGnogpFP9x6mnLTCaoLkA==",
+      "cpu": [
+        "ppc64"
+      ],
       "dev": true,
       "license": "MIT",
-      "dependencies": {
-        "fast-glob": "3.3.1"
-      }
+      "optional": true,
+      "os": [
+        "linux"
+      ]
     },
-    "node_modules/@next/swc-darwin-arm64": {
-      "version": "16.1.6",
-      "resolved": "https://registry.npmjs.org/@next/swc-darwin-arm64/-/swc-darwin-arm64-16.1.6.tgz",
-      "integrity": "sha512-wTzYulosJr/6nFnqGW7FrG3jfUUlEf8UjGA0/pyypJl42ExdVgC6xJgcXQ+V8QFn6niSG2Pb8+MIG1mZr2vczw==",
+    "node_modules/@rollup/rollup-linux-ppc64-musl": {
+      "version": "4.59.0",
+      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-ppc64-musl/-/rollup-linux-ppc64-musl-4.59.0.tgz",
+      "integrity": "sha512-+2kLtQ4xT3AiIxkzFVFXfsmlZiG5FXYW7ZyIIvGA7Bdeuh9Z0aN4hVyXS/G1E9bTP/vqszNIN/pUKCk/BTHsKA==",
       "cpu": [
-        "arm64"
+        "ppc64"
       ],
+      "dev": true,
       "license": "MIT",
       "optional": true,
       "os": [
-        "darwin"
-      ],
-      "engines": {
-        "node": ">= 10"
-      }
+        "linux"
+      ]
     },
-    "node_modules/@next/swc-darwin-x64": {
-      "version": "16.1.6",
-      "resolved": "https://registry.npmjs.org/@next/swc-darwin-x64/-/swc-darwin-x64-16.1.6.tgz",
-      "integrity": "sha512-BLFPYPDO+MNJsiDWbeVzqvYd4NyuRrEYVB5k2N3JfWncuHAy2IVwMAOlVQDFjj+krkWzhY2apvmekMkfQR0CUQ==",
+    "node_modules/@rollup/rollup-linux-riscv64-gnu": {
+      "version": "4.59.0",
+      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-riscv64-gnu/-/rollup-linux-riscv64-gnu-4.59.0.tgz",
+      "integrity": "sha512-NDYMpsXYJJaj+I7UdwIuHHNxXZ/b/N2hR15NyH3m2qAtb/hHPA4g4SuuvrdxetTdndfj9b1WOmy73kcPRoERUg==",
       "cpu": [
-        "x64"
+        "riscv64"
       ],
+      "dev": true,
       "license": "MIT",
       "optional": true,
       "os": [
-        "darwin"
-      ],
-      "engines": {
-        "node": ">= 10"
-      }
+        "linux"
+      ]
     },
-    "node_modules/@next/swc-linux-arm64-gnu": {
-      "version": "16.1.6",
-      "resolved": "https://registry.npmjs.org/@next/swc-linux-arm64-gnu/-/swc-linux-arm64-gnu-16.1.6.tgz",
-      "integrity": "sha512-OJYkCd5pj/QloBvoEcJ2XiMnlJkRv9idWA/j0ugSuA34gMT6f5b7vOiCQHVRpvStoZUknhl6/UxOXL4OwtdaBw==",
+    "node_modules/@rollup/rollup-linux-riscv64-musl": {
+      "version": "4.59.0",
+      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-riscv64-musl/-/rollup-linux-riscv64-musl-4.59.0.tgz",
+      "integrity": "sha512-nLckB8WOqHIf1bhymk+oHxvM9D3tyPndZH8i8+35p/1YiVoVswPid2yLzgX7ZJP0KQvnkhM4H6QZ5m0LzbyIAg==",
       "cpu": [
-        "arm64"
+        "riscv64"
       ],
+      "dev": true,
       "license": "MIT",
       "optional": true,
       "os": [
         "linux"
+      ]
+    },
+    "node_modules/@rollup/rollup-linux-s390x-gnu": {
+      "version": "4.59.0",
+      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-s390x-gnu/-/rollup-linux-s390x-gnu-4.59.0.tgz",
+      "integrity": "sha512-oF87Ie3uAIvORFBpwnCvUzdeYUqi2wY6jRFWJAy1qus/udHFYIkplYRW+wo+GRUP4sKzYdmE1Y3+rY5Gc4ZO+w==",
+      "cpu": [
+        "s390x"
       ],
-      "engines": {
-        "node": ">= 10"
-      }
+      "dev": true,
+      "license": "MIT",
+      "optional": true,
+      "os": [
+        "linux"
+      ]
     },
-    "node_modules/@next/swc-linux-arm64-musl": {
-      "version": "16.1.6",
-      "resolved": "https://registry.npmjs.org/@next/swc-linux-arm64-musl/-/swc-linux-arm64-musl-16.1.6.tgz",
-      "integrity": "sha512-S4J2v+8tT3NIO9u2q+S0G5KdvNDjXfAv06OhfOzNDaBn5rw84DGXWndOEB7d5/x852A20sW1M56vhC/tRVbccQ==",
+    "node_modules/@rollup/rollup-linux-x64-gnu": {
+      "version": "4.59.0",
+      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-x64-gnu/-/rollup-linux-x64-gnu-4.59.0.tgz",
+      "integrity": "sha512-3AHmtQq/ppNuUspKAlvA8HtLybkDflkMuLK4DPo77DfthRb71V84/c4MlWJXixZz4uruIH4uaa07IqoAkG64fg==",
       "cpu": [
-        "arm64"
+        "x64"
       ],
+      "dev": true,
       "license": "MIT",
       "optional": true,
       "os": [
         "linux"
-      ],
-      "engines": {
-        "node": ">= 10"
-      }
+      ]
     },
-    "node_modules/@next/swc-linux-x64-gnu": {
-      "version": "16.1.6",
-      "resolved": "https://registry.npmjs.org/@next/swc-linux-x64-gnu/-/swc-linux-x64-gnu-16.1.6.tgz",
-      "integrity": "sha512-2eEBDkFlMMNQnkTyPBhQOAyn2qMxyG2eE7GPH2WIDGEpEILcBPI/jdSv4t6xupSP+ot/jkfrCShLAa7+ZUPcJQ==",
+    "node_modules/@rollup/rollup-linux-x64-musl": {
+      "version": "4.59.0",
+      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-x64-musl/-/rollup-linux-x64-musl-4.59.0.tgz",
+      "integrity": "sha512-2UdiwS/9cTAx7qIUZB/fWtToJwvt0Vbo0zmnYt7ED35KPg13Q0ym1g442THLC7VyI6JfYTP4PiSOWyoMdV2/xg==",
       "cpu": [
         "x64"
       ],
+      "dev": true,
       "license": "MIT",
       "optional": true,
       "os": [
         "linux"
-      ],
-      "engines": {
-        "node": ">= 10"
-      }
+      ]
     },
-    "node_modules/@next/swc-linux-x64-musl": {
-      "version": "16.1.6",
-      "resolved": "https://registry.npmjs.org/@next/swc-linux-x64-musl/-/swc-linux-x64-musl-16.1.6.tgz",
-      "integrity": "sha512-oicJwRlyOoZXVlxmIMaTq7f8pN9QNbdes0q2FXfRsPhfCi8n8JmOZJm5oo1pwDaFbnnD421rVU409M3evFbIqg==",
+    "node_modules/@rollup/rollup-openbsd-x64": {
+      "version": "4.59.0",
+      "resolved": "https://registry.npmjs.org/@rollup/rollup-openbsd-x64/-/rollup-openbsd-x64-4.59.0.tgz",
+      "integrity": "sha512-M3bLRAVk6GOwFlPTIxVBSYKUaqfLrn8l0psKinkCFxl4lQvOSz8ZrKDz2gxcBwHFpci0B6rttydI4IpS4IS/jQ==",
       "cpu": [
         "x64"
       ],
+      "dev": true,
       "license": "MIT",
       "optional": true,
       "os": [
-        "linux"
-      ],
-      "engines": {
-        "node": ">= 10"
-      }
+        "openbsd"
+      ]
     },
-    "node_modules/@next/swc-win32-arm64-msvc": {
-      "version": "16.1.6",
-      "resolved": "https://registry.npmjs.org/@next/swc-win32-arm64-msvc/-/swc-win32-arm64-msvc-16.1.6.tgz",
-      "integrity": "sha512-gQmm8izDTPgs+DCWH22kcDmuUp7NyiJgEl18bcr8irXA5N2m2O+JQIr6f3ct42GOs9c0h8QF3L5SzIxcYAAXXw==",
+    "node_modules/@rollup/rollup-openharmony-arm64": {
+      "version": "4.59.0",
+      "resolved": "https://registry.npmjs.org/@rollup/rollup-openharmony-arm64/-/rollup-openharmony-arm64-4.59.0.tgz",
+      "integrity": "sha512-tt9KBJqaqp5i5HUZzoafHZX8b5Q2Fe7UjYERADll83O4fGqJ49O1FsL6LpdzVFQcpwvnyd0i+K/VSwu/o/nWlA==",
       "cpu": [
         "arm64"
       ],
+      "dev": true,
       "license": "MIT",
       "optional": true,
       "os": [
-        "win32"
-      ],
-      "engines": {
-        "node": ">= 10"
-      }
+        "openharmony"
+      ]
     },
-    "node_modules/@next/swc-win32-x64-msvc": {
-      "version": "16.1.6",
-      "resolved": "https://registry.npmjs.org/@next/swc-win32-x64-msvc/-/swc-win32-x64-msvc-16.1.6.tgz",
-      "integrity": "sha512-NRfO39AIrzBnixKbjuo2YiYhB6o9d8v/ymU9m/Xk8cyVk+k7XylniXkHwjs4s70wedVffc6bQNbufk5v0xEm0A==",
+    "node_modules/@rollup/rollup-win32-arm64-msvc": {
+      "version": "4.59.0",
+      "resolved": "https://registry.npmjs.org/@rollup/rollup-win32-arm64-msvc/-/rollup-win32-arm64-msvc-4.59.0.tgz",
+      "integrity": "sha512-V5B6mG7OrGTwnxaNUzZTDTjDS7F75PO1ae6MJYdiMu60sq0CqN5CVeVsbhPxalupvTX8gXVSU9gq+Rx1/hvu6A==",
       "cpu": [
-        "x64"
+        "arm64"
       ],
+      "dev": true,
       "license": "MIT",
       "optional": true,
       "os": [
         "win32"
-      ],
-      "engines": {
-        "node": ">= 10"
-      }
-    },
-    "node_modules/@nodelib/fs.scandir": {
-      "version": "2.1.5",
-      "resolved": "https://registry.npmjs.org/@nodelib/fs.scandir/-/fs.scandir-2.1.5.tgz",
-      "integrity": "sha512-vq24Bq3ym5HEQm2NKCr3yXDwjc7vTsEThRDnkp2DK9p1uqLR+DHurm/NOTo0KG7HYHU7eppKZj3MyqYuMBf62g==",
-      "dev": true,
-      "license": "MIT",
-      "dependencies": {
-        "@nodelib/fs.stat": "2.0.5",
-        "run-parallel": "^1.1.9"
-      },
-      "engines": {
-        "node": ">= 8"
-      }
+      ]
     },
-    "node_modules/@nodelib/fs.stat": {
-      "version": "2.0.5",
-      "resolved": "https://registry.npmjs.org/@nodelib/fs.stat/-/fs.stat-2.0.5.tgz",
-      "integrity": "sha512-RkhPPp2zrqDAQA/2jNhnztcPAlv64XdhIp7a7454A5ovI7Bukxgt7MX7udwAu3zg1DcpPU0rz3VV1SeaqvY4+A==",
+    "node_modules/@rollup/rollup-win32-ia32-msvc": {
+      "version": "4.59.0",
+      "resolved": "https://registry.npmjs.org/@rollup/rollup-win32-ia32-msvc/-/rollup-win32-ia32-msvc-4.59.0.tgz",
+      "integrity": "sha512-UKFMHPuM9R0iBegwzKF4y0C4J9u8C6MEJgFuXTBerMk7EJ92GFVFYBfOZaSGLu6COf7FxpQNqhNS4c4icUPqxA==",
+      "cpu": [
+        "ia32"
+      ],
       "dev": true,
       "license": "MIT",
-      "engines": {
-        "node": ">= 8"
-      }
+      "optional": true,
+      "os": [
+        "win32"
+      ]
     },
-    "node_modules/@nodelib/fs.walk": {
-      "version": "1.2.8",
-      "resolved": "https://registry.npmjs.org/@nodelib/fs.walk/-/fs.walk-1.2.8.tgz",
-      "integrity": "sha512-oGB+UxlgWcgQkgwo8GcEGwemoTFt3FIO9ababBmaGwXIoBKZ+GTy0pP185beGg7Llih/NSHSV2XAs1lnznocSg==",
+    "node_modules/@rollup/rollup-win32-x64-gnu": {
+      "version": "4.59.0",
+      "resolved": "https://registry.npmjs.org/@rollup/rollup-win32-x64-gnu/-/rollup-win32-x64-gnu-4.59.0.tgz",
+      "integrity": "sha512-laBkYlSS1n2L8fSo1thDNGrCTQMmxjYY5G0WFWjFFYZkKPjsMBsgJfGf4TLxXrF6RyhI60L8TMOjBMvXiTcxeA==",
+      "cpu": [
+        "x64"
+      ],
       "dev": true,
       "license": "MIT",
-      "dependencies": {
-        "@nodelib/fs.scandir": "2.1.5",
-        "fastq": "^1.6.0"
-      },
-      "engines": {
-        "node": ">= 8"
-      }
+      "optional": true,
+      "os": [
+        "win32"
+      ]
     },
-    "node_modules/@nolyfill/is-core-module": {
-      "version": "1.0.39",
-      "resolved": "https://registry.npmjs.org/@nolyfill/is-core-module/-/is-core-module-1.0.39.tgz",
-      "integrity": "sha512-nn5ozdjYQpUCZlWGuxcJY/KpxkWQs4DcbMCmKojjyrYDEAGy4Ce19NN4v5MduafTwJlbKc99UA8YhSVqq9yPZA==",
+    "node_modules/@rollup/rollup-win32-x64-msvc": {
+      "version": "4.59.0",
+      "resolved": "https://registry.npmjs.org/@rollup/rollup-win32-x64-msvc/-/rollup-win32-x64-msvc-4.59.0.tgz",
+      "integrity": "sha512-2HRCml6OztYXyJXAvdDXPKcawukWY2GpR5/nxKp4iBgiO3wcoEGkAaqctIbZcNB6KlUQBIqt8VYkNSj2397EfA==",
+      "cpu": [
+        "x64"
+      ],
       "dev": true,
       "license": "MIT",
-      "engines": {
-        "node": ">=12.4.0"
-      }
+      "optional": true,
+      "os": [
+        "win32"
+      ]
     },
     "node_modules/@rtsao/scc": {
       "version": "1.1.0",
@@ -1236,6 +2327,13 @@
       "dev": true,
       "license": "MIT"
     },
+    "node_modules/@standard-schema/spec": {
+      "version": "1.1.0",
+      "resolved": "https://registry.npmjs.org/@standard-schema/spec/-/spec-1.1.0.tgz",
+      "integrity": "sha512-l2aFy5jALhniG5HgqrD6jXLi/rUWrKvqN/qJx6yoJsgKhblVd+iqqU4RCXavm/jPityDo5TCvKMnpjKnOriy0w==",
+      "dev": true,
+      "license": "MIT"
+    },
     "node_modules/@swc/helpers": {
       "version": "0.5.15",
       "resolved": "https://registry.npmjs.org/@swc/helpers/-/helpers-0.5.15.tgz",
@@ -1529,6 +2627,93 @@
         "tailwindcss": "4.2.1"
       }
     },
+    "node_modules/@testing-library/dom": {
+      "version": "10.4.1",
+      "resolved": "https://registry.npmjs.org/@testing-library/dom/-/dom-10.4.1.tgz",
+      "integrity": "sha512-o4PXJQidqJl82ckFaXUeoAW+XysPLauYI43Abki5hABd853iMhitooc6znOnczgbTYmEP6U6/y1ZyKAIsvMKGg==",
+      "dev": true,
+      "license": "MIT",
+      "peer": true,
+      "dependencies": {
+        "@babel/code-frame": "^7.10.4",
+        "@babel/runtime": "^7.12.5",
+        "@types/aria-query": "^5.0.1",
+        "aria-query": "5.3.0",
+        "dom-accessibility-api": "^0.5.9",
+        "lz-string": "^1.5.0",
+        "picocolors": "1.1.1",
+        "pretty-format": "^27.0.2"
+      },
+      "engines": {
+        "node": ">=18"
+      }
+    },
+    "node_modules/@testing-library/dom/node_modules/aria-query": {
+      "version": "5.3.0",
+      "resolved": "https://registry.npmjs.org/aria-query/-/aria-query-5.3.0.tgz",
+      "integrity": "sha512-b0P0sZPKtyu8HkeRAfCq0IfURZK+SuwMjY1UXGBU27wpAiTwQAIlq56IbIO+ytk/JjS1fMR14ee5WBBfKi5J6A==",
+      "dev": true,
+      "license": "Apache-2.0",
+      "peer": true,
+      "dependencies": {
+        "dequal": "^2.0.3"
+      }
+    },
+    "node_modules/@testing-library/jest-dom": {
+      "version": "6.9.1",
+      "resolved": "https://registry.npmjs.org/@testing-library/jest-dom/-/jest-dom-6.9.1.tgz",
+      "integrity": "sha512-zIcONa+hVtVSSep9UT3jZ5rizo2BsxgyDYU7WFD5eICBE7no3881HGeb/QkGfsJs6JTkY1aQhT7rIPC7e+0nnA==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@adobe/css-tools": "^4.4.0",
+        "aria-query": "^5.0.0",
+        "css.escape": "^1.5.1",
+        "dom-accessibility-api": "^0.6.3",
+        "picocolors": "^1.1.1",
+        "redent": "^3.0.0"
+      },
+      "engines": {
+        "node": ">=14",
+        "npm": ">=6",
+        "yarn": ">=1"
+      }
+    },
+    "node_modules/@testing-library/jest-dom/node_modules/dom-accessibility-api": {
+      "version": "0.6.3",
+      "resolved": "https://registry.npmjs.org/dom-accessibility-api/-/dom-accessibility-api-0.6.3.tgz",
+      "integrity": "sha512-7ZgogeTnjuHbo+ct10G9Ffp0mif17idi0IyWNVA/wcwcm7NPOD/WEHVP3n7n3MhXqxoIYm8d6MuZohYWIZ4T3w==",
+      "dev": true,
+      "license": "MIT"
+    },
+    "node_modules/@testing-library/react": {
+      "version": "16.3.2",
+      "resolved": "https://registry.npmjs.org/@testing-library/react/-/react-16.3.2.tgz",
+      "integrity": "sha512-XU5/SytQM+ykqMnAnvB2umaJNIOsLF3PVv//1Ew4CTcpz0/BRyy/af40qqrt7SjKpDdT1saBMc42CUok5gaw+g==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@babel/runtime": "^7.12.5"
+      },
+      "engines": {
+        "node": ">=18"
+      },
+      "peerDependencies": {
+        "@testing-library/dom": "^10.0.0",
+        "@types/react": "^18.0.0 || ^19.0.0",
+        "@types/react-dom": "^18.0.0 || ^19.0.0",
+        "react": "^18.0.0 || ^19.0.0",
+        "react-dom": "^18.0.0 || ^19.0.0"
+      },
+      "peerDependenciesMeta": {
+        "@types/react": {
+          "optional": true
+        },
+        "@types/react-dom": {
+          "optional": true
+        }
+      }
+    },
     "node_modules/@tybys/wasm-util": {
       "version": "0.10.1",
       "resolved": "https://registry.npmjs.org/@tybys/wasm-util/-/wasm-util-0.10.1.tgz",
@@ -1540,6 +2725,77 @@
         "tslib": "^2.4.0"
       }
     },
+    "node_modules/@types/aria-query": {
+      "version": "5.0.4",
+      "resolved": "https://registry.npmjs.org/@types/aria-query/-/aria-query-5.0.4.tgz",
+      "integrity": "sha512-rfT93uj5s0PRL7EzccGMs3brplhcrghnDoV26NqKhCAS1hVo+WdNsPvE/yb6ilfr5hi2MEk6d5EWJTKdxg8jVw==",
+      "dev": true,
+      "license": "MIT",
+      "peer": true
+    },
+    "node_modules/@types/babel__core": {
+      "version": "7.20.5",
+      "resolved": "https://registry.npmjs.org/@types/babel__core/-/babel__core-7.20.5.tgz",
+      "integrity": "sha512-qoQprZvz5wQFJwMDqeseRXWv3rqMvhgpbXFfVyWhbx9X47POIA6i/+dXefEmZKoAgOaTdaIgNSMqMIU61yRyzA==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@babel/parser": "^7.20.7",
+        "@babel/types": "^7.20.7",
+        "@types/babel__generator": "*",
+        "@types/babel__template": "*",
+        "@types/babel__traverse": "*"
+      }
+    },
+    "node_modules/@types/babel__generator": {
+      "version": "7.27.0",
+      "resolved": "https://registry.npmjs.org/@types/babel__generator/-/babel__generator-7.27.0.tgz",
+      "integrity": "sha512-ufFd2Xi92OAVPYsy+P4n7/U7e68fex0+Ee8gSG9KX7eo084CWiQ4sdxktvdl0bOPupXtVJPY19zk6EwWqUQ8lg==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@babel/types": "^7.0.0"
+      }
+    },
+    "node_modules/@types/babel__template": {
+      "version": "7.4.4",
+      "resolved": "https://registry.npmjs.org/@types/babel__template/-/babel__template-7.4.4.tgz",
+      "integrity": "sha512-h/NUaSyG5EyxBIp8YRxo4RMe2/qQgvyowRwVMzhYhBCONbW8PUsg4lkFMrhgZhUe5z3L3MiLDuvyJ/CaPa2A8A==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@babel/parser": "^7.1.0",
+        "@babel/types": "^7.0.0"
+      }
+    },
+    "node_modules/@types/babel__traverse": {
+      "version": "7.28.0",
+      "resolved": "https://registry.npmjs.org/@types/babel__traverse/-/babel__traverse-7.28.0.tgz",
+      "integrity": "sha512-8PvcXf70gTDZBgt9ptxJ8elBeBjcLOAcOtoO/mPJjtji1+CdGbHgm77om1GrsPxsiE+uXIpNSK64UYaIwQXd4Q==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@babel/types": "^7.28.2"
+      }
+    },
+    "node_modules/@types/chai": {
+      "version": "5.2.3",
+      "resolved": "https://registry.npmjs.org/@types/chai/-/chai-5.2.3.tgz",
+      "integrity": "sha512-Mw558oeA9fFbv65/y4mHtXDs9bPnFMZAL/jxdPFUpOHHIXX91mcgEHbS5Lahr+pwZFR8A7GQleRWeI6cGFC2UA==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@types/deep-eql": "*",
+        "assertion-error": "^2.0.1"
+      }
+    },
+    "node_modules/@types/deep-eql": {
+      "version": "4.0.2",
+      "resolved": "https://registry.npmjs.org/@types/deep-eql/-/deep-eql-4.0.2.tgz",
+      "integrity": "sha512-c9h9dVVMigMPc4bwTvC5dxqtqJZwQPePsWjPlpSOnojbor6pGqdk541lfA7AqFQr5pB1BRdq0juY9db81BwyFw==",
+      "dev": true,
+      "license": "MIT"
+    },
     "node_modules/@types/estree": {
       "version": "1.0.8",
       "resolved": "https://registry.npmjs.org/@types/estree/-/estree-1.0.8.tgz",
@@ -2150,10 +3406,142 @@
       ],
       "dev": true,
       "license": "MIT",
-      "optional": true,
-      "os": [
-        "win32"
-      ]
+      "optional": true,
+      "os": [
+        "win32"
+      ]
+    },
+    "node_modules/@vitejs/plugin-react": {
+      "version": "5.1.4",
+      "resolved": "https://registry.npmjs.org/@vitejs/plugin-react/-/plugin-react-5.1.4.tgz",
+      "integrity": "sha512-VIcFLdRi/VYRU8OL/puL7QXMYafHmqOnwTZY50U1JPlCNj30PxCMx65c494b1K9be9hX83KVt0+gTEwTWLqToA==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@babel/core": "^7.29.0",
+        "@babel/plugin-transform-react-jsx-self": "^7.27.1",
+        "@babel/plugin-transform-react-jsx-source": "^7.27.1",
+        "@rolldown/pluginutils": "1.0.0-rc.3",
+        "@types/babel__core": "^7.20.5",
+        "react-refresh": "^0.18.0"
+      },
+      "engines": {
+        "node": "^20.19.0 || >=22.12.0"
+      },
+      "peerDependencies": {
+        "vite": "^4.2.0 || ^5.0.0 || ^6.0.0 || ^7.0.0"
+      }
+    },
+    "node_modules/@vitest/expect": {
+      "version": "4.0.18",
+      "resolved": "https://registry.npmjs.org/@vitest/expect/-/expect-4.0.18.tgz",
+      "integrity": "sha512-8sCWUyckXXYvx4opfzVY03EOiYVxyNrHS5QxX3DAIi5dpJAAkyJezHCP77VMX4HKA2LDT/Jpfo8i2r5BE3GnQQ==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@standard-schema/spec": "^1.0.0",
+        "@types/chai": "^5.2.2",
+        "@vitest/spy": "4.0.18",
+        "@vitest/utils": "4.0.18",
+        "chai": "^6.2.1",
+        "tinyrainbow": "^3.0.3"
+      },
+      "funding": {
+        "url": "https://opencollective.com/vitest"
+      }
+    },
+    "node_modules/@vitest/mocker": {
+      "version": "4.0.18",
+      "resolved": "https://registry.npmjs.org/@vitest/mocker/-/mocker-4.0.18.tgz",
+      "integrity": "sha512-HhVd0MDnzzsgevnOWCBj5Otnzobjy5wLBe4EdeeFGv8luMsGcYqDuFRMcttKWZA5vVO8RFjexVovXvAM4JoJDQ==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@vitest/spy": "4.0.18",
+        "estree-walker": "^3.0.3",
+        "magic-string": "^0.30.21"
+      },
+      "funding": {
+        "url": "https://opencollective.com/vitest"
+      },
+      "peerDependencies": {
+        "msw": "^2.4.9",
+        "vite": "^6.0.0 || ^7.0.0-0"
+      },
+      "peerDependenciesMeta": {
+        "msw": {
+          "optional": true
+        },
+        "vite": {
+          "optional": true
+        }
+      }
+    },
+    "node_modules/@vitest/pretty-format": {
+      "version": "4.0.18",
+      "resolved": "https://registry.npmjs.org/@vitest/pretty-format/-/pretty-format-4.0.18.tgz",
+      "integrity": "sha512-P24GK3GulZWC5tz87ux0m8OADrQIUVDPIjjj65vBXYG17ZeU3qD7r+MNZ1RNv4l8CGU2vtTRqixrOi9fYk/yKw==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "tinyrainbow": "^3.0.3"
+      },
+      "funding": {
+        "url": "https://opencollective.com/vitest"
+      }
+    },
+    "node_modules/@vitest/runner": {
+      "version": "4.0.18",
+      "resolved": "https://registry.npmjs.org/@vitest/runner/-/runner-4.0.18.tgz",
+      "integrity": "sha512-rpk9y12PGa22Jg6g5M3UVVnTS7+zycIGk9ZNGN+m6tZHKQb7jrP7/77WfZy13Y/EUDd52NDsLRQhYKtv7XfPQw==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@vitest/utils": "4.0.18",
+        "pathe": "^2.0.3"
+      },
+      "funding": {
+        "url": "https://opencollective.com/vitest"
+      }
+    },
+    "node_modules/@vitest/snapshot": {
+      "version": "4.0.18",
+      "resolved": "https://registry.npmjs.org/@vitest/snapshot/-/snapshot-4.0.18.tgz",
+      "integrity": "sha512-PCiV0rcl7jKQjbgYqjtakly6T1uwv/5BQ9SwBLekVg/EaYeQFPiXcgrC2Y7vDMA8dM1SUEAEV82kgSQIlXNMvA==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@vitest/pretty-format": "4.0.18",
+        "magic-string": "^0.30.21",
+        "pathe": "^2.0.3"
+      },
+      "funding": {
+        "url": "https://opencollective.com/vitest"
+      }
+    },
+    "node_modules/@vitest/spy": {
+      "version": "4.0.18",
+      "resolved": "https://registry.npmjs.org/@vitest/spy/-/spy-4.0.18.tgz",
+      "integrity": "sha512-cbQt3PTSD7P2OARdVW3qWER5EGq7PHlvE+QfzSC0lbwO+xnt7+XH06ZzFjFRgzUX//JmpxrCu92VdwvEPlWSNw==",
+      "dev": true,
+      "license": "MIT",
+      "funding": {
+        "url": "https://opencollective.com/vitest"
+      }
+    },
+    "node_modules/@vitest/utils": {
+      "version": "4.0.18",
+      "resolved": "https://registry.npmjs.org/@vitest/utils/-/utils-4.0.18.tgz",
+      "integrity": "sha512-msMRKLMVLWygpK3u2Hybgi4MNjcYJvwTb0Ru09+fOyCXIgT5raYP041DRRdiJiI3k/2U6SEbAETB3YtBrUkCFA==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@vitest/pretty-format": "4.0.18",
+        "tinyrainbow": "^3.0.3"
+      },
+      "funding": {
+        "url": "https://opencollective.com/vitest"
+      }
     },
     "node_modules/acorn": {
       "version": "8.16.0",
@@ -2178,6 +3566,16 @@
         "acorn": "^6.0.0 || ^7.0.0 || ^8.0.0"
       }
     },
+    "node_modules/agent-base": {
+      "version": "7.1.4",
+      "resolved": "https://registry.npmjs.org/agent-base/-/agent-base-7.1.4.tgz",
+      "integrity": "sha512-MnA+YT8fwfJPgBx3m60MNqakm30XOkyIoH1y6huTQvC0PwZG7ki8NacLBcrPbNoo8vEZy7Jpuk7+jMO+CUovTQ==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">= 14"
+      }
+    },
     "node_modules/ajv": {
       "version": "6.14.0",
       "resolved": "https://registry.npmjs.org/ajv/-/ajv-6.14.0.tgz",
@@ -2195,6 +3593,17 @@
         "url": "https://github.com/sponsors/epoberezkin"
       }
     },
+    "node_modules/ansi-regex": {
+      "version": "5.0.1",
+      "resolved": "https://registry.npmjs.org/ansi-regex/-/ansi-regex-5.0.1.tgz",
+      "integrity": "sha512-quJQXlTSUGL2LH9SUXo8VwsY4soanhgo6LNSm84E1LBcE8s3O0wpdiRzyR9z/ZZJMlMWv37qOOb9pdJlMUEKFQ==",
+      "dev": true,
+      "license": "MIT",
+      "peer": true,
+      "engines": {
+        "node": ">=8"
+      }
+    },
     "node_modules/ansi-styles": {
       "version": "4.3.0",
       "resolved": "https://registry.npmjs.org/ansi-styles/-/ansi-styles-4.3.0.tgz",
@@ -2388,6 +3797,16 @@
         "url": "https://github.com/sponsors/ljharb"
       }
     },
+    "node_modules/assertion-error": {
+      "version": "2.0.1",
+      "resolved": "https://registry.npmjs.org/assertion-error/-/assertion-error-2.0.1.tgz",
+      "integrity": "sha512-Izi8RQcffqCeNVgFigKli1ssklIbpHnCYc6AknXGYoB6grJqyeby7jv12JUQgmTAnIDnbck1uxksT4dzN3PWBA==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">=12"
+      }
+    },
     "node_modules/ast-types-flow": {
       "version": "0.0.8",
       "resolved": "https://registry.npmjs.org/ast-types-flow/-/ast-types-flow-0.0.8.tgz",
@@ -2460,6 +3879,16 @@
         "node": ">=6.0.0"
       }
     },
+    "node_modules/bidi-js": {
+      "version": "1.0.3",
+      "resolved": "https://registry.npmjs.org/bidi-js/-/bidi-js-1.0.3.tgz",
+      "integrity": "sha512-RKshQI1R3YQ+n9YJz2QQ147P66ELpa1FQEg20Dk8oW9t2KgLbpDLLp9aGZ7y8WHSshDknG0bknqGw5/tyCs5tw==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "require-from-string": "^2.0.2"
+      }
+    },
     "node_modules/brace-expansion": {
       "version": "1.1.12",
       "resolved": "https://registry.npmjs.org/brace-expansion/-/brace-expansion-1.1.12.tgz",
@@ -2598,6 +4027,16 @@
       ],
       "license": "CC-BY-4.0"
     },
+    "node_modules/chai": {
+      "version": "6.2.2",
+      "resolved": "https://registry.npmjs.org/chai/-/chai-6.2.2.tgz",
+      "integrity": "sha512-NUPRluOfOiTKBKvWPtSD4PhFvWCqOi0BGStNWs57X9js7XGTprSmFoz5F0tWhR4WPjNeR9jXqdC7/UpSJTnlRg==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">=18"
+      }
+    },
     "node_modules/chalk": {
       "version": "4.1.2",
       "resolved": "https://registry.npmjs.org/chalk/-/chalk-4.1.2.tgz",
@@ -2670,6 +4109,53 @@
         "node": ">= 8"
       }
     },
+    "node_modules/css-tree": {
+      "version": "3.1.0",
+      "resolved": "https://registry.npmjs.org/css-tree/-/css-tree-3.1.0.tgz",
+      "integrity": "sha512-0eW44TGN5SQXU1mWSkKwFstI/22X2bG1nYzZTYMAWjylYURhse752YgbE4Cx46AC+bAvI+/dYTPRk1LqSUnu6w==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "mdn-data": "2.12.2",
+        "source-map-js": "^1.0.1"
+      },
+      "engines": {
+        "node": "^10 || ^12.20.0 || ^14.13.0 || >=15.0.0"
+      }
+    },
+    "node_modules/css.escape": {
+      "version": "1.5.1",
+      "resolved": "https://registry.npmjs.org/css.escape/-/css.escape-1.5.1.tgz",
+      "integrity": "sha512-YUifsXXuknHlUsmlgyY0PKzgPOr7/FjCePfHNt0jxm83wHZi44VDMQ7/fGNkjY3/jV1MC+1CmZbaHzugyeRtpg==",
+      "dev": true,
+      "license": "MIT"
+    },
+    "node_modules/cssstyle": {
+      "version": "6.1.0",
+      "resolved": "https://registry.npmjs.org/cssstyle/-/cssstyle-6.1.0.tgz",
+      "integrity": "sha512-Ml4fP2UT2K3CUBQnVlbdV/8aFDdlY69E+YnwJM+3VUWl08S3J8c8aRuJqCkD9Py8DHZ7zNNvsfKl8psocHZEFg==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@asamuzakjp/css-color": "^5.0.0",
+        "@csstools/css-syntax-patches-for-csstree": "^1.0.28",
+        "css-tree": "^3.1.0",
+        "lru-cache": "^11.2.6"
+      },
+      "engines": {
+        "node": ">=20"
+      }
+    },
+    "node_modules/cssstyle/node_modules/lru-cache": {
+      "version": "11.2.6",
+      "resolved": "https://registry.npmjs.org/lru-cache/-/lru-cache-11.2.6.tgz",
+      "integrity": "sha512-ESL2CrkS/2wTPfuend7Zhkzo2u0daGJ/A2VucJOgQ/C48S/zB8MMeMHSGKYpXhIjbPxfuezITkaBH1wqv00DDQ==",
+      "dev": true,
+      "license": "BlueOak-1.0.0",
+      "engines": {
+        "node": "20 || >=22"
+      }
+    },
     "node_modules/csstype": {
       "version": "3.2.3",
       "resolved": "https://registry.npmjs.org/csstype/-/csstype-3.2.3.tgz",
@@ -2684,6 +4170,20 @@
       "dev": true,
       "license": "BSD-2-Clause"
     },
+    "node_modules/data-urls": {
+      "version": "7.0.0",
+      "resolved": "https://registry.npmjs.org/data-urls/-/data-urls-7.0.0.tgz",
+      "integrity": "sha512-23XHcCF+coGYevirZceTVD7NdJOqVn+49IHyxgszm+JIiHLoB2TkmPtsYkNWT1pvRSGkc35L6NHs0yHkN2SumA==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "whatwg-mimetype": "^5.0.0",
+        "whatwg-url": "^16.0.0"
+      },
+      "engines": {
+        "node": "^20.19.0 || ^22.12.0 || >=24.0.0"
+      }
+    },
     "node_modules/data-view-buffer": {
       "version": "1.0.2",
       "resolved": "https://registry.npmjs.org/data-view-buffer/-/data-view-buffer-1.0.2.tgz",
@@ -2756,6 +4256,13 @@
         }
       }
     },
+    "node_modules/decimal.js": {
+      "version": "10.6.0",
+      "resolved": "https://registry.npmjs.org/decimal.js/-/decimal.js-10.6.0.tgz",
+      "integrity": "sha512-YpgQiITW3JXGntzdUmyUR1V812Hn8T1YVXhCu+wO3OpS4eU9l4YdD3qjyiKdV6mvV29zapkMeD390UVEf2lkUg==",
+      "dev": true,
+      "license": "MIT"
+    },
     "node_modules/deep-is": {
       "version": "0.1.4",
       "resolved": "https://registry.npmjs.org/deep-is/-/deep-is-0.1.4.tgz",
@@ -2799,6 +4306,17 @@
         "url": "https://github.com/sponsors/ljharb"
       }
     },
+    "node_modules/dequal": {
+      "version": "2.0.3",
+      "resolved": "https://registry.npmjs.org/dequal/-/dequal-2.0.3.tgz",
+      "integrity": "sha512-0je+qPKHEMohvfRTCEo3CrPG6cAzAYgmzKyxRiYSSDkS6eGJdyVJm7WaYA5ECaAD9wLB2T4EEeymA5aFVcYXCA==",
+      "dev": true,
+      "license": "MIT",
+      "peer": true,
+      "engines": {
+        "node": ">=6"
+      }
+    },
     "node_modules/detect-libc": {
       "version": "2.1.2",
       "resolved": "https://registry.npmjs.org/detect-libc/-/detect-libc-2.1.2.tgz",
@@ -2822,6 +4340,14 @@
         "node": ">=0.10.0"
       }
     },
+    "node_modules/dom-accessibility-api": {
+      "version": "0.5.16",
+      "resolved": "https://registry.npmjs.org/dom-accessibility-api/-/dom-accessibility-api-0.5.16.tgz",
+      "integrity": "sha512-X7BJ2yElsnOJ30pZF4uIIDfBEVgF4XEBxL9Bxhy6dnrm5hkzqmsWHGTiHqRiITNhMyFLyAiWndIJP7Z1NTteDg==",
+      "dev": true,
+      "license": "MIT",
+      "peer": true
+    },
     "node_modules/dunder-proto": {
       "version": "1.0.1",
       "resolved": "https://registry.npmjs.org/dunder-proto/-/dunder-proto-1.0.1.tgz",
@@ -2865,6 +4391,19 @@
         "node": ">=10.13.0"
       }
     },
+    "node_modules/entities": {
+      "version": "6.0.1",
+      "resolved": "https://registry.npmjs.org/entities/-/entities-6.0.1.tgz",
+      "integrity": "sha512-aN97NXWF6AWBTahfVOIrB/NShkzi5H7F9r1s9mD3cDj4Ko5f2qhhVoYMibXF7GlLveb/D2ioWay8lxI97Ven3g==",
+      "dev": true,
+      "license": "BSD-2-Clause",
+      "engines": {
+        "node": ">=0.12"
+      },
+      "funding": {
+        "url": "https://github.com/fb55/entities?sponsor=1"
+      }
+    },
     "node_modules/es-abstract": {
       "version": "1.24.1",
       "resolved": "https://registry.npmjs.org/es-abstract/-/es-abstract-1.24.1.tgz",
@@ -2982,6 +4521,13 @@
         "node": ">= 0.4"
       }
     },
+    "node_modules/es-module-lexer": {
+      "version": "1.7.0",
+      "resolved": "https://registry.npmjs.org/es-module-lexer/-/es-module-lexer-1.7.0.tgz",
+      "integrity": "sha512-jEQoCwk8hyb2AZziIOLhDqpm5+2ww5uIE6lkO/6jcOCusfk6LhMHpXXfBLXTZ7Ydyt0j4VoUQv6uGNYbdW+kBA==",
+      "dev": true,
+      "license": "MIT"
+    },
     "node_modules/es-object-atoms": {
       "version": "1.1.1",
       "resolved": "https://registry.npmjs.org/es-object-atoms/-/es-object-atoms-1.1.1.tgz",
@@ -3042,6 +4588,48 @@
         "url": "https://github.com/sponsors/ljharb"
       }
     },
+    "node_modules/esbuild": {
+      "version": "0.27.3",
+      "resolved": "https://registry.npmjs.org/esbuild/-/esbuild-0.27.3.tgz",
+      "integrity": "sha512-8VwMnyGCONIs6cWue2IdpHxHnAjzxnw2Zr7MkVxB2vjmQ2ivqGFb4LEG3SMnv0Gb2F/G/2yA8zUaiL1gywDCCg==",
+      "dev": true,
+      "hasInstallScript": true,
+      "license": "MIT",
+      "bin": {
+        "esbuild": "bin/esbuild"
+      },
+      "engines": {
+        "node": ">=18"
+      },
+      "optionalDependencies": {
+        "@esbuild/aix-ppc64": "0.27.3",
+        "@esbuild/android-arm": "0.27.3",
+        "@esbuild/android-arm64": "0.27.3",
+        "@esbuild/android-x64": "0.27.3",
+        "@esbuild/darwin-arm64": "0.27.3",
+        "@esbuild/darwin-x64": "0.27.3",
+        "@esbuild/freebsd-arm64": "0.27.3",
+        "@esbuild/freebsd-x64": "0.27.3",
+        "@esbuild/linux-arm": "0.27.3",
+        "@esbuild/linux-arm64": "0.27.3",
+        "@esbuild/linux-ia32": "0.27.3",
+        "@esbuild/linux-loong64": "0.27.3",
+        "@esbuild/linux-mips64el": "0.27.3",
+        "@esbuild/linux-ppc64": "0.27.3",
+        "@esbuild/linux-riscv64": "0.27.3",
+        "@esbuild/linux-s390x": "0.27.3",
+        "@esbuild/linux-x64": "0.27.3",
+        "@esbuild/netbsd-arm64": "0.27.3",
+        "@esbuild/netbsd-x64": "0.27.3",
+        "@esbuild/openbsd-arm64": "0.27.3",
+        "@esbuild/openbsd-x64": "0.27.3",
+        "@esbuild/openharmony-arm64": "0.27.3",
+        "@esbuild/sunos-x64": "0.27.3",
+        "@esbuild/win32-arm64": "0.27.3",
+        "@esbuild/win32-ia32": "0.27.3",
+        "@esbuild/win32-x64": "0.27.3"
+      }
+    },
     "node_modules/escalade": {
       "version": "3.2.0",
       "resolved": "https://registry.npmjs.org/escalade/-/escalade-3.2.0.tgz",
@@ -3485,6 +5073,16 @@
         "node": ">=4.0"
       }
     },
+    "node_modules/estree-walker": {
+      "version": "3.0.3",
+      "resolved": "https://registry.npmjs.org/estree-walker/-/estree-walker-3.0.3.tgz",
+      "integrity": "sha512-7RUKfXgSMMkzt6ZuXmqapOurLGPPfgj6l9uRZ7lRGolvk0y2yocc35LdcxKC5PQZdn2DMqioAQ2NoWcrTKmm6g==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@types/estree": "^1.0.0"
+      }
+    },
     "node_modules/esutils": {
       "version": "2.0.3",
       "resolved": "https://registry.npmjs.org/esutils/-/esutils-2.0.3.tgz",
@@ -3495,6 +5093,16 @@
         "node": ">=0.10.0"
       }
     },
+    "node_modules/expect-type": {
+      "version": "1.3.0",
+      "resolved": "https://registry.npmjs.org/expect-type/-/expect-type-1.3.0.tgz",
+      "integrity": "sha512-knvyeauYhqjOYvQ66MznSMs83wmHrCycNEN6Ao+2AeYEfxUIkuiVxdEa1qlGEPK+We3n0THiDciYSsCcgW/DoA==",
+      "dev": true,
+      "license": "Apache-2.0",
+      "engines": {
+        "node": ">=12.0.0"
+      }
+    },
     "node_modules/fast-deep-equal": {
       "version": "3.1.3",
       "resolved": "https://registry.npmjs.org/fast-deep-equal/-/fast-deep-equal-3.1.3.tgz",
@@ -3663,6 +5271,21 @@
         }
       }
     },
+    "node_modules/fsevents": {
+      "version": "2.3.3",
+      "resolved": "https://registry.npmjs.org/fsevents/-/fsevents-2.3.3.tgz",
+      "integrity": "sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==",
+      "dev": true,
+      "hasInstallScript": true,
+      "license": "MIT",
+      "optional": true,
+      "os": [
+        "darwin"
+      ],
+      "engines": {
+        "node": "^8.16.0 || ^10.6.0 || >=11.0.0"
+      }
+    },
     "node_modules/function-bind": {
       "version": "1.1.2",
       "resolved": "https://registry.npmjs.org/function-bind/-/function-bind-1.1.2.tgz",
@@ -3968,6 +5591,47 @@
         "hermes-estree": "0.25.1"
       }
     },
+    "node_modules/html-encoding-sniffer": {
+      "version": "6.0.0",
+      "resolved": "https://registry.npmjs.org/html-encoding-sniffer/-/html-encoding-sniffer-6.0.0.tgz",
+      "integrity": "sha512-CV9TW3Y3f8/wT0BRFc1/KAVQ3TUHiXmaAb6VW9vtiMFf7SLoMd1PdAc4W3KFOFETBJUb90KatHqlsZMWV+R9Gg==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@exodus/bytes": "^1.6.0"
+      },
+      "engines": {
+        "node": "^20.19.0 || ^22.12.0 || >=24.0.0"
+      }
+    },
+    "node_modules/http-proxy-agent": {
+      "version": "7.0.2",
+      "resolved": "https://registry.npmjs.org/http-proxy-agent/-/http-proxy-agent-7.0.2.tgz",
+      "integrity": "sha512-T1gkAiYYDWYx3V5Bmyu7HcfcvL7mUrTWiM6yOfa3PIphViJ/gFPbvidQ+veqSOHci/PxBcDabeUNCzpOODJZig==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "agent-base": "^7.1.0",
+        "debug": "^4.3.4"
+      },
+      "engines": {
+        "node": ">= 14"
+      }
+    },
+    "node_modules/https-proxy-agent": {
+      "version": "7.0.6",
+      "resolved": "https://registry.npmjs.org/https-proxy-agent/-/https-proxy-agent-7.0.6.tgz",
+      "integrity": "sha512-vK9P5/iUfdl95AI+JVyUuIcVtd4ofvtrOr3HNtM2yxC9bnMbEdp3x01OhQNnjb8IJYi38VlTE3mBXwcfvywuSw==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "agent-base": "^7.1.2",
+        "debug": "4"
+      },
+      "engines": {
+        "node": ">= 14"
+      }
+    },
     "node_modules/ignore": {
       "version": "5.3.2",
       "resolved": "https://registry.npmjs.org/ignore/-/ignore-5.3.2.tgz",
@@ -4005,6 +5669,16 @@
         "node": ">=0.8.19"
       }
     },
+    "node_modules/indent-string": {
+      "version": "4.0.0",
+      "resolved": "https://registry.npmjs.org/indent-string/-/indent-string-4.0.0.tgz",
+      "integrity": "sha512-EdDDZu4A2OyIK7Lr/2zG+w5jmbuk1DVBnEwREQvBzspBJkCEbRa8GxU1lghYcaGJCnRWibjDXlq779X1/y5xwg==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">=8"
+      }
+    },
     "node_modules/internal-slot": {
       "version": "1.1.0",
       "resolved": "https://registry.npmjs.org/internal-slot/-/internal-slot-1.1.0.tgz",
@@ -4290,6 +5964,13 @@
         "url": "https://github.com/sponsors/ljharb"
       }
     },
+    "node_modules/is-potential-custom-element-name": {
+      "version": "1.0.1",
+      "resolved": "https://registry.npmjs.org/is-potential-custom-element-name/-/is-potential-custom-element-name-1.0.1.tgz",
+      "integrity": "sha512-bCYeRA2rVibKZd+s2625gGnGF/t7DSqDs4dP7CrLA1m7jKWz6pps0LpYLJN8Q64HtmPKJ1hrN3nzPNKFEKOUiQ==",
+      "dev": true,
+      "license": "MIT"
+    },
     "node_modules/is-regex": {
       "version": "1.2.1",
       "resolved": "https://registry.npmjs.org/is-regex/-/is-regex-1.2.1.tgz",
@@ -4497,6 +6178,47 @@
         "js-yaml": "bin/js-yaml.js"
       }
     },
+    "node_modules/jsdom": {
+      "version": "28.1.0",
+      "resolved": "https://registry.npmjs.org/jsdom/-/jsdom-28.1.0.tgz",
+      "integrity": "sha512-0+MoQNYyr2rBHqO1xilltfDjV9G7ymYGlAUazgcDLQaUf8JDHbuGwsxN6U9qWaElZ4w1B2r7yEGIL3GdeW3Rug==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@acemir/cssom": "^0.9.31",
+        "@asamuzakjp/dom-selector": "^6.8.1",
+        "@bramus/specificity": "^2.4.2",
+        "@exodus/bytes": "^1.11.0",
+        "cssstyle": "^6.0.1",
+        "data-urls": "^7.0.0",
+        "decimal.js": "^10.6.0",
+        "html-encoding-sniffer": "^6.0.0",
+        "http-proxy-agent": "^7.0.2",
+        "https-proxy-agent": "^7.0.6",
+        "is-potential-custom-element-name": "^1.0.1",
+        "parse5": "^8.0.0",
+        "saxes": "^6.0.0",
+        "symbol-tree": "^3.2.4",
+        "tough-cookie": "^6.0.0",
+        "undici": "^7.21.0",
+        "w3c-xmlserializer": "^5.0.0",
+        "webidl-conversions": "^8.0.1",
+        "whatwg-mimetype": "^5.0.0",
+        "whatwg-url": "^16.0.0",
+        "xml-name-validator": "^5.0.0"
+      },
+      "engines": {
+        "node": "^20.19.0 || ^22.12.0 || >=24.0.0"
+      },
+      "peerDependencies": {
+        "canvas": "^3.0.0"
+      },
+      "peerDependenciesMeta": {
+        "canvas": {
+          "optional": true
+        }
+      }
+    },
     "node_modules/jsesc": {
       "version": "3.1.0",
       "resolved": "https://registry.npmjs.org/jsesc/-/jsesc-3.1.0.tgz",
@@ -4920,6 +6642,17 @@
         "react": "^16.5.1 || ^17.0.0 || ^18.0.0 || ^19.0.0"
       }
     },
+    "node_modules/lz-string": {
+      "version": "1.5.0",
+      "resolved": "https://registry.npmjs.org/lz-string/-/lz-string-1.5.0.tgz",
+      "integrity": "sha512-h5bgJWpxJNswbU7qCrV0tIKQCaS3blPDrqKWx+QxzuzL1zGUzij9XCWLrSLsJPu5t+eWA/ycetzYAO5IOMcWAQ==",
+      "dev": true,
+      "license": "MIT",
+      "peer": true,
+      "bin": {
+        "lz-string": "bin/bin.js"
+      }
+    },
     "node_modules/magic-string": {
       "version": "0.30.21",
       "resolved": "https://registry.npmjs.org/magic-string/-/magic-string-0.30.21.tgz",
@@ -4940,6 +6673,13 @@
         "node": ">= 0.4"
       }
     },
+    "node_modules/mdn-data": {
+      "version": "2.12.2",
+      "resolved": "https://registry.npmjs.org/mdn-data/-/mdn-data-2.12.2.tgz",
+      "integrity": "sha512-IEn+pegP1aManZuckezWCO+XZQDplx1366JoVhTpMpBB1sPey/SbveZQUosKiKiGYjg1wH4pMlNgXbCiYgihQA==",
+      "dev": true,
+      "license": "CC0-1.0"
+    },
     "node_modules/merge2": {
       "version": "1.4.1",
       "resolved": "https://registry.npmjs.org/merge2/-/merge2-1.4.1.tgz",
@@ -4964,6 +6704,16 @@
         "node": ">=8.6"
       }
     },
+    "node_modules/min-indent": {
+      "version": "1.0.1",
+      "resolved": "https://registry.npmjs.org/min-indent/-/min-indent-1.0.1.tgz",
+      "integrity": "sha512-I9jwMn07Sy/IwOj3zVkVik2JTvgpaykDZEigL6Rx6N9LbMywwUSMtxET+7lVoDLLd3O3IXwJwvuuns8UB/HeAg==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">=4"
+      }
+    },
     "node_modules/mini-svg-data-uri": {
       "version": "1.4.4",
       "resolved": "https://registry.npmjs.org/mini-svg-data-uri/-/mini-svg-data-uri-1.4.4.tgz",
@@ -5290,6 +7040,17 @@
         "url": "https://github.com/sponsors/ljharb"
       }
     },
+    "node_modules/obug": {
+      "version": "2.1.1",
+      "resolved": "https://registry.npmjs.org/obug/-/obug-2.1.1.tgz",
+      "integrity": "sha512-uTqF9MuPraAQ+IsnPf366RG4cP9RtUi7MLO1N3KEc+wb0a6yKpeL0lmk2IB1jY5KHPAlTc6T/JRdC/YqxHNwkQ==",
+      "dev": true,
+      "funding": [
+        "https://github.com/sponsors/sxzz",
+        "https://opencollective.com/debug"
+      ],
+      "license": "MIT"
+    },
     "node_modules/optionator": {
       "version": "0.9.4",
       "resolved": "https://registry.npmjs.org/optionator/-/optionator-0.9.4.tgz",
@@ -5371,6 +7132,19 @@
         "node": ">=6"
       }
     },
+    "node_modules/parse5": {
+      "version": "8.0.0",
+      "resolved": "https://registry.npmjs.org/parse5/-/parse5-8.0.0.tgz",
+      "integrity": "sha512-9m4m5GSgXjL4AjumKzq1Fgfp3Z8rsvjRNbnkVwfu2ImRqE5D0LnY2QfDen18FSY9C573YU5XxSapdHZTZ2WolA==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "entities": "^6.0.0"
+      },
+      "funding": {
+        "url": "https://github.com/inikulin/parse5?sponsor=1"
+      }
+    },
     "node_modules/path-exists": {
       "version": "4.0.0",
       "resolved": "https://registry.npmjs.org/path-exists/-/path-exists-4.0.0.tgz",
@@ -5398,6 +7172,13 @@
       "dev": true,
       "license": "MIT"
     },
+    "node_modules/pathe": {
+      "version": "2.0.3",
+      "resolved": "https://registry.npmjs.org/pathe/-/pathe-2.0.3.tgz",
+      "integrity": "sha512-WUjGcAqP1gQacoQe+OBJsFA7Ld4DyXuUIjZ5cc75cLHvJ7dtNsTugphxIADwspS+AraAUePCKrSVtPLFj/F88w==",
+      "dev": true,
+      "license": "MIT"
+    },
     "node_modules/picocolors": {
       "version": "1.1.1",
       "resolved": "https://registry.npmjs.org/picocolors/-/picocolors-1.1.1.tgz",
@@ -5466,6 +7247,44 @@
         "node": ">= 0.8.0"
       }
     },
+    "node_modules/pretty-format": {
+      "version": "27.5.1",
+      "resolved": "https://registry.npmjs.org/pretty-format/-/pretty-format-27.5.1.tgz",
+      "integrity": "sha512-Qb1gy5OrP5+zDf2Bvnzdl3jsTf1qXVMazbvCoKhtKqVs4/YK4ozX4gKQJJVyNe+cajNPn0KoC0MC3FUmaHWEmQ==",
+      "dev": true,
+      "license": "MIT",
+      "peer": true,
+      "dependencies": {
+        "ansi-regex": "^5.0.1",
+        "ansi-styles": "^5.0.0",
+        "react-is": "^17.0.1"
+      },
+      "engines": {
+        "node": "^10.13.0 || ^12.13.0 || ^14.15.0 || >=15.0.0"
+      }
+    },
+    "node_modules/pretty-format/node_modules/ansi-styles": {
+      "version": "5.2.0",
+      "resolved": "https://registry.npmjs.org/ansi-styles/-/ansi-styles-5.2.0.tgz",
+      "integrity": "sha512-Cxwpt2SfTzTtXcfOlzGEee8O+c+MmUgGrNiBcXnuWxuFJHe6a5Hz7qwhwe5OgaSYI0IJvkLqWX1ASG+cJOkEiA==",
+      "dev": true,
+      "license": "MIT",
+      "peer": true,
+      "engines": {
+        "node": ">=10"
+      },
+      "funding": {
+        "url": "https://github.com/chalk/ansi-styles?sponsor=1"
+      }
+    },
+    "node_modules/pretty-format/node_modules/react-is": {
+      "version": "17.0.2",
+      "resolved": "https://registry.npmjs.org/react-is/-/react-is-17.0.2.tgz",
+      "integrity": "sha512-w2GsyukL62IJnlaff/nRegPQR94C/XXamvMWmSHRJ4y7Ts/4ocGRmTHvOs8PSE6pB3dWOrD/nueuU5sduBsQ4w==",
+      "dev": true,
+      "license": "MIT",
+      "peer": true
+    },
     "node_modules/prop-types": {
       "version": "15.8.1",
       "resolved": "https://registry.npmjs.org/prop-types/-/prop-types-15.8.1.tgz",
@@ -5537,6 +7356,30 @@
       "dev": true,
       "license": "MIT"
     },
+    "node_modules/react-refresh": {
+      "version": "0.18.0",
+      "resolved": "https://registry.npmjs.org/react-refresh/-/react-refresh-0.18.0.tgz",
+      "integrity": "sha512-QgT5//D3jfjJb6Gsjxv0Slpj23ip+HtOpnNgnb2S5zU3CB26G/IDPGoy4RJB42wzFE46DRsstbW6tKHoKbhAxw==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">=0.10.0"
+      }
+    },
+    "node_modules/redent": {
+      "version": "3.0.0",
+      "resolved": "https://registry.npmjs.org/redent/-/redent-3.0.0.tgz",
+      "integrity": "sha512-6tDA8g98We0zd0GvVeMT9arEOnTw9qM03L9cJXaCjrip1OO764RDBLBfrB4cwzNGDj5OA5ioymC9GkizgWJDUg==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "indent-string": "^4.0.0",
+        "strip-indent": "^3.0.0"
+      },
+      "engines": {
+        "node": ">=8"
+      }
+    },
     "node_modules/reflect.getprototypeof": {
       "version": "1.0.10",
       "resolved": "https://registry.npmjs.org/reflect.getprototypeof/-/reflect.getprototypeof-1.0.10.tgz",
@@ -5581,6 +7424,16 @@
         "url": "https://github.com/sponsors/ljharb"
       }
     },
+    "node_modules/require-from-string": {
+      "version": "2.0.2",
+      "resolved": "https://registry.npmjs.org/require-from-string/-/require-from-string-2.0.2.tgz",
+      "integrity": "sha512-Xf0nWe6RseziFMu+Ap9biiUbmplq6S9/p+7w7YXP/JBHhrUDDUhwa+vANyubuqfZWTveU//DYVGsDG7RKL/vEw==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">=0.10.0"
+      }
+    },
     "node_modules/resolve": {
       "version": "1.22.11",
       "resolved": "https://registry.npmjs.org/resolve/-/resolve-1.22.11.tgz",
@@ -5629,8 +7482,53 @@
       "dev": true,
       "license": "MIT",
       "engines": {
-        "iojs": ">=1.0.0",
-        "node": ">=0.10.0"
+        "iojs": ">=1.0.0",
+        "node": ">=0.10.0"
+      }
+    },
+    "node_modules/rollup": {
+      "version": "4.59.0",
+      "resolved": "https://registry.npmjs.org/rollup/-/rollup-4.59.0.tgz",
+      "integrity": "sha512-2oMpl67a3zCH9H79LeMcbDhXW/UmWG/y2zuqnF2jQq5uq9TbM9TVyXvA4+t+ne2IIkBdrLpAaRQAvo7YI/Yyeg==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@types/estree": "1.0.8"
+      },
+      "bin": {
+        "rollup": "dist/bin/rollup"
+      },
+      "engines": {
+        "node": ">=18.0.0",
+        "npm": ">=8.0.0"
+      },
+      "optionalDependencies": {
+        "@rollup/rollup-android-arm-eabi": "4.59.0",
+        "@rollup/rollup-android-arm64": "4.59.0",
+        "@rollup/rollup-darwin-arm64": "4.59.0",
+        "@rollup/rollup-darwin-x64": "4.59.0",
+        "@rollup/rollup-freebsd-arm64": "4.59.0",
+        "@rollup/rollup-freebsd-x64": "4.59.0",
+        "@rollup/rollup-linux-arm-gnueabihf": "4.59.0",
+        "@rollup/rollup-linux-arm-musleabihf": "4.59.0",
+        "@rollup/rollup-linux-arm64-gnu": "4.59.0",
+        "@rollup/rollup-linux-arm64-musl": "4.59.0",
+        "@rollup/rollup-linux-loong64-gnu": "4.59.0",
+        "@rollup/rollup-linux-loong64-musl": "4.59.0",
+        "@rollup/rollup-linux-ppc64-gnu": "4.59.0",
+        "@rollup/rollup-linux-ppc64-musl": "4.59.0",
+        "@rollup/rollup-linux-riscv64-gnu": "4.59.0",
+        "@rollup/rollup-linux-riscv64-musl": "4.59.0",
+        "@rollup/rollup-linux-s390x-gnu": "4.59.0",
+        "@rollup/rollup-linux-x64-gnu": "4.59.0",
+        "@rollup/rollup-linux-x64-musl": "4.59.0",
+        "@rollup/rollup-openbsd-x64": "4.59.0",
+        "@rollup/rollup-openharmony-arm64": "4.59.0",
+        "@rollup/rollup-win32-arm64-msvc": "4.59.0",
+        "@rollup/rollup-win32-ia32-msvc": "4.59.0",
+        "@rollup/rollup-win32-x64-gnu": "4.59.0",
+        "@rollup/rollup-win32-x64-msvc": "4.59.0",
+        "fsevents": "~2.3.2"
       }
     },
     "node_modules/run-parallel": {
@@ -5712,6 +7610,19 @@
         "url": "https://github.com/sponsors/ljharb"
       }
     },
+    "node_modules/saxes": {
+      "version": "6.0.0",
+      "resolved": "https://registry.npmjs.org/saxes/-/saxes-6.0.0.tgz",
+      "integrity": "sha512-xAg7SOnEhrm5zI3puOOKyy1OMcMlIJZYNJY7xLBwSze0UjhPLnWfj2GF2EpT0jmzaJKIWKHLsaSSajf35bcYnA==",
+      "dev": true,
+      "license": "ISC",
+      "dependencies": {
+        "xmlchars": "^2.2.0"
+      },
+      "engines": {
+        "node": ">=v12.22.7"
+      }
+    },
     "node_modules/scheduler": {
       "version": "0.27.0",
       "resolved": "https://registry.npmjs.org/scheduler/-/scheduler-0.27.0.tgz",
@@ -5934,6 +7845,13 @@
         "url": "https://github.com/sponsors/ljharb"
       }
     },
+    "node_modules/siginfo": {
+      "version": "2.0.0",
+      "resolved": "https://registry.npmjs.org/siginfo/-/siginfo-2.0.0.tgz",
+      "integrity": "sha512-ybx0WO1/8bSBLEWXZvEd7gMW3Sn3JFlW3TvX1nREbDLRNQNaeNN8WK0meBwPdAaOI7TtRRRJn/Es1zhrrCHu7g==",
+      "dev": true,
+      "license": "ISC"
+    },
     "node_modules/source-map-js": {
       "version": "1.2.1",
       "resolved": "https://registry.npmjs.org/source-map-js/-/source-map-js-1.2.1.tgz",
@@ -5950,6 +7868,20 @@
       "dev": true,
       "license": "MIT"
     },
+    "node_modules/stackback": {
+      "version": "0.0.2",
+      "resolved": "https://registry.npmjs.org/stackback/-/stackback-0.0.2.tgz",
+      "integrity": "sha512-1XMJE5fQo1jGH6Y/7ebnwPOBEkIEnT4QF32d5R1+VXdXveM0IBMJt8zfaxX1P3QhVwrYe+576+jkANtSS2mBbw==",
+      "dev": true,
+      "license": "MIT"
+    },
+    "node_modules/std-env": {
+      "version": "3.10.0",
+      "resolved": "https://registry.npmjs.org/std-env/-/std-env-3.10.0.tgz",
+      "integrity": "sha512-5GS12FdOZNliM5mAOxFRg7Ir0pWz8MdpYm6AY6VPkGpbA7ZzmbzNcBJQ0GPvvyWgcY7QAhCgf9Uy89I03faLkg==",
+      "dev": true,
+      "license": "MIT"
+    },
     "node_modules/stop-iteration-iterator": {
       "version": "1.1.0",
       "resolved": "https://registry.npmjs.org/stop-iteration-iterator/-/stop-iteration-iterator-1.1.0.tgz",
@@ -6087,6 +8019,19 @@
         "node": ">=4"
       }
     },
+    "node_modules/strip-indent": {
+      "version": "3.0.0",
+      "resolved": "https://registry.npmjs.org/strip-indent/-/strip-indent-3.0.0.tgz",
+      "integrity": "sha512-laJTa3Jb+VQpaC6DseHhF7dXVqHTfJPCRDaEbid/drOhgitgYku/letMUqOXFoWV0zIIUbjpdH2t+tYj4bQMRQ==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "min-indent": "^1.0.0"
+      },
+      "engines": {
+        "node": ">=8"
+      }
+    },
     "node_modules/strip-json-comments": {
       "version": "3.1.1",
       "resolved": "https://registry.npmjs.org/strip-json-comments/-/strip-json-comments-3.1.1.tgz",
@@ -6149,6 +8094,13 @@
         "url": "https://github.com/sponsors/ljharb"
       }
     },
+    "node_modules/symbol-tree": {
+      "version": "3.2.4",
+      "resolved": "https://registry.npmjs.org/symbol-tree/-/symbol-tree-3.2.4.tgz",
+      "integrity": "sha512-9QNk5KwDF+Bvz+PyObkmSYjI5ksVUYtjW7AU22r2NKcfLJcXp96hkDWU3+XndOsUb+AQ9QhfzfCT2O+CNWT5Tw==",
+      "dev": true,
+      "license": "MIT"
+    },
     "node_modules/tailwindcss": {
       "version": "4.2.1",
       "resolved": "https://registry.npmjs.org/tailwindcss/-/tailwindcss-4.2.1.tgz",
@@ -6170,6 +8122,23 @@
         "url": "https://opencollective.com/webpack"
       }
     },
+    "node_modules/tinybench": {
+      "version": "2.9.0",
+      "resolved": "https://registry.npmjs.org/tinybench/-/tinybench-2.9.0.tgz",
+      "integrity": "sha512-0+DUvqWMValLmha6lr4kD8iAMK1HzV0/aKnCtWb9v9641TnP/MFb7Pc2bxoxQjTXAErryXVgUOfv2YqNllqGeg==",
+      "dev": true,
+      "license": "MIT"
+    },
+    "node_modules/tinyexec": {
+      "version": "1.0.2",
+      "resolved": "https://registry.npmjs.org/tinyexec/-/tinyexec-1.0.2.tgz",
+      "integrity": "sha512-W/KYk+NFhkmsYpuHq5JykngiOCnxeVL8v8dFnqxSD8qEEdRfXk1SDM6JzNqcERbcGYj9tMrDQBYV9cjgnunFIg==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">=18"
+      }
+    },
     "node_modules/tinyglobby": {
       "version": "0.2.15",
       "resolved": "https://registry.npmjs.org/tinyglobby/-/tinyglobby-0.2.15.tgz",
@@ -6218,6 +8187,36 @@
         "url": "https://github.com/sponsors/jonschlinkert"
       }
     },
+    "node_modules/tinyrainbow": {
+      "version": "3.0.3",
+      "resolved": "https://registry.npmjs.org/tinyrainbow/-/tinyrainbow-3.0.3.tgz",
+      "integrity": "sha512-PSkbLUoxOFRzJYjjxHJt9xro7D+iilgMX/C9lawzVuYiIdcihh9DXmVibBe8lmcFrRi/VzlPjBxbN7rH24q8/Q==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">=14.0.0"
+      }
+    },
+    "node_modules/tldts": {
+      "version": "7.0.23",
+      "resolved": "https://registry.npmjs.org/tldts/-/tldts-7.0.23.tgz",
+      "integrity": "sha512-ASdhgQIBSay0R/eXggAkQ53G4nTJqTXqC2kbaBbdDwM7SkjyZyO0OaaN1/FH7U/yCeqOHDwFO5j8+Os/IS1dXw==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "tldts-core": "^7.0.23"
+      },
+      "bin": {
+        "tldts": "bin/cli.js"
+      }
+    },
+    "node_modules/tldts-core": {
+      "version": "7.0.23",
+      "resolved": "https://registry.npmjs.org/tldts-core/-/tldts-core-7.0.23.tgz",
+      "integrity": "sha512-0g9vrtDQLrNIiCj22HSe9d4mLVG3g5ph5DZ8zCKBr4OtrspmNB6ss7hVyzArAeE88ceZocIEGkyW1Ime7fxPtQ==",
+      "dev": true,
+      "license": "MIT"
+    },
     "node_modules/to-regex-range": {
       "version": "5.0.1",
       "resolved": "https://registry.npmjs.org/to-regex-range/-/to-regex-range-5.0.1.tgz",
@@ -6231,6 +8230,32 @@
         "node": ">=8.0"
       }
     },
+    "node_modules/tough-cookie": {
+      "version": "6.0.0",
+      "resolved": "https://registry.npmjs.org/tough-cookie/-/tough-cookie-6.0.0.tgz",
+      "integrity": "sha512-kXuRi1mtaKMrsLUxz3sQYvVl37B0Ns6MzfrtV5DvJceE9bPyspOqk9xxv7XbZWcfLWbFmm997vl83qUWVJA64w==",
+      "dev": true,
+      "license": "BSD-3-Clause",
+      "dependencies": {
+        "tldts": "^7.0.5"
+      },
+      "engines": {
+        "node": ">=16"
+      }
+    },
+    "node_modules/tr46": {
+      "version": "6.0.0",
+      "resolved": "https://registry.npmjs.org/tr46/-/tr46-6.0.0.tgz",
+      "integrity": "sha512-bLVMLPtstlZ4iMQHpFHTR7GAGj2jxi8Dg0s2h2MafAE4uSWF98FC/3MomU51iQAMf8/qDUbKWf5GxuvvVcXEhw==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "punycode": "^2.3.1"
+      },
+      "engines": {
+        "node": ">=20"
+      }
+    },
     "node_modules/ts-api-utils": {
       "version": "2.4.0",
       "resolved": "https://registry.npmjs.org/ts-api-utils/-/ts-api-utils-2.4.0.tgz",
@@ -6424,6 +8449,16 @@
         "url": "https://github.com/sponsors/ljharb"
       }
     },
+    "node_modules/undici": {
+      "version": "7.22.0",
+      "resolved": "https://registry.npmjs.org/undici/-/undici-7.22.0.tgz",
+      "integrity": "sha512-RqslV2Us5BrllB+JeiZnK4peryVTndy9Dnqq62S3yYRRTj0tFQCwEniUy2167skdGOy3vqRzEvl1Dm4sV2ReDg==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">=20.18.1"
+      }
+    },
     "node_modules/undici-types": {
       "version": "6.21.0",
       "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-6.21.0.tgz",
@@ -6507,6 +8542,251 @@
         "punycode": "^2.1.0"
       }
     },
+    "node_modules/vite": {
+      "version": "7.3.1",
+      "resolved": "https://registry.npmjs.org/vite/-/vite-7.3.1.tgz",
+      "integrity": "sha512-w+N7Hifpc3gRjZ63vYBXA56dvvRlNWRczTdmCBBa+CotUzAPf5b7YMdMR/8CQoeYE5LX3W4wj6RYTgonm1b9DA==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "esbuild": "^0.27.0",
+        "fdir": "^6.5.0",
+        "picomatch": "^4.0.3",
+        "postcss": "^8.5.6",
+        "rollup": "^4.43.0",
+        "tinyglobby": "^0.2.15"
+      },
+      "bin": {
+        "vite": "bin/vite.js"
+      },
+      "engines": {
+        "node": "^20.19.0 || >=22.12.0"
+      },
+      "funding": {
+        "url": "https://github.com/vitejs/vite?sponsor=1"
+      },
+      "optionalDependencies": {
+        "fsevents": "~2.3.3"
+      },
+      "peerDependencies": {
+        "@types/node": "^20.19.0 || >=22.12.0",
+        "jiti": ">=1.21.0",
+        "less": "^4.0.0",
+        "lightningcss": "^1.21.0",
+        "sass": "^1.70.0",
+        "sass-embedded": "^1.70.0",
+        "stylus": ">=0.54.8",
+        "sugarss": "^5.0.0",
+        "terser": "^5.16.0",
+        "tsx": "^4.8.1",
+        "yaml": "^2.4.2"
+      },
+      "peerDependenciesMeta": {
+        "@types/node": {
+          "optional": true
+        },
+        "jiti": {
+          "optional": true
+        },
+        "less": {
+          "optional": true
+        },
+        "lightningcss": {
+          "optional": true
+        },
+        "sass": {
+          "optional": true
+        },
+        "sass-embedded": {
+          "optional": true
+        },
+        "stylus": {
+          "optional": true
+        },
+        "sugarss": {
+          "optional": true
+        },
+        "terser": {
+          "optional": true
+        },
+        "tsx": {
+          "optional": true
+        },
+        "yaml": {
+          "optional": true
+        }
+      }
+    },
+    "node_modules/vite/node_modules/fdir": {
+      "version": "6.5.0",
+      "resolved": "https://registry.npmjs.org/fdir/-/fdir-6.5.0.tgz",
+      "integrity": "sha512-tIbYtZbucOs0BRGqPJkshJUYdL+SDH7dVM8gjy+ERp3WAUjLEFJE+02kanyHtwjWOnwrKYBiwAmM0p4kLJAnXg==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">=12.0.0"
+      },
+      "peerDependencies": {
+        "picomatch": "^3 || ^4"
+      },
+      "peerDependenciesMeta": {
+        "picomatch": {
+          "optional": true
+        }
+      }
+    },
+    "node_modules/vite/node_modules/picomatch": {
+      "version": "4.0.3",
+      "resolved": "https://registry.npmjs.org/picomatch/-/picomatch-4.0.3.tgz",
+      "integrity": "sha512-5gTmgEY/sqK6gFXLIsQNH19lWb4ebPDLA4SdLP7dsWkIXHWlG66oPuVvXSGFPppYZz8ZDZq0dYYrbHfBCVUb1Q==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">=12"
+      },
+      "funding": {
+        "url": "https://github.com/sponsors/jonschlinkert"
+      }
+    },
+    "node_modules/vitest": {
+      "version": "4.0.18",
+      "resolved": "https://registry.npmjs.org/vitest/-/vitest-4.0.18.tgz",
+      "integrity": "sha512-hOQuK7h0FGKgBAas7v0mSAsnvrIgAvWmRFjmzpJ7SwFHH3g1k2u37JtYwOwmEKhK6ZO3v9ggDBBm0La1LCK4uQ==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@vitest/expect": "4.0.18",
+        "@vitest/mocker": "4.0.18",
+        "@vitest/pretty-format": "4.0.18",
+        "@vitest/runner": "4.0.18",
+        "@vitest/snapshot": "4.0.18",
+        "@vitest/spy": "4.0.18",
+        "@vitest/utils": "4.0.18",
+        "es-module-lexer": "^1.7.0",
+        "expect-type": "^1.2.2",
+        "magic-string": "^0.30.21",
+        "obug": "^2.1.1",
+        "pathe": "^2.0.3",
+        "picomatch": "^4.0.3",
+        "std-env": "^3.10.0",
+        "tinybench": "^2.9.0",
+        "tinyexec": "^1.0.2",
+        "tinyglobby": "^0.2.15",
+        "tinyrainbow": "^3.0.3",
+        "vite": "^6.0.0 || ^7.0.0",
+        "why-is-node-running": "^2.3.0"
+      },
+      "bin": {
+        "vitest": "vitest.mjs"
+      },
+      "engines": {
+        "node": "^20.0.0 || ^22.0.0 || >=24.0.0"
+      },
+      "funding": {
+        "url": "https://opencollective.com/vitest"
+      },
+      "peerDependencies": {
+        "@edge-runtime/vm": "*",
+        "@opentelemetry/api": "^1.9.0",
+        "@types/node": "^20.0.0 || ^22.0.0 || >=24.0.0",
+        "@vitest/browser-playwright": "4.0.18",
+        "@vitest/browser-preview": "4.0.18",
+        "@vitest/browser-webdriverio": "4.0.18",
+        "@vitest/ui": "4.0.18",
+        "happy-dom": "*",
+        "jsdom": "*"
+      },
+      "peerDependenciesMeta": {
+        "@edge-runtime/vm": {
+          "optional": true
+        },
+        "@opentelemetry/api": {
+          "optional": true
+        },
+        "@types/node": {
+          "optional": true
+        },
+        "@vitest/browser-playwright": {
+          "optional": true
+        },
+        "@vitest/browser-preview": {
+          "optional": true
+        },
+        "@vitest/browser-webdriverio": {
+          "optional": true
+        },
+        "@vitest/ui": {
+          "optional": true
+        },
+        "happy-dom": {
+          "optional": true
+        },
+        "jsdom": {
+          "optional": true
+        }
+      }
+    },
+    "node_modules/vitest/node_modules/picomatch": {
+      "version": "4.0.3",
+      "resolved": "https://registry.npmjs.org/picomatch/-/picomatch-4.0.3.tgz",
+      "integrity": "sha512-5gTmgEY/sqK6gFXLIsQNH19lWb4ebPDLA4SdLP7dsWkIXHWlG66oPuVvXSGFPppYZz8ZDZq0dYYrbHfBCVUb1Q==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">=12"
+      },
+      "funding": {
+        "url": "https://github.com/sponsors/jonschlinkert"
+      }
+    },
+    "node_modules/w3c-xmlserializer": {
+      "version": "5.0.0",
+      "resolved": "https://registry.npmjs.org/w3c-xmlserializer/-/w3c-xmlserializer-5.0.0.tgz",
+      "integrity": "sha512-o8qghlI8NZHU1lLPrpi2+Uq7abh4GGPpYANlalzWxyWteJOCsr/P+oPBA49TOLu5FTZO4d3F9MnWJfiMo4BkmA==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "xml-name-validator": "^5.0.0"
+      },
+      "engines": {
+        "node": ">=18"
+      }
+    },
+    "node_modules/webidl-conversions": {
+      "version": "8.0.1",
+      "resolved": "https://registry.npmjs.org/webidl-conversions/-/webidl-conversions-8.0.1.tgz",
+      "integrity": "sha512-BMhLD/Sw+GbJC21C/UgyaZX41nPt8bUTg+jWyDeg7e7YN4xOM05YPSIXceACnXVtqyEw/LMClUQMtMZ+PGGpqQ==",
+      "dev": true,
+      "license": "BSD-2-Clause",
+      "engines": {
+        "node": ">=20"
+      }
+    },
+    "node_modules/whatwg-mimetype": {
+      "version": "5.0.0",
+      "resolved": "https://registry.npmjs.org/whatwg-mimetype/-/whatwg-mimetype-5.0.0.tgz",
+      "integrity": "sha512-sXcNcHOC51uPGF0P/D4NVtrkjSU2fNsm9iog4ZvZJsL3rjoDAzXZhkm2MWt1y+PUdggKAYVoMAIYcs78wJ51Cw==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">=20"
+      }
+    },
+    "node_modules/whatwg-url": {
+      "version": "16.0.1",
+      "resolved": "https://registry.npmjs.org/whatwg-url/-/whatwg-url-16.0.1.tgz",
+      "integrity": "sha512-1to4zXBxmXHV3IiSSEInrreIlu02vUOvrhxJJH5vcxYTBDAx51cqZiKdyTxlecdKNSjj8EcxGBxNf6Vg+945gw==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@exodus/bytes": "^1.11.0",
+        "tr46": "^6.0.0",
+        "webidl-conversions": "^8.0.1"
+      },
+      "engines": {
+        "node": "^20.19.0 || ^22.12.0 || >=24.0.0"
+      }
+    },
     "node_modules/which": {
       "version": "2.0.2",
       "resolved": "https://registry.npmjs.org/which/-/which-2.0.2.tgz",
@@ -6612,6 +8892,23 @@
         "url": "https://github.com/sponsors/ljharb"
       }
     },
+    "node_modules/why-is-node-running": {
+      "version": "2.3.0",
+      "resolved": "https://registry.npmjs.org/why-is-node-running/-/why-is-node-running-2.3.0.tgz",
+      "integrity": "sha512-hUrmaWBdVDcxvYqnyh09zunKzROWjbZTiNy8dBEjkS7ehEDQibXJ7XvlmtbwuTclUiIyN+CyXQD4Vmko8fNm8w==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "siginfo": "^2.0.0",
+        "stackback": "0.0.2"
+      },
+      "bin": {
+        "why-is-node-running": "cli.js"
+      },
+      "engines": {
+        "node": ">=8"
+      }
+    },
     "node_modules/word-wrap": {
       "version": "1.2.5",
       "resolved": "https://registry.npmjs.org/word-wrap/-/word-wrap-1.2.5.tgz",
@@ -6622,6 +8919,23 @@
         "node": ">=0.10.0"
       }
     },
+    "node_modules/xml-name-validator": {
+      "version": "5.0.0",
+      "resolved": "https://registry.npmjs.org/xml-name-validator/-/xml-name-validator-5.0.0.tgz",
+      "integrity": "sha512-EvGK8EJ3DhaHfbRlETOWAS5pO9MZITeauHKJyb8wyajUfQUenkIg2MvLDTZ4T/TgIcm3HU0TFBgWWboAZ30UHg==",
+      "dev": true,
+      "license": "Apache-2.0",
+      "engines": {
+        "node": ">=18"
+      }
+    },
+    "node_modules/xmlchars": {
+      "version": "2.2.0",
+      "resolved": "https://registry.npmjs.org/xmlchars/-/xmlchars-2.2.0.tgz",
+      "integrity": "sha512-JZnDKK8B0RCDw84FNdDAIpZK+JuJw+s7Lz8nksI7SIuU3UXJJslUthsi+uWBUYOwPFwW7W7PRLRfUKpxjtjFCw==",
+      "dev": true,
+      "license": "MIT"
+    },
     "node_modules/yallist": {
       "version": "3.1.1",
       "resolved": "https://registry.npmjs.org/yallist/-/yallist-3.1.1.tgz",
diff --git a/package.json b/package.json
index ee1ce0b..5881459 100644
--- a/package.json
+++ b/package.json
@@ -6,7 +6,8 @@
     "dev": "next dev",
     "build": "next build",
     "start": "next start",
-    "lint": "eslint"
+    "lint": "eslint",
+    "test": "vitest run"
   },
   "dependencies": {
     "framer-motion": "^12.34.3",
@@ -18,12 +19,17 @@
   "devDependencies": {
     "@tailwindcss/forms": "^0.5.11",
     "@tailwindcss/postcss": "^4",
+    "@testing-library/jest-dom": "^6.9.1",
+    "@testing-library/react": "^16.3.2",
     "@types/node": "^20",
     "@types/react": "^19",
     "@types/react-dom": "^19",
+    "@vitejs/plugin-react": "^5.1.4",
     "eslint": "^9",
     "eslint-config-next": "16.1.6",
+    "jsdom": "^28.1.0",
     "tailwindcss": "^4",
-    "typescript": "^5"
+    "typescript": "^5",
+    "vitest": "^4.0.18"
   }
 }
diff --git a/vitest.config.ts b/vitest.config.ts
new file mode 100644
index 0000000..4f78244
--- /dev/null
+++ b/vitest.config.ts
@@ -0,0 +1,18 @@
+import { defineConfig } from "vitest/config";
+import react from "@vitejs/plugin-react";
+import path from "path";
+
+export default defineConfig({
+  plugins: [react()],
+  resolve: {
+    alias: {
+      "@": path.resolve(__dirname, "./"),
+    },
+  },
+  test: {
+    environment: "jsdom",
+    globals: true,
+    setupFiles: ["./__tests__/setup.ts"],
+    include: ["__tests__/**/*.{test,spec}.{ts,tsx}"],
+  },
+});
