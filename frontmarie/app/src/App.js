import './App.css';
import { ApolloProvider } from '@apollo/client';
import client from './graphql/client';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import FilmsPage from './pages/tchat';
import '../src/assets/style.css';

function App() {
  return (
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
    <ApolloProvider client={client}>
      <Router>
        <div className="App">
        {/* <header>
            <h1>N E T F L I X</h1>
            <nav>
              <ul>
                <Link to="/films">Liste des Films</Link>
              </ul>
            </nav>
          </header> */}

          <img src='assets/titreTransparent.png'></img>
          

          {/* return <img src={titreImage} alt="img" />; */}
          <main>
            <Routes>
              <Route path="/films" element={<FilmsPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
