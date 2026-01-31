---
name: "Awesomeness UI HTML Instructions"
description: "Instructions for generating HTML using the Awesomeness UI utility-first CSS system."
applyTo: "awesomeness-ui/components/**/*.js"
---
# HTML Generation with Custom Utility Classes

You are generating HTML using a custom utility-first CSS system (similar to Tailwind CSS). The system provides classes for layout, spacing, positioning, text, alignment, and responsive design.

---

## 📦 General Guidelines

- **Class Structure:** Use utility classes directly in `class` attributes. Do **not** write raw CSS or `<style>` tags.
- **Responsiveness:** Wrap responsive styles in containers with `.app-size-{size}`:
  - `xl` = extra-large
  - `d` = desktop
  - `t` = tablet
  - `p` = phone

---

## 🧱 Utility Class Reference (Quick)

### ✅ Grid & Layout
- `.grid`, `.grid-{n}`, `.grid-rows-{n}`
- `.span-{n}`, `.row-span-{n}`, `.start-{n}`, `.end-{n}`
- `.gap-{px}`, `.gap-x-{px}`, `.gap-y-{px}`

### ✅ Alignment
- Justify: `.justify-center`, `.justify-between`, etc.
- Align: `.align-start`, `.align-stretch`, etc.
- Self: `.justify-self-center`, `.grid.center`, etc.

### ✅ Spacing
- Margin: `.m{px}`, `.mt{px}`, `.mlr{px}`, etc.
- Padding: `.p{px}`, `.ptb{px}`, `.pr{px}`, etc.

### ✅ Sizing
- `.width{percent}`, `.height{percent}`
- `.width-{px}`, `.max-height-{px}`, `.span{1-12}`

### ✅ Text
- Align: `.text-center`, `.text-right`
- Weight: `.text-300`, `.text-900`
- Size: `.text-xs`, `.text-xl`, `.text-xxxl`

### ✅ Position
- `.absolute`, `.relative`, `.sticky`, `.fl`, `.fr`

### ✅ Responsive Variants
All classes may have a `-{size}` variant scoped under `.app-size-{size}` container:
```html
<div class="app-size-p">
  <div class="text-center-p p20-p">Mobile Friendly</div>
</div>
```


---
## 🎨 Dynamic Color Utilities

This system auto-generates utility classes for applying color styles using predefined CSS variables (`--colorName-shade`), supporting background, border, and text colors.

### ✅ Class Patterns

Each utility follows this pattern:

```
.{prefix}-{color}-{shade}
.{prefix}-{color}-{shade}--hover:hover
```

Where:
- `{prefix}` = `bg`, `border`, or `text`
- `{color}` = one of the supported color names (see below)
- `{shade}` = one of the supported shades (e.g., `100`, `500`, `950`)

### ✨ Examples

```html
<div class="bg-blue-500 text-white border-blue-700">Primary</div>
<div class="bg-gray-100--hover hoverable-box">Hover Me</div>
```

### 🎨 Available Color Names

```
red, orange, amber, yellow, lime, green, emerald, teal, cyan, sky,
blue, indigo, violet, purple, fuchsia, pink, rose,
slate, gray, zinc, neutral, stone
```

### 🌗 Shades

```
50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950
```

### 🖤 Black and White

```html
<div class="bg-black text-white border-white">Dark Card</div>
```

### 🧠 Notes

- All colors use CSS variables, such as `--blue-500`, so you can theme or dark-mode easily.
- `--hover` suffix variants enable hover state styling directly via class names.


### Example Prompt

Generate HTML for a responsive product grid. It should:

Display as 4 cards per row on desktop, 2 per row on tablet, and 1 per row on phone

Each card includes:

Product image

Title (bold, large text)

Description (smaller gray text)

Price (medium weight, prominent color)

“Add to Cart” button with hover effect

Apply appropriate spacing, alignment, and sizing

### Example Response 

```html
<div class="grid grid-1-p grid-2-t grid-4-d gap-20 p40">
  <!-- Card -->
  <div class="bg-white border-gray-200 p20">
    <img src="https://via.placeholder.com/300x200" class="width-100 mb10" alt="Product">
    <div class="text-xl text-900 mb5">Product Title</div>
    <div class="text-sm text-gray-600 mb10">Short product description goes here.</div>
    <div class="text-md text-blue-700 text-500 mb15">$29.99</div>
    <button class="bg-blue-500 text-white p10 bg-blue-600--hover">Add to Cart</button>
  </div>

  <!-- Repeat as needed -->
  <div class="bg-white border-gray-200 p20">
    <img src="https://via.placeholder.com/300x200" class="width-100 mb10" alt="Product">
    <div class="text-xl text-900 mb5">Another Product</div>
    <div class="text-sm text-gray-600 mb10">Another short description.</div>
    <div class="text-md text-blue-700 text-500 mb15">$39.99</div>
    <button class="bg-blue-500 text-white p10 bg-blue-600--hover">Add to Cart</button>
  </div>

  <!-- Add more cards as needed -->
</div>
```