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

### 🧱 Border Utilities
Border Widths (1 - 8)
```css
.border-{n} → border-width: n px
.border-top-{n}
.border-bottom-{n}
.border-left-{n}
.border-right-{n}
```
Border Radius (0 - 100)
```css
.border-radius-{n} → border-radius: n px
```



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
