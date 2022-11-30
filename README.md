# React Frame Concept

This repository is an example on how to use React as a component library for frontends in Ruby on Rails. It is not solely for Ruby on Rails and can be used for other templating stuff as well. For testing purposes the component library [Chakra](https://chakra-ui.com/) is used. But this could easily be replaced by any other React component library.

Furthermore this project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Concept

What this code does is basicly the following;

- Create a new custom element called `<react-frame>`.
- Everything within this custom element is parsed to a JSON structure.
- This JSON is passed to a React application that renders the corresponding components.

The big benefit of doing it this way is that you can mix 'n match a server side templating language (in this example ERB) with React components.

So you can go from this structure:

```
<%= react_component 'button', text: 'My Button', color: 'primary' %>
```

To:

```
<react-frame>
    <rf-button text="My Button" color="primary"></rf-button>
</react-frame>
```

This doesn't really look like an advantage at first, but when you are going to nest components, or have text nodes inside a component this doesn't really work in the first example.

This is not so readible:

```
<%= react_component 'button',
        text: 'My Button',
        color: 'primary',
        children: { [
            {
                type: 'component',
                component: 'icon',
                icon: 'home'
            },
            {
                type: 'text',
                text: 'My Button'
            }
        ] } %>
```

With React Frame it would become:

```
<react-frame>
    <rf-button text="My Button" color="primary">
        <rf-icon icon="home"></rf-icon>
        My Button
    </rf-button>
</react-frame>
```

Also, when combined with some logic, the React Frame way is also way more readible;

```
<react-frame>
    <rf-button text="My Button" color="primary">
        <% if am_i_home? %>
            <rf-icon icon="home"></rf-icon>
        <% end >
        My Button
    </rf-button>
</react-frame>
```

vs

```
<%= react_component 'button',
        text: 'My Button',
        color: 'primary',
        children: { [
            {
                type: 'component',
                component: 'icon',
                icon: 'home'
            } if am_i_home?,
            {
                type: 'text',
                text: 'My Button'
            }
        ] } %>
```

## Things to take into account

- To make it valid HTML we need to use a prefix in front of every component name: `<[yourprefix]-[reactcomponentname]></[blabla]-[reactcomponentname]>`
- Custom elements cannot be self-closing: `<input />` is valid, `<my-element \>` is not.
- You of course still loose _a lot_ of React advantages.
- Multiple `<react-frame>`'s within each other, is no problem.
- This is more or less a way to make it easier to use a server side templating language with a React component library.

## Working on this code

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.
