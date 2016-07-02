## Clientkit

### Dev

When working on clientkit make sure you have the following tools installed:

   - For your editor: eslint, stylelint, editorconfig
   - Nodenv or similar (should match the version in .node-version)

Project has been setup to be run and debug from inside VS Code. Alternately you can run `npm start`.

### Using Mixins

When calling a mixin the first parameter is the name of the mixin and the values you want to pass to the mixin follow. You will need to use a comma to separate the values passed to the
mixin but do not have a comma following the name of the mixin. Here is an example:

```css
.btn-primary {
  @mixin button var(--color-accent), var(--color-link);
  width: 300px;
  padding: 10px 0;
}
```

Notice that there is no comma following `button` but there is for the rest of the parameters.
