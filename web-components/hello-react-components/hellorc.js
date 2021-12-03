// Create React component as a function that returns JSX
const HelloRC = () => {
  return (
    <h1>Hello, React Components!</h1>
  )
};

// Render that component to the page using XHTML syntax
ReactDOM.render(
  <HelloRC />,
  // Attach it to the "root element, the one with id of "root"
  document.getElementById('root')
);