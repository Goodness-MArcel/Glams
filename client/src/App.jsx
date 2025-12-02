import Layout from './components/layout/Layout';
import Home from './components/pages/Home';
import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap-icons/font/bootstrap-icons.css';

export default function App() {
  return (
    <Layout>
      <Home />
    </Layout>
  );
}