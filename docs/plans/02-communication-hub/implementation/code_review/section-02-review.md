# Code Review: Section 02 - Signup Form Component

## HIGH SEVERITY

### 1. TCPA consent text uses `&amp;` instead of `&`
In JSX, `&amp;` renders as literal `&amp;` text, not `&`. The TCPA text will display incorrectly. Fix: use `&` directly.

### 2. Communication preference validation is unreachable
`commPref` is initialized to `"email"`, so `!commPref` is always false. The validation check is dead code.

### 3. Errors not cleared on subsequent valid input
Validation errors persist until re-submit. No per-field clearing on change.

## MEDIUM SEVERITY

### 4. Level options keyed by internal value, not display label
Sports use display labels as keys into MAILCHIMP_GROUPS options, but levels use short internal values (`"youth"`, `"middle"`, `"high"`). Inconsistency for Mailchimp setup.

### 5. Hidden COMM_PREF field missing when phone is empty
When phone is empty, no COMM_PREF field is submitted. Mailchimp gets no communication preference. Should fall back to "email".

### 6. Progressive enhancement undermined by controlled inputs
Controlled React inputs (`value={...}`, `checked={...}`) don't work without JavaScript, contradicting the plan's progressive enhancement claim.

## LOW SEVERITY

### 7. No `aria-invalid` on inputs with errors
### 8. `commPref-error` not associated with radio inputs via aria-describedby
### 9. Extra `<h3>` for "Sports Interests" not in plan
### 10. Data observation about Spring Tennis (boys only)
