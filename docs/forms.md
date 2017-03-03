# Forms

## Form

```html
<form class="form">
</form>
```

## Labels

```html
<form class="form">
  <label class="spacing-xs">Example Input</label>
  <input id="exampleInput" type="text" placeholder="Example">
</form>
```

## Inputs

```html
<form class="form">
  <label class="spacing-xs">Text</label>
  <input class="spacing-sm" type="text" placeholder="Text">
  <label class="spacing-xs">Read Only</label>
  <input class="spacing-sm" type="text" value="Text can only be copied" readonly>
  <label class="spacing-xs">Email</label>
  <input class="spacing-sm" type="email" placeholder="Email">
  <label class="spacing-xs">Password</label>
  <input class="spacing-sm" type="password" placeholder="Password">
  <label class="spacing-xs">Url</label>
  <input class="spacing-sm" type="url" placeholder="Url">
  <label class="spacing-xs">Telephone</label>
  <input class="spacing-sm" type="tel" placeholder="Telephone">
  <label class="spacing-xs">Search</label>
  <input class="spacing-sm" type="search" placeholder="Search">
  <label class="spacing-xs">Number</label>
  <input class="spacing-sm" type="number" placeholder="Number">
  <label class="spacing-xs">Date</label>
  <input class="spacing-sm" type="date" placeholder="Date">
  <label class="spacing-xs">Date Time</label>
  <input class="spacing-sm" type="datetime" placeholder="Date Time">
  <label class="spacing-xs">Date Time Local</label>
  <input class="spacing-sm" type="datetime-local" placeholder="Date Time Local">
  <label class="spacing-xs">Month</label>
  <input class="spacing-sm" type="month" placeholder="Month">
  <label class="spacing-xs">Week</label>
  <input class="spacing-sm" type="week" placeholder="Week">
  <label class="spacing-xs">Time</label>
  <input class="spacing-sm" type="time" placeholder="Time">
  <label class="spacing-xs">Textarea</label>
  <textarea class="spacing-sm" placeholder="Textarea"></textarea>
  <label class="spacing-xs">Select</label>
  <select>
    <option>Option 1</option>
    <option>Option 2</option>
    <option>Option 3</option>
  </select>
</form>
```

## Error Text

```html
<form class="form">
  <div class="error">
    <label class="spacing-xs">Some input</label>
    <input class="spacing-xs" type="text" placeholder="Error">
    <small>This field is required</small>
  </div>
</form>
```

## Input Group

```html
<form class="form">
  <div class="input-group">
    <input type="text" placeholder="Enter your email">
    <button class="input-group-btn button">Sign Up</button>
  </div>
</form>
```
