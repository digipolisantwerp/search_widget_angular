# Search Smart Widget UI (Angular)

This is the Angular 5+ UI for a Smart Widget implementing a search bar with suggestions. It is matched by a corresponding back-end service which is needed when running it in remote mode.

Link to bff: https://bitbucket.antwerpen.be/projects/ASA/repos/search_api_nodejs/browse

![screenshot](example.png)

There is a demo app, see below for instructions on running it.

## How to use

### Installing

Copy the .npmrc file from this repo to your local repo to set up the link to nexusrepo.antwerpen.be npm repository.

Then install (you will need to be connected to the Digipolis network):

```sh
> npm install @acpaas-ui-widgets/ngx-search
```

Import the component in your module:

```ts
@NgModule({
  imports: [
    ...,
    SearchWidgetModule
  ],
  ...
})
```

In the index.html, include the core branding stylesheet:

```html
  <link rel="stylesheet" href="https://cdn.antwerpen.be/core_branding_scss/2.3.0/main.min.css">
```

In your template:

```html
<aui-search url="http://localhost:4200/suggestions.json"></aui-search>
```
(Replace the url of the BFF service.)


Supported attributes:
- **method**: POST or a GET method to get suggestions (default: GET)
- **language**: Language of the query suggestions
- **url**: (Api) Url to provide suggestions for a search
- **placeholder**: Specify the text to show in an empty field (default: empty)
- **searchValue**: The results comes in an array with type SearchWidgetValue
- **suggestions**: The full results array of the remote suggestions (default: string[])
- **searchIncentiveText**: The message shown when the user focuses on the input field
- **minCharacters**: Minimal characters to search in the results (default: 2)
- **noResultsText**: Text when the results are empty
- **loadingText**: Text when loading the results
- **label**: If SearchWidgetValue is an object add label to show
- **query**: This is the value of the searchwidget
- **limit**: Give a limit for suggestions per page
- **iconLeft**: Change the location of searchbox (default: false)

Events:
- **search**:  The event fired when the search is triggered


The backing service implements the following protocol:

- POST /path/to/endpoint with raw body object:
- **query**: the value of search
- **language**: the language of the search
Example: 
```json
  {
    "query":"Aank",
    "language":"NL" 
  }
```
- suggestions = JSON-encoded array of [SearchWidgetValue](src/search-widget/search-widget.types.ts) objects


CSS examples:

```css
/* Changing the color of the searchbox: */
.aui-search .aui-search-icon{
    background-color: $green;
} 
```

## Run the demo app

Set up the .npmrc (see above), then run:

```sh
> npm install
> npm start
```

Browse to [localhost:4200](http://localhost:4200)

To use the example app, you will need to have also started the corresponding back-end service.

## Contributing

We welcome your bug reports and pull requests.

Please see our [contribution guide](CONTRIBUTING.md).

## License

This project is published under the [MIT license](LICENSE.md).
