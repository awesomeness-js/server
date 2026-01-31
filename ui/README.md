# Awesomeness UI

Awesomeness UI is a utility-first CSS framework focused on responsive, dynamic layouts using a consistent, JS-driven class generator. It replaces traditional media queries with intuitive `app-size-*` modifiers.

**Awesomeness UI** is a utility-first CSS framework focused on creating **responsive, grid-based layouts** using predictable, reusable class names. It avoids media queries by using automatically applied screen-size classes.

---

## 📐 Responsive Foundation

Your layout responds to screen size using `app-size-*` classes:

```html
<body class="app-size-p">
	<div id="app"></div>
</body>
```

These classes (`app-size-p`, `app-size-t`, etc.) are added dynamically based on the screen width, so you can target styles like this:

```html
<div class="grid-1-p grid-2-t grid-4-d grid-6-xl">...</div>
```

**Size keys:**
- `p` → phone
- `t` → tablet
- `d` → desktop
- `xl` → extra large

---

## 🧩 Core Class System

Here’s a breakdown of the key layout utilities:

### 🧱 `grid-*`

Defines how many equal-width columns a container has.

```html
<div class="grid-3">...</div>
```

Responsive:

```html
<div class="grid-1-p grid-2-t grid-4-d grid-4-xl">...</div>
<div class="grid-3 grid-1-p"> three on all except phone </div>
```

---

### ↔️ `span-*`

Defines how many columns a child should span.

```html
<div class="span-2">Spans 2 columns</div>
```

Also available:  
- `.span-full` → spans full width  
- `.row-span-*` → spans rows  
- `.row-span-full` → full-height span  

Responsive variant:

```html
<div class="span-1-p span-2-t span-3-d">...</div>
```

---

### 🔄 `justify-*`

Controls horizontal alignment **inside grid containers**.

```css
.justify-center     → center content  
.justify-start      → left-align  
.justify-end        → right-align  
.justify-between    → space-between  
.justify-around     → space-around  
.justify-evenly     → space-evenly  
```

```html
<div class="justify-center-p justify-end-d">...</div>
```

---

### ↕️ `align-*`

Controls vertical alignment (applies to grid items).

```css
.align-center       → vertically center items  
.align-start        → align top  
.align-end          → align bottom  
.align-stretch      → stretch to fill  
.align-baseline     → align text baseline  
```

---

### 🎯 `start-*`, `end-*`

Control where grid items begin or end:

```css
.start-2     → grid-column-start: 2  
.end-4       → grid-column-end: 4  
.row-start-1 → grid-row-start: 1  
.row-end-3   → grid-row-end: 3  
```

Responsive:

```html
<div class="start-1-p start-3-d">...</div>
```

---

### 🔢 `order-*`

Controls item order inside a flex/grid container.

```html
<div class="order-1">First</div>
<div class="order-2">Second</div>
```

Responsive:

```html
<div class="order-1-p order-3-d">...</div>
```

---

### 📏 `gap-*`, `gap-x-*`, `gap-y-*`

Spacing between grid rows and columns.

```css
.gap-10     → gap: 10px  
.gap-x-20   → column-gap: 20px  
.gap-y-5    → row-gap: 5px  
```

Responsive:

```html
<div class="gap-4-p gap-10-d">...</div>
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


## Core
location: /awesomeness-ui/core

The core folder is what it takes to load a super minimalistic Awesomeness UI

Available tools



## Components
location: /awesomeness-ui/components

Each folder within this directory is a `component`


#### Rules
- Each component should have a unique name
- Each component can have any number of files and folders
- Each js file should export default a single function
- Each component "should" have an `index.js` file at the root level
   - It does not need to, such as a css only component or jQuery plugin


#### Component Dependencies

Components can depend on other components.
To use a component in another component, you can import it like this:

```js
// awesomeness import 'card';
// awesomeness import 'insertIntoList';
```
This will import the `card` and `insertIntoList` components.
All of its css, functions / methods, IIFs / jQuery plugins and sub-components will be available at the expected namespace.

```js 

const $list = $(`<div class="example-list"></div>`)
	.appendTo('body');

const $card = ui.card();

$card.insertIntoList($list);

```

---
### JS 

The functions will be available in the browser at the `ui` namespace
```js
ui._example()
```

---
#### Basic Components

index.js files are available at the root level of the component namespace
[/awesomeness-ui/components/_example/index.js](/awesomeness-ui/components/example/index.js)
```js
ui._example()
```

other files will be available at the component namespace
[/awesomeness-ui/components/_example/grid.js](/awesomeness-ui/components/example/grid.js)
```js 
ui._example.grid()
```


---
#### Complex Components

complex components can have any number of sub folders
[/awesomeness-ui/components/example/subComponent/index.js](/awesomeness-ui/components/example/subComponent/index.js)
```js
ui._example.subComponent()
```

sub components can have any number of files
[/awesomeness-ui/components/example/subComponent/simpleTest.js](/awesomeness-ui/components/example/subComponent/simpleTest.js)
```js
ui._example.subComponent.deep.simpleTest()
```

:warning: **Name Conflicts**
If you have multiple files with the same name in a component, they will conflict. Example:

```
awesomeness-ui/components/test/someMethod.js
awesomeness-ui/components/test/someMethod/index.js
```


---
#### IIFs

IIFs will not be available on `ui` but will be executed immediately when received in browser

This works well for **jQuery plugins** and loading **3rd party libraries**

[/awesomeness-ui/components/example/jQuery_example.js](/awesomeness-ui/components/example/example.jQuery.js)

---

### CSS

:warning: All CSS is available globally.
Do not **pollute** the global namespace.
Prefix all classes with the component name.

e.g.,

```css

.componentName-container {
	background-color: red;
	color: white;
}

.componentName-button {
	background-color: blue;
	color: white;
}

```

*Files names do not matter you can name them whatever you want*


---
## PAGES

Pages can be located anywhere your router expects a `/pages/` directory.

Each page is a folder containing the following

```
your-site/
└── pages/
    └── example/
        ├── _info.js
        ├── getData.js
        ├── js/
        │   └── init.js
        └── css/
            └── example.css
```


#### /_info.js

_info.js exports an object used by the router to determine what it needs to send back, and who can interact with it.

the `components` array allows the page to pull, and load each component prior to rendering any page content.

```js
export default {
	version: 1,
	name: '',
	description: '',
	permissions: [ '*' ],
	components: [
		'heroWordsOverText'
	]
};

```

#### /getData.js

```js

export default async function getData(awesomenessRequest) {

	const { 
		data, // payload sent by the client
		user // user information - set by the server
	} = awesomenessRequest;

	// do payload cleaning and validation here

	// do user validation here

	// return data to the client

	return { page: 'template' };

}

```

#### /scripts/init.js

example:

```js
app.pages.examplePage.init = function(responseFromGetData){

	// do stuff with data

	// state management
	app.state.create({
		title: 'Example Page',
		url: '/example-page',
		reload:function(){ app.page('examplePage'); }
	});

	// do stuff with the DOM

};
```

#### /css/example.css

Optionally, you can add a css file to the page.

Ideally, you should use component who have their own css files, but if you need to add a page specific css file, you can do so here.

```css

.example-page {
	background-color: red;
	color: white;
}

```
